FROM mysql:8.1

WORKDIR /usr/src/app

CMD ["--default-authentication-plugin=caching_sha2_password"]

ENV MYSQL_ROOT_USERNAME=root

ENV MYSQL_ROOT_PASSWORD=root

RUN mkdir -p /docker-entrypoint-initdb.d

COPY initialize.sql /docker-entrypoint-initdb.d/init.sql
