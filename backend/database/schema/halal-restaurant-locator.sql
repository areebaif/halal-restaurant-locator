CREATE TABLE "country" (
  "id" serial PRIMARY KEY,
  "name" varchar NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "city" (
  "id" serial PRIMARY KEY,
  "name" varchar NOT NULL,
  "country" integer NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "state" (
  "id" serial PRIMARY KEY,
  "name" varchar NOT NULL,
  "country" integer NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "zipcode" (
  "id" serial PRIMARY KEY,
  "state" integer NOT NULL,
  "city" integer NOT NULL,
  "zipcode" VARCHAR NOT NULL,
  "longitude" float NOT NULL,
  "latitude" float NOT NULL,
  "geolocation" geography(point,4326) NOT NULL,
  "country" integer NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "restaurant" (
  "id" serial PRIMARY KEY,
  "name" varchar NOT NULL,
  "state" integer NOT NULL,
  "city" integer NOT NULL,
  "country" integer NOT NULL,
  "zipcode" VARCHAR NOT NULL,
  "longitude" float NOT NULL,
  "latitude" float NOT NULL,
  "geolocation" geography(point,4326) NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now())
);

CREATE TABLE "user" (
  "id" serial PRIMARY KEY,
  "email" varchar NOT NULL,
  "password" varchar NOT NULL,
  "username" varchar NOT NULL
);

CREATE TABLE "comment" (
  "id" serial PRIMARY KEY,
  "restaurant" integer NOT NULL,
  "user" integer NOT NULL,
  "comment" varchar
);

CREATE TABLE "rating" (
  "id" serial PRIMARY KEY,
  "restaurant" integer NOT NULL,
  "user" integer NOT NULL,
  "rating" varchar
);

ALTER TABLE "city" ADD FOREIGN KEY ("country") REFERENCES "country" ("id");

ALTER TABLE "state" ADD FOREIGN KEY ("country") REFERENCES "country" ("id");

ALTER TABLE "zipcode" ADD FOREIGN KEY ("state") REFERENCES "state" ("id");

ALTER TABLE "zipcode" ADD FOREIGN KEY ("city") REFERENCES "city" ("id");

ALTER TABLE "zipcode" ADD FOREIGN KEY ("country") REFERENCES "country" ("id");

ALTER TABLE "restaurant" ADD FOREIGN KEY ("city") REFERENCES "city" ("id");

ALTER TABLE "restaurant" ADD FOREIGN KEY ("state") REFERENCES "state" ("id");

ALTER TABLE "restaurant" ADD FOREIGN KEY ("country") REFERENCES "country" ("id");

ALTER TABLE "comment" ADD FOREIGN KEY ("user") REFERENCES "user" ("id");

ALTER TABLE "rating" ADD FOREIGN KEY ("user") REFERENCES "user" ("id");

ALTER TABLE "comment" ADD FOREIGN KEY ("restaurant") REFERENCES "restaurant" ("id");

ALTER TABLE "rating" ADD FOREIGN KEY ("restaurant") REFERENCES "restaurant" ("id");
