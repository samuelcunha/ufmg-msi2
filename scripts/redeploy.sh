#!bin/bash

docker pull samuelcunha/react-nginx:latest
docker pull samuelcunha/flask-api:latest
docker stop coverit-api
docker stop coverit-web
docker system prune -f
docker run -d --name=coverit-web -p 80:80 samuelcunha/react-nginx:latest
docker run -d --name=coverit-api -p 5000:5000 samuelcunha/flask-api:latest