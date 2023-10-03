#!/bin/bash

DB_NAME="evergreen_local"
URI="mongodb://localhost:27017/$DB_NAME"

# Define paths for storing database dumps.
DUMP_ROOT=${TMPDIR}evg_dump
DUMP_FOLDER="$DUMP_ROOT/$DB_NAME"

# Function to clean up temporary dump files.
clean_up() {
    rm -rf "$DUMP_ROOT"
    echo "Cleaned up $DUMP_ROOT."
}

# Function to reseed the database with smoke test data.
reseed_database() {
    # Change the current directory sdlschema symlink.
    if ! cd -- "$(dirname -- "$(readlink -- "sdlschema")")"; then
        echo "Unable to find Evergreen directory from the sdlschema symlink"
        exit 1
    fi
    # Load test data into the database.
    ../bin/load-smoke-data -path ../testdata/local -dbName evergreen_local -amboyDBName amboy_local
    cd - || exit
}

# Function to create a dump of the database.
dump_database() {
    clean_up
    # Use 'mongodump' to create a database dump.
    if ! mongodump --uri="$URI" -o "$DUMP_ROOT"; then
        echo "Error creating dump from $DB_NAME db."
        exit 1
    fi
    echo "Dump successfully created in $DUMP_ROOT"
}

# Function to reseed the database and then create a dump.
reseed_and_dump_database() {
    reseed_database
    dump_database
}

# Function to restore the database from a dump.
restore_database() {
    # Check if the specified dump folder exists.
    if [ ! -d "$DUMP_FOLDER" ]; then
        echo "Error: $DUMP_FOLDER does not exist. Ensure you have a valid dump before restoring."
        exit 1
    fi

    MAX_RETRIES=2

    # Use 'mongorestore' to restore the database from the dump.
    for ((retry=0; retry<=MAX_RETRIES; retry++)); do
        if mongorestore --quiet --drop --uri="$URI" "$DUMP_FOLDER"; then
            echo "Successfully restored the database from $DUMP_FOLDER."
            exit 0
        else
            echo "Error restoring the database from $DUMP_FOLDER. Retry attempt: $retry"
            if [ $retry -eq $MAX_RETRIES ]; then
                echo "Max retries reached. Exiting."
                exit 1
            fi
            sleep 3
        fi
    done
}

# Check the command-line argument to determine the action to perform.
case "$1" in
    --dump)
        dump_database
        ;;
    --restore)
        restore_database
        ;;
    --clean-up)
        clean_up
        ;;
    --reseed)
        reseed_database
        ;;
    --reseed-and-dump)
        reseed_and_dump_database
        ;;
    *)
        echo "Usage: $0 {--dump|--restore|--clean-up|--reseed-and-dump}"
        exit 1
        ;;
esac
