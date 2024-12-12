# Money Transfer App

## Overview

This Money Transfer App is a backend-only API designed to handle essential fintech functionalities such as user authentication, bank account creation, deposits, money transfers, and transaction history retrieval. The app is built using **Node.js**, **Express.js**, and **Knex.js**, with **MySQL** as the database.

## Features

1. **User Authentication**:

   - Sign up and log in functionality.
   - Secure password storage using bcrypt.
   - JSON Web Tokens (JWT) for session management.

2. **Bank Account Management**:

   - Unique bank account generation for each user. Bank accounts are generated automatically on signup.
   - Each bank account can accept deposits via bank transfer.

3. **Deposits Notification**:

   - Webhook-powered notifications for deposits.

4. **Money Transfers**:

   - Transfer money to other banks using the Raven Atlas API.

5. **Transaction History**:
   - Retrieve deposit, transfer, and overall transaction history.

## Tech Stack

- **Node.js**: Backend runtime environment.
- **Express.js**: Web application framework.
- **Knex.js**: SQL query builder for database operations.
- **MySQL**: Relational database for data storage.
- **Raven Atlas API**: API integration for banking operations.
- **JWT**: For secure authentication.

## Prerequisites

- **Node.js** (>=16.x)
- **MySQL** (>=8.x)
- **Knex CLI**

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd money-transfer-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
PORT=3000
DB_HOST=localhost
DB_USER=<your-db-user>
DB_PASSWORD=<your-db-password>
DB_NAME=money_transfer_app
JWT_SECRET=<your-jwt-secret>
RAVEN_API_KEY=<your-raven-api-key>
WEBHOOK_URL=<your-webhook-url>
WEBHOOK_SECRET=<your-webhook-SECRET>
```

### 4. Set Up Database

Run the following commands to create the database schema and seed data:

```bash
npx knex migrate:latest
npx knex seed:run
```

### 5. Start the Server

```bash
npm run dev
```

The server will run on `http://localhost:3000` by default.

## API Endpoints

### Authentication

1. **Sign Up**: `POST /auth/signup`
2. **Log In**: `POST /auth/login`

### Deposits

1. **Webhook for Deposit or transfer success Notification**: `POST /webhook`
2. **Retrieve Deposits**: `GET /transactions/deposits`

### Transfers

1. **Send Money to Other Banks**: `POST /transfers`

### Transactions

1. **Retrieve Transfer History**: `GET /transactions/transfers`
2. **Retrieve All Transactions**: `GET /transactions`

## Testing

### Unit Tests

Run tests using Mocha:

```bash
npm test
```

### API Documentation

All API endpoints are documented using Postman. View the published collection here: [https://www.postman.com/joint-operations-meteorologist-42885901/workspace/my-workspace/collection/27992012-d365fe2e-44bc-464f-98ca-b14d0166f6cc?action=share&creator=27992012](#).

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push the branch and create a pull request.

## License

This project is licensed under the MIT License.

## Acknowledgments

- [Raven Atlas API Documentation](https://raven-atlas.readme.io/reference)
- [Knex.js Documentation](https://knexjs.org)
