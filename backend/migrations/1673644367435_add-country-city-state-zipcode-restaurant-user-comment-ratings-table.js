/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
  CREATE EXTENSION IF NOT EXISTS postgis;
  
  CREATE TABLE "country" (
    "id" serial PRIMARY KEY ,
    "name" varchar NOT NULL UNIQUE,
    "created_at" timestamptz NOT NULL DEFAULT (now())
  );
  
  CREATE TABLE "city" (
    "id" serial PRIMARY KEY ,
    "name" varchar NOT NULL,
    "country_id" integer NOT NULL,
    "state_id" integer NOT NULL,
    "created_at" timestamptz NOT NULL DEFAULT (now()),
    CONSTRAINT city_unique UNIQUE (name, country_id, state_id)
  );
  
  CREATE TABLE "state" (
    "id" serial PRIMARY KEY ,
    "name" varchar NOT NULL,
    "country_id" integer NOT NULL,
    "created_at" timestamptz NOT NULL DEFAULT (now())
  );
  
  CREATE TABLE "zipcode" (
    "id" serial PRIMARY KEY,
    "state_id" integer NOT NULL,
    "city_id" integer NOT NULL,
    "zipcode" varchar NOT NULL,
    "longitude" double precision NOT NULL,
    "latitude" double precision NOT NULL,
    "geolocation" geography(POINT,4326),
    "country_id" integer NOT NULL,
    "created_at" timestamptz NOT NULL DEFAULT (now())
  );
  
  CREATE TABLE "restaurant" (
    "id" serial PRIMARY KEY,
    "name" varchar NOT NULL,
    "description" varchar,
    "menu_url" varchar,
    "webiste_url" varchar,
    "state_id" integer NOT NULL,
    "city_id" integer NOT NULL,
    "country_id" integer NOT NULL,
    "zipcode" varchar NOT NULL,
    "longitude" double precision NOT NULL,
    "latitude" double precision NOT NULL,
    "geolocation" geography(point,4326),
    "created_at" timestamptz NOT NULL DEFAULT (now()),
    "updated_at" timestamptz NOT NULL DEFAULT (now())
  );
  
  CREATE TABLE "user" (
    "id" serial PRIMARY KEY,
    "email" varchar NOT NULL,
    "password" varchar NOT NULL,
    "username" varchar NOT NULL,
    "created_at" timestamptz NOT NULL DEFAULT (now())
  );
  
  CREATE TABLE "comment" (
    "id" serial PRIMARY KEY,
    "restaurant_id" integer NOT NULL,
    "user_id" integer NOT NULL,
    "comment" varchar,
    "created_at" timestamptz NOT NULL DEFAULT (now()),
    "updated_at" timestamptz NOT NULL DEFAULT (now())
  );
  
  CREATE TABLE "rating" (
    "id" serial PRIMARY KEY,
    "restaurant_id" integer NOT NULL,
    "user_id" integer NOT NULL,
    "rating" varchar,
    "created_at" timestamptz NOT NULL DEFAULT (now()),
    "updated_at" timestamptz NOT NULL DEFAULT (now())
  );

  CREATE TABLE "foodtag" (
    "id" serial PRIMARY KEY,
    "name" varchar NOT NULL,
    "created_at" timestamptz NOT NULL DEFAULT (now())
  );

  CREATE TABLE "restaurant_foodtag" (
    "id" serial PRIMARY KEY,
    "restaurant_id" integer NOT NULL,
    "foodtag_id" integer NOT NULL,
    "created_at" timestamptz NOT NULL DEFAULT (now())
  );

  CREATE TABLE "image" (
    "id" serial PRIMARY KEY,
    "url" varchar NOT NULL,
    "created_at" timestamptz NOT NULL DEFAULT (now())
  );

  CREATE TABLE "restaurant_image" (
    "id" serial PRIMARY KEY,
    "restaurant_id" integer NOT NULL,
    "image_id" integer NOT NULL,
    "created_at" timestamptz NOT NULL DEFAULT (now()),
    "updated_at" timestamptz NOT NULL DEFAULT (now())
    
  );

  ALTER TABLE "restaurant_image" ADD FOREIGN KEY ("restaurant_id") REFERENCES "restaurant" ("id");

  ALTER TABLE "restaurant_image" ADD FOREIGN KEY ("image_id") REFERENCES "image" ("id");

  ALTER TABLE "restaurant_foodtag" ADD FOREIGN KEY ("restaurant_id") REFERENCES "restaurant" ("id");

  ALTER TABLE "restaurant_foodtag" ADD FOREIGN KEY ("foodtag_id") REFERENCES "foodtag" ("id");

  ALTER TABLE "city" ADD FOREIGN KEY ("country_id") REFERENCES "country" ("id");
  
  ALTER TABLE "state" ADD FOREIGN KEY ("country_id") REFERENCES "country" ("id");
  
  ALTER TABLE "zipcode" ADD FOREIGN KEY ("state_id") REFERENCES "state" ("id");
  
  ALTER TABLE "zipcode" ADD FOREIGN KEY ("city_id") REFERENCES "city" ("id");
  
  ALTER TABLE "zipcode" ADD FOREIGN KEY ("country_id") REFERENCES "country" ("id");
  
  ALTER TABLE "restaurant" ADD FOREIGN KEY ("city_id") REFERENCES "city" ("id");
  
  ALTER TABLE "restaurant" ADD FOREIGN KEY ("state_id") REFERENCES "state" ("id");
  
  ALTER TABLE "restaurant" ADD FOREIGN KEY ("country_id") REFERENCES "country" ("id");
  
  ALTER TABLE "comment" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");
  
  ALTER TABLE "rating" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");
  
  ALTER TABLE "comment" ADD FOREIGN KEY ("restaurant_id") REFERENCES "restaurant" ("id");
  
  ALTER TABLE "rating" ADD FOREIGN KEY ("restaurant_id") REFERENCES "restaurant" ("id");   
      `);
};

exports.down = (pgm) => {
  pgm.sql(`DROP TABLE country CASCADE;
    
        DROP TABLE state CASCADE;
        
        DROP TABLE city CASCADE;
        
        DROP TABLE zipcode CASCADE;
        
        DROP TABLE restaurant CASCADE;
        
        DROP TABLE comment CASCADE;
        
        DROP TABLE rating CASCADE;
        
        DROP TABLE "user" CASCADE;
        `);
};
