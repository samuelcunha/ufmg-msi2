FROM python:3.8-alpine
RUN apk add --virtual .build-dependencies \
            --no-cache \
            python3-dev \
            build-base \
            linux-headers \
            pcre-dev \ 
            postgresql-dev \
            gcc \
            libffi-dev \
            openssl-dev
             
RUN apk add --no-cache pcre musl-dev mariadb-dev

WORKDIR /app
COPY ./ /app

ENV COVERIT_API_ENV=prod

RUN pip install -r /app/requirements.txt;
RUN apk del .build-dependencies && rm -rf /var/cache/apk/*

EXPOSE 5000
CMD ["uwsgi", "--ini", "/app/wsgi.ini"]