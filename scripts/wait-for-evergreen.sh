# This script waits for Evergreen to be up and running.

# Listen on port 9090 for Evergreen.
echo "Waiting for Evergreen to be up and running..."
while ! nc -z localhost 9090; do
    sleep 1
done

echo "Evergreen is up and running!"
