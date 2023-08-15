#!/bin/bash

DB_NAME="evergreen_local"
URI="mongodb://localhost:27017/$DB_NAME"
DUMP_ROOT="$TMPDIR/evg_dump"
DUMP_FOLDER="$DUMP_ROOT/$DB_NAME"

clean_up() {
    rm -rf "$DUMP_ROOT"
    echo "Cleaned up $DUMP_ROOT."
}

dump_database() {
    clean_up
    if ! mongodump --uri="$URI" -o "$DUMP_ROOT"; then
        echo "Error creating dump from $DB_NAME db."
        exit 1
    fi
    echo "Dump successfully created in $DUMP_ROOT"
}

restore_database() {
    if [ ! -d "$DUMP_FOLDER" ]; then
        echo "Error: $DUMP_FOLDER does not exist. Ensure you have a valid dump before restoring."
        exit 1
    fi

    if mongorestore --quiet --drop --uri="$URI" "$DUMP_FOLDER"; then
        echo "Successfully restored the database from $DUMP_FOLDER."
        exit 0
    else
        echo "Error restoring the database from $DUMP_FOLDER."
        exit 1
    fi
}


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
    *)
        echo "Usage: $0 {--dump|--restore|--clean-up}"
        exit 1
        ;;
esac
