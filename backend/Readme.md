## One Time Setup to backend application in Development Mode:

- you need a postqres database locally installed with some dummy data. This is temporary until the development database is hosted in cloud e.t.c. Please follow the steps below to install postqres locally and populate it with dummy data

### Install Dependencies

- Run the following command to install all the dependencies in the root of the backend folder:

`npm install`

### Install Local Development Database

- Install postqres locally on your machine [downoad link here](https://www.postgresql.org/download/)

- Install pgAdmin locally on your machine [download link here](https://www.pgadmin.org/download/)

- Create database using pgAdmin: Open pgAdmin and under browser in the top left corner navigate to server -> localhost and create a new database with database name `halal-locator`. If you have created the database succesfully, you should have halal-locator listed under servers -> localhost -> databases

- Open your terminal and navigate to backend folder. Run the command below. Depending on your operating system, the command to connect to the database will slightly change. We will use this command to create tables in the halal locator database.

- you should put your DB connection string to `DATABASE_URL` environment variable and `run npm run migrate up`. (e.g. `DATABASE_URL=postgres://[USERNAME]:[PASSWORD]@[POSTQRES_HOST]:[POSTQRES_PORT]/halal-locator npm run migrate up`). Hence, if you have postqres host and postqres port set up as defualt then following is an example of mac DATBASE_URL connection string along with `npm run migrate up` command.

`DATABASE_URL=postgres://test@localhost:5432/halal-locator npm run migrate up`

- Now you should have all the tables created in your halal-locator database. You can check this by navigating to pgAdmin -> servers -> localhost -> halal-locator -> Schemas -> Public -> Tables. You should have 15 tables in total such as city, restaurant, country e.t.c

- Navigate to backend/database/schema/1-migration-table-copy-command.sql and follow the instructions in the file.
