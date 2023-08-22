# Database deployment
## Pre-requisites
Mostly **Meal sharing** apps are created using MySQL DB as a default choice, however, Render does not support MySQL to be deployed as easily as PostgreSQL. For our deployment process we awill be using PostgreSQL, which means that we need to do some small changes in our code and connect to a different DB.

#### Code changes
First we need to change configurations of our DB in a knex file
``` js
const knex = require("knex")({
  client: "postgres", // We basically need to change the client that we are using to postgres
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  pool: {
    min: 2,
    max: 10
  },
});
```
Since we are working with knex - it handles the queries by itself, so we do not have to apply changes in our requests.

Additionally we need to install a Postgres package that be used by knex internally. Run:
``` sh
npm install --save pg
```

#### Env changes
We also need to add changes to our `.env` file.
```
DB_HOST = 127.0.0.1 
DB_USER = your_user
DB_PASSWORD = your_pass
DB_NAME = your_db_name
DB_PORT = 5432
``` 
Mostly you have your user, database and password, but PosgreSQL works on a different port, which is 5432

#### Local DB changes
Before deploying anything we need to test it localy, so that we are sure that our application is working. For the PostgresSQL we would also be using Docker image.
Open your terminal and run:
``` sh
docker pull postgres:14
```
in order to download the image of 14th version to your machine. Then run the image 
``` sh
docker run -e POSTGRES_PASSWORD=lol --name=pg --rm -d -p 5432:5432 postgres:14
```
where:
- -e - is an environment of the image (POSTGRES_PASSWORD - set your desired password)
- --name - name of the container
- --rm - automatically remove the container when it exits
- -d - run container in background and print container ID
- -p - port forwariding (you specify what part is used in the container and what is exposed, we are using the same)
- postgres:14 - tag of image with version

Standard Username and Database are **postgres** 

After all installations, you would be able to connect to the PostgreSQl on your machine.
Install extension for VSCode if you haven't already:
[Link](https://marketplace.visualstudio.com/items?itemName=cweijan.vscode-mysql-client2)

![Extension image](db_1.png)

Opening the extension you would see the configuration that you can apply and connect to the working DB

![Configuration](db_2.png)

#### Queries change
MySQL and PostgreSQL both have similar SQL queries with just small difference.
After connecting to the DB you would be able to write queries through the console or the VSCode extension in order to create tables and fill your application with data.

For the **Meal Sharing** project we would need:
``` SQL
 CREATE TABLE meals(
   id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
   title VARCHAR(200) NOT NULL,
   description  TEXT NOT NULL,
   location VARCHAR(100),
   when_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   max_reservations INT  NOT NULL,
   price DECIMAL(10,2),  
   created_date DATE
);

CREATE TABLE reviews(
   id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
   title VARCHAR(100) NOT NULL,
   description TEXT NOT NULL,
   meal_id INT NOT NULL references meals(id),
   stars INT,  
   created_date DATE
);

 CREATE TABLE reservations(
   id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
   number_of_guests INT not null,
   meal_id INT NOT NULL references meals(id),
   created_date TIMESTAMP,
   contact_phonenumber VARCHAR(50),
   contact_name VARCHAR(100),
   contact_email VARCHAR(100)
);
```

And then in order to populate the DB (fill it with data).
``` SQL
INSERT INTO meals (title, description, max_reservations, location, when_date, price, created_date)
VALUES 
    ('Mediterranean Delicacies', 'Experience the rich flavors of the Mediterranean with a variety of dishes.', 9, '303 Sunset Ave', '2023-08-14 19:00:00', 20.00, '2023-08-06 18:40:00'),
    ('Seafood Extravaganza', 'Delight in a seafood feast featuring an assortment of ocean delights.', 10, '505 Oceanview Rd', '2023-08-18 17:30:00', 28.50, '2023-08-06 20:15:00'),
    ('Farm-to-Table Brunch', 'Enjoy a fresh farm-to-table brunch experience with locally sourced ingredients.', 6, '707 Green Acres Ln', '2023-08-17 11:00:00', 16.99, '2023-08-06 22:05:00'),
    ('Spicy Curry Night', 'Indulge in the bold and spicy flavors of traditional curry dishes.', 8, '909 Spice Blvd', '2023-08-09 20:30:00', 17.50, '2023-08-06 23:30:00'),
    ('Sweet Dessert Buffet', 'Satisfy your sweet tooth with an array of delectable desserts and treats.', 15, '1010 Sugar St', '2023-08-16 14:00:00', 12.25, '2023-08-07 01:15:00');
```

When all steps are made, run your NodeJS server and try accessing your api, fetching meals and checking that everything works.

## DB Deployment process
When you are ensured that everything works as intended, you can start deploying the app to the **Render** platform

![Render db](db_3.png)

Click on the **New PosgreSQL** button and you will be navigated to a new page

![New DB](db_4.png)

Where name - is the name of a DB that is presented to you in the dashboard, Database - is the name of the db that you are accessing, User - is the username that would acces the DB. Password is generated by the Render service.

After submitting your info - you will see the result and details.

![New Db Created](db_5.png)

The part that you are interested in is under **Connections** section

![New DB Connections](db_6.png)

You should see your database name that you have made and all other details that are generated for you
 
 - password - the password that was created for you db
 - Internal Database URL - DB url that could be used internally in Render infrastructure
 - External Database URL - url by which you can access your DB from "outside"
 - PSQL Command - command to execute by `psql` command on your machine

In the final step we need to check that we can connect to our DB from our machine and execute queries in order to create tables.

##### VSCode
We can use VSCode extension in order to connect to the external DB as well. Navigate to the page with your **Connections** details - you would need to grab data from there. 
Open your VSCode extension and create a new connection. Choose **PostgreSQL** and fill in the information

![External connectio](db_9.png)

Make sure that you are connecting to the right type of DB (PostgreSQL in this case).
Make sure to click on the SSL connection in the bottom (beacuse we are establishing external connection).
For the **Host** you need to copy your **External Database URL**, but you only need to paste a small portion of it

**Example:** Your copied link is - 
`postgres://root:n9RPnGcmnEPr3n1sfgpGqTywc1I0b01l@erf-cjflbk3bq0er739v1h53-a.frankfurt-postgres.render.com/database_name` - that means that you need to copy ONLY the part between @ and / - `erf-cjflbk3bq0er739v1h53-a.frankfurt-postgres.render.com`

##### Windows
For the windows installation please follow [this guide](https://www.guru99.com/download-install-postgresql.html)

After the installation you would be able to connect to the DB either with pgAdmin program, or pSQL (be sure to enter correct information)
##### Linux
For the linux installation please follow [this guide](https://www.guru99.com/install-postgresql-on-ubuntu.html)

##### Mac
For the mac installation please folloe [this guide](https://wiki.postgresql.org/wiki/Homebrew)

When application would be installed you can either connect to your db via External Database URL using your PGAdmin app, or open the terminal and run PSQL Command that you can copy from the site to your terminal.

![Terminal result](db_7.png)

From here you can execute queries that are presented in this guide. After executing all your querries successfully, you can run `\d` command to check that your tables exist.

![Tables result](db_8.png)
