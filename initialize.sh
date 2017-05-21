echo "-> Killing all running services, in case this is not the first time you run this script..."
docker-compose down > /dev/null 2>&1

echo "\n-> Spinning up all the services with docker compose..."
(docker-compose build && docker-compose up -d) > /dev/null 2>&1

echo "\n-> Inserting mock data into the db..."
(cd mock-data && npm install > /dev/null 2>&1 && node setupDatabase && node .)

clear

echo "--------------------------------------------------"
echo "\n"
echo "Congrutulations, everything was set up succesfully."
echo "\n"
echo "Open your browser at http://localhost:3000"
echo "\n"
echo "If you are not seeing anything right away, then"
echo "webpack might still be building in the background"
echo "--------------------------------------------------"
echo "\n"

