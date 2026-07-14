#!/bin/bash

export PGPASSWORD=postgres
DB_HOST="localhost"
DB_USER="postgres"

echo "Seeding Auth DB..."
psql -h $DB_HOST -U $DB_USER -d auth_db -f ./scripts/seeds/01_auth_seed.sql

echo "Seeding Category DB..."
psql -h $DB_HOST -U $DB_USER -d category_db -f ./scripts/seeds/02_category_seed.sql

echo "Seeding Task DB..."
psql -h $DB_HOST -U $DB_USER -d task_db -f ./scripts/seeds/03_task_seed.sql

echo "Seeding Collaboration DB..."
psql -h $DB_HOST -U $DB_USER -d collaboration_db -f ./scripts/seeds/04_collaboration_seed.sql

echo "Seeding Media DB..."
psql -h $DB_HOST -U $DB_USER -d media_db -f ./scripts/seeds/05_media_seed.sql

echo "Seeding completed."