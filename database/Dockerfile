FROM mysql:8.0.34

EXPOSE 3306
COPY ["./generated.sql", "./docker-entrypoint-initdb.d/1.sql"]