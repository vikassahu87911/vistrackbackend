# Visitor Pass System Backend

This is the backend service for the Visitor Pass Management System name 'vistrack'. It is responsible for handling visitor registration, pass issuance, security check-in/check-out, and role-based access control for admin - who registers the company/manager, company/manager - who create visitors, security - who is responsible for checkin and checkout and visitor - who login to download their visit pass for verification

## Project Purpose

The system helps organizations manage visitors efficiently and securely by:

- Registering visitors before arrival
- Linking visitors to manager/company.
- Generating visitor passes
- Tracking check-in and check-out times
- Maintaining access and visitor audit logs
- Providing API support for frontend and admin dashboards

## Main Features

- Visitor registration by managers of the company.
- Pass status management: active, expired, cancelled, checkedin, checked-out.
- Visitor check-in and check-out tracking
- Role-based access for admin, company/manager, and security users
- Visitor history and reporting
- Secure authentication and authorization
- Scalable REST API architecture

## My Backend Structure

```text
system_backend/
├── controllers/
│   ├── admcontroller.js
│   ├── contatcontroller.js
│   └── visitorscontroller.js
│   
├── emailfunction/
│   └── mail.js
│
├── middleware/
│   ├── verifyadmintoken.js
│   ├── verifymanagersecuritytoken.js
│   ├── verifymanagertoken.js
│   └── verifymanagervisitortoken.js
├── models/
│   ├── administrativemodel.js
│   ├── contactmodel.js
│   └── model.js
│   
├── routers/
│   ├── admRoute.js
│   ├── contactRoute.js
│   └── visitorsRoute.js
│ 
├── .env
├── .gitignore
├── package-lock.json
├── package.json
├── readme.md
└── server.js

## Deployment
    -using render
