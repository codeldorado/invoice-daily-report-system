# Invoice and Daily Sales Report System

## Overview

The Invoice and Daily Sales Report System is a microservice-based application that allows users to create invoices for sales transactions and automatically generates a daily sales summary report. The report is sent via email at 12:00 PM each day. The system utilizes NestJS, MongoDB, RabbitMQ, and Docker to provide a scalable and reliable solution.

### Key Features

- **Invoice Creation**: Create invoices with customer details, items, and amounts.
- **Daily Sales Report**: Automatically generates a daily sales summary report at noon every day.
- **Email Notification**: The report is sent via a RabbitMQ queue, where a consumer service processes and sends the report via email.
- **Microservice Architecture**: Separates responsibilities into two services (`invoice-service` and `email-sender`), ensuring better maintainability and scalability.

## Prerequisites

- **Node.js** (version 14.x or later)
- **npm** (comes with Node.js)
- **Docker** and **Docker Compose**
- **Nest CLI**: Install globally with `npm install -g @nestjs/cli`

## Running the Application

To run the entire application, including installing dependencies and building the services, use Docker Compose with the following command:

```
docker-compose up --build
```

This command will:

- Build the Docker images for both invoice-service and email-sender, installing necessary dependencies.
- Start MongoDB and RabbitMQ.
- Launch both services (invoice-service and email-sender).

### Services Started:

- MongoDB: Accessible at port 27017 (default).
- RabbitMQ: Management interface accessible at http://localhost:15672 (default user: guest, password: guest).
- Invoice Service: Accessible at http://localhost:3000.
- Email Sender Service: Runs in the background, processing messages from RabbitMQ.

## API Endpoints

### Invoice Service

- **POST /invoices: Create a new invoice**

```
{
  "customer": "John Doe",
  "amount": 150,
  "reference": "INV12345",
  "items": [
    { "sku": "ITEM001", "qt": 2 },
    { "sku": "ITEM002", "qt": 1 }
  ]
}

```

- **GET /invoices/**

Retrieve a specific invoice by ID

- **GET /invoices: Retrieve a list of all invoices**

## Testing

Both services include unit and integration tests. To run the tests, navigate to each service directory and run:

```
# For invoice-service
cd invoice-service
npm run test

# For email-sender
cd email-sender
npm run test
```
