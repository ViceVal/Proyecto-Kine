# Deployment Guide

## Frontend

1. **Install dependencies:**

    ```bash
    npm install
    ```

2. **Build the application:**

    ```bash
    npm run build
    ```

    This will create a `dist` directory with the production-ready application.

## Backend

1. **Navigate to the server directory:**

    ```bash
    cd server
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Configure environment variables:**
    Create a `.env` file in the `server` directory with the following variables:

    ```env
    PGHOST=kine-app-db.ccnqye4wgpbx.us-east-1.rds.amazonaws.com
    PGPORT=5432
    PGUSER=admin_kine
    PGPASSWORD=kineappdb
    PGDATABASE=postgres
    PGSSL=true
    PORT=4000
    ```

    Replace the placeholders with your actual PostgreSQL credentials.
4. **Start the server:**

    ```bash
    npm start
    ```

## Deployment Platforms

### Heroku

1. **Create a Heroku app:**

    ```bash
    heroku create
    ```

2. **Set environment variables:**
    Use the Heroku CLI or the Heroku dashboard to set the environment variables mentioned above.
3. **Deploy the backend:**

    ```bash
    git push heroku main
    ```

4. **Deploy the frontend:**
    You can deploy the frontend to a static hosting service like Netlify or Vercel.

### AWS

1. **Backend:**
    * Use EC2 or Elastic Beanstalk to deploy the Node.js backend.
    * Configure environment variables in the AWS console.
    * Use a managed PostgreSQL service like RDS.
2. **Frontend:**
    * Use S3 and CloudFront to deploy the static frontend files.

## Notes

* Ensure that the PostgreSQL database is running and accessible from the backend.
* Configure CORS properly to allow requests from the frontend domain.
* Use a process manager like PM2 to ensure that the backend server stays online.
