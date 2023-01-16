COPY zipcode ( latitude, longitude,city_id, state_id,country_id,zipcode)
/* Absolute path to copy commmand will change */
FROM '/Users/areeba-iftikhar/Desktop/zipcode.csv'
DELIMITER ',' CSV HEADER;

update zipcode set geolocation=ST_GeographyFromText('POINT('||longitude||' '||latitude||')');

/*
COPY [Table Name](Optional Columns)
FROM '[Absolute Path to File]'
DELIMITER '[Delimiter Character]' CSV [HEADER];
*/