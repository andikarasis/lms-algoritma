# Library Management System and Algoritma Test

Backend and Algoritma Test

## Description
This backend is running NodeJs and ExpressJs with PostgreSQL database.
* Members can borrow books with conditions
* Member returns the book with conditions
* Check the books
* Member

## Getting Started

### Setting Up
* Create a database using the name you want
* Create a table using a file named **schema-db.txt**
* Setup PostgreSQL Database (host, port, user, password, name) on file **db.json**

### Executing program

* Installing npm
```
$ npm install
```

* Starting Application on Local
```
$ npm run start
```

* Starting Application on Server with PM2
```
$ npm run deploy
```

### Step Ussage
POSTMAN API COLLECTION
```
Import file LMS.postman_collection.json to your postman
```
* Create Admin from **Moderator** API
* Login Admin to get token then replace admin token existing with new admin token
* Create User from **Admin** Create User API
* Login User to get token then replace user token existing with new user token
* Happy try LMS API

## Algoritma

Algoritma Test is includes in Postman Collection.

## Authors

Contributors names and contact info

Restu Rachmi Andika  
[andikaresturachmi@gmail.com](mailto:andikaresturachmi@gmail.com)

## Version History

* 0.1
    * Initial Release