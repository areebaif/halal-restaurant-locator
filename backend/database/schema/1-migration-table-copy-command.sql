/* The order in which these commands are executed matters

1 - Copy csv files to your desktop to load data into postqres database
2 - In the current folder copy city.csv, state.csv, zipcode.csv on your desktop. 
3 - Change the username in absolute file path below to your username. You should change file path username 3 time in total.
4 - Open pgAdmin navigate to server -> localhost -> database -> halal-locator -> right click on halal-locator and click query tools.
5 - Select Query in the new window and copy paste all of the below commands and run them

Congratulations your database in populated!!
*/

insert into country (id,name) values (1,'USA');


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

insert into street (id,name, city_id, state_id, zipcode_id, country_id)
values (1,'2801 Nicollet Ave', 16012,30,19002,1);

insert into street (id,name, city_id, state_id, zipcode_id, country_id)
values (2,'720 Washington Ave SE', 16012,30,19008,1);

insert into street (id,name, city_id, state_id, zipcode_id, country_id)
values (3,'1221 W Lake St #106', 16012,30,19002,1);

insert into street (id,name, city_id, state_id, zipcode_id, country_id)
values (4,'9952 Zilla St NW', 16012,30,19027,1);

insert into restaurant (id,name,street_id,state_id,city_id,country_id, zipcode_id,latitude, longitude)
values (1,'Marhaba Grill',1,30,16012,1,19002 ,44.95195, -93.27738);

insert into restaurant (id,name,street_id,state_id,city_id,country_id, zipcode_id,latitude, longitude)
values (2,'Afro Deli & Grill',2,30,16012,1,19008 ,44.97368,-93.22749);

insert into restaurant (id,name,street_id,state_id,city_id,country_id, zipcode_id,latitude, longitude)
values (3,'Darbar India Grill & Bar',3,30,16012,1,19002,44.94831,-93.29501);

insert into restaurant (id,name,street_id,state_id,city_id,country_id, zipcode_id,latitude, longitude)
values (4,'Marhaba Grill',4,30,16012,1,19027 ,45.15068, -93.30027);

/*
GENERAL COPY COMMAND
COPY [Table Name](Optional Columns)
FROM '[Absolute Path to File]'
DELIMITER '[Delimiter Character]' CSV [HEADER];
*/





