# Secret Message Encryption and Decryption

## Overview

This application allows users to encrypt messages with an optional password, generate a shareable URL, and decrypt messages by visiting the URL. The application is built using Node.js, Express, and JavaScript, with testing coverage provided by Jest and Supertest.

## Features

- **Message Encryption**: Encrypts a secret message with or without a password.
- **URL Generation**: Generates a unique URL that contains the encrypted message.
- **Password Protection**: Optional password protection for messages.
- **Decryption**: Decrypts the message when the URL is visited, requiring a password if one was set.
- **Security**: Uses AES-256 encryption and includes security features like Helmet and rate limiting.
- **Testing**: 100% test coverage using Jest and Supertest.

## Project Structure

```
project-root/
│
├── public/
│   ├── index.html  # Frontend HTML file
│   └── style.css   # Frontend CSS file
│
├── tests/
│   └── app.test.js # Test cases for the application
│
├── .env            # Environment variables
├── .gitignore      # Files to ignore in git
├── server.js       # Main server application
├── package.json    # NPM package configuration
└── package-lock.json # NPM package lock file
```

## Prerequisites

- **Node.js**: Ensure you have Node.js installed (v14.x or higher recommended).
- **Git**: Version control using Git.
- **Heroku CLI**: For deployment to Heroku (optional).

## Environment Setup

Create a `.env` file in the project root with the following variables:

```
PORT=3000
ENCRYPTION_KEY=your-256-bit-encryption-key-in-hex
```

## Note on Encryption Key

**Important:** The encryption key included in this repository is for **testing and development purposes only**. This key is defined in the `.env` file as `ENCRYPTION_KEY` to simplify setup for contributors and testers.

### Security Reminder:
- **Do not use this key in production**: Generate a new, secure 256-bit key for any production deployment.
- **Replace the Key**: Before deploying, replace the key in the `.env` file with a secure one:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Prakh2909/secret-sharing-app.git
cd secret-sharing-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Application Locally

```bash
node server.js
```

Open your browser and go to `http://localhost:3000` to access the application.

## Running Tests

### 1. Run All Tests

```bash
npm test
```

### 2. View Test Coverage

Jest will generate a coverage report in the `coverage` directory. To view the coverage report:

```bash
npx jest --coverage
```

Open `coverage/lcov-report/index.html` in your browser to see detailed test coverage.

## Deployment

### Deploying to Heroku

1. **Login to Heroku**

```bash
heroku login
```

2. **Create a New Heroku App**

```bash
heroku create your-app-name
```

3. **Set Environment Variables on Heroku**

```bash
heroku config:set ENCRYPTION_KEY=your-256-bit-encryption-key-in-hex
```

4. **Push to Heroku**

```bash
git push heroku master
```

5. **Open the Deployed Application**

```bash
heroku open
```

## Security Best Practices

- **Helmet**: Used to secure the app by setting various HTTP headers.
- **Rate Limiting**: Limits the number of requests per IP to prevent brute-force attacks.
- **Environment Variables**: Sensitive data such as the encryption key and port number are stored in environment variables.
