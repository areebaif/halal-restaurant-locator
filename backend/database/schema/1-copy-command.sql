/* the order of these commands matter so please do them in order */

/* 1 */
insert into country (name) values ('USA')

/* 2 */
COPY state ( id, name, country_id)
/* Absolute path to copy commmand will change */
FROM '/Users/areeba-iftikhar/Desktop/state.csv'
DELIMITER ',' CSV HEADER;

/* 3 */
COPY city ( id, name, state_id, country_id)
/* Absolute path to copy commmand will change */
FROM '/Users/areeba-iftikhar/Desktop/city.csv'
DELIMITER ',' CSV HEADER;

/* 4 */
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





