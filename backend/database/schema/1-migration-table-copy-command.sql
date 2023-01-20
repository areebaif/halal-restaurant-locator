/* the order of these commands matter so please do them in order */

/* 1 migration */

DATABASE_URL=postgres://areeba-iftikhar@localhost:5432/halal-locator npm run migrate up

/* 2 table value commands */

insert into country (name) values ('USA')


COPY state ( id, name, country_id)
/* Absolute path to copy commmand will change */
FROM '/Users/areeba-iftikhar/Desktop/state.csv'
DELIMITER ',' CSV HEADER;


COPY city ( id, name, state_id, country_id)
/* Absolute path to copy commmand will change */
FROM '/Users/areeba-iftikhar/Desktop/city.csv'
DELIMITER ',' CSV HEADER;


COPY zipcode ( id, zipcode, latitude, longitude,city_id, state_id,country_id)
/* Absolute path to copy commmand will change */
FROM '/Users/areeba-iftikhar/Desktop/zipcode.csv'
DELIMITER ',' CSV HEADER;

update zipcode set geolocation=ST_GeographyFromText('POINT('||longitude||' '||latitude||')');


/*
GENERAL COPY COMMAND
COPY [Table Name](Optional Columns)
FROM '[Absolute Path to File]'
DELIMITER '[Delimiter Character]' CSV [HEADER];
*/





