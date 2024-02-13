# Carus prototype

In this directory, you will find the project assingment "Carus" of Team 19 


## How to start the application

You have two different ways to start the application.

1. You can use either docker to build and start docker containers with the provided docker file 
- Navigate into the folder "prototype"
- Use "docker-compose up"

2. You can run the front and backend in seperate terminal instances
- backend -> navigate into the folder backend -> npm install -> npm run start
- frontend -> navigate into the folder frontend/carus -> npm install -> npm run start

## Provided user accounts

Carus uses a 2-tier account system. It consist of normal users and admin's. Admins can do everything what a user can and verify certain information like identity Card, driving license, car documents. This is crucial for the rental process and will be explained in details later.

We will provide you with four different user accounts. To login, simply enter the e-mail and the password at [login page](http://localhost:3000/login) **Please use for testing only user testuser1@carus.com and testuser4@carus.com.**. testuser2@carus.com and testuser3@carus.com will be used during the demo session. Please feel free to add your own users and use your own emails to get the full user experience.

```
| email                   | password             |
| ------------------------| ---------------------|
|  testuser1@carus.com    |  123123123123        |
|  testuser2@carus.com    |  123123123123        |
|  testuser3@carus.com    |  123123123123        |
|  testuser4@carus.com    |  123123123123        |
|  adminuser1@carus.com   |  123123123123        |
```

## Access to the database
Use Mongo DB Atlas with the following connection link: mongodb+srv://SebaUser:SebaSummer2023@cluster0.t89hhxi.mongodb.net/
Alternative: Login to https://account.mongodb.com/account/login with tim.obertrifter@tum.de - SEBASummer2023

## Validate user / car information
When a user / car is created, the following information has to be approved by the admin via a Postman requests to the backend: 
- identity card
- driving license
- car documents
 
To do so, follow these steps:

1. Login to Postman in as an admin user:
POST http://localhost:5000/api/auth/login
JSON Body:
{
    "email": "{PLACEHOLDER ADMIN EMAIL}",
    "password": "{PLACEHOLDER ADMIN PASSWORD}"
}

2. Retrieve the token to send it in the upcoming requests as a Bearer token

3. Validate Identity Card:
PATCH localhost:5000/api/user/updateIdentityCardStatus
JSON Body:
{
    "userID": "{PLACEHOLDER USER ID}", (FROM PROFILE LINK)
    "identityCardStatus": "Verified"
}

4. Validate Driving License:
PATCH localhost:5000/api/user/updateDrivingLicenseStatus
JSON Body:
{
    "userID": "{PLACEHOLDER USER ID}", (FROM PROFILE LINK)
    "drivingLicenseClasses": ["B"], (OTHER POSSIBILITIES: "B1", "BE")
    "drivingLicenseStatus": "Verified"
}

4. Validate Car documents:
PATCH localhost:5000/api/car/validateCarOwnership
JSON Body:
{
    "carID": "{PLACEHOLDER CAR ID (FROM CAR PROFILE LINK)}",
    "drivingLicense": "B", (OTHER POSSIBILITIES: "B1", "BE")
    "carOwenrshipVerificationStatus": "Verified",
    "licensePlateNumber": "{PLACEHOLDER PLATE NUMBER}" (e.g. "M-VW-1969")
}

## Authors and acknowledgment
Tim Obertrifter, Artemiy von Tsurikov, Stefan Janker and Tim Cremer are the authors of this project. They are a group of students from the TU Munich and created this project in combination with the lecture "Software Engineering for Business Applications - Master Course"

