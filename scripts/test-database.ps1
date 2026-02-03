# This script contains commands to test the database functionality.

# Command to count the number of users in the database
docker exec -it identity-provider-postgres psql -h localhost -U postgres -d cloud_db -c "SELECT COUNT(*) FROM users;"

# Command to check the database connection
docker exec -it identity-provider-postgres psql -h localhost -U postgres -d cloud_db
