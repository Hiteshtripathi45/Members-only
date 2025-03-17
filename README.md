# Members-Only Project

## Description
Members-Only is a web application where users can create an account and view messages. However, only authenticated members can post messages. Becoming a member requires entering a special password.

## joinpassword
qwerty@123

## SCREENSHOT
![App Screenshot](public/images/Screenshot%202025-03-18%20034913.png)

## Features
- User authentication (signup/login/logout)
- View messages without an account
- Create messages only if authenticated as a member
- Secure member access with a secret password

## Technologies Used
- Node.js
- Express.js
- postgres
- JWT for authentication
- EJS for templating

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/Hiteshtripathi45/Members-only
   cd Members-only
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```
     POSTGRES_URI=your_postgres_connection_string
     JWT_SECRET=your_secret_key
     DB_PASSFORJOIN=qwerty@123
     ```
4. Start the application:
   ```sh
   npm start
   ```
5. Open in your browser:
   ```
   http://localhost:3000
   ```

## Usage
1. Sign up for an account.
2. Log in to view and read messages.
3. Enter the special password to become a member and start posting messages.

## License
This project is licensed under the MIT License.

