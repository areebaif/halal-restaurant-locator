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
  "zipcode" string NOT NULL,
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
  "zipcode" string NOT NULL,
  "longitude" float NOT NULL,
  "latitude" float NOT NULL,
  "geolocation" geography(point,4326) NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT (now())
);

ALTER TABLE "city" ADD FOREIGN KEY ("country") REFERENCES "country" ("id");

ALTER TABLE "state" ADD FOREIGN KEY ("country") REFERENCES "country" ("id");

ALTER TABLE "zipcode" ADD FOREIGN KEY ("state") REFERENCES "state" ("id");

ALTER TABLE "zipcode" ADD FOREIGN KEY ("city") REFERENCES "city" ("id");

ALTER TABLE "zipcode" ADD FOREIGN KEY ("country") REFERENCES "country" ("id");

ALTER TABLE "restaurant" ADD FOREIGN KEY ("city") REFERENCES "city" ("id");

ALTER TABLE "restaurant" ADD FOREIGN KEY ("state") REFERENCES "state" ("id");

ALTER TABLE "restaurant" ADD FOREIGN KEY ("country") REFERENCES "country" ("id");
