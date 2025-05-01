# Aezline Website with Backend

This project includes a Node.js backend that serves the Aezline website and provides API endpoints for managing the Website Development Process section.

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Open a terminal/command prompt
2. Navigate to the project directory:
   ```
   cd "New Aezline Website"
   ```
3. Install dependencies:
   ```
   npm install
   ```

### Running the Server

1. Start the server:
   ```
   npm start
   ```
2. The website will be available at:
   ```
   http://localhost:3000
   ```

### Development Mode

To run the server in development mode with automatic restart on file changes:
```
npm run dev
```

## Backend Features

### API Endpoints

- **GET /api/process-steps** - Get all process steps
- **GET /api/process-steps/:id** - Get a specific process step by ID
- **PUT /api/process-steps/:id** - Update a specific process step (admin only)

### Admin Interface

A complete admin interface is available to manage your website:

1. **Login Page**:
   ```
   http://localhost:3000/admin/login.html
   ```
   Default credentials:
   - Username: admin
   - Password: admin123

2. **Admin Dashboard**:
   ```
   http://localhost:3000/admin/dashboard.html
   ```

3. **Process Steps Editor**:
   ```
   http://localhost:3000/admin/process-editor.html
   ```

4. **Settings Page**:
   ```
   http://localhost:3000/admin/settings.html
   ```

### Data Storage

Process steps data is stored in a JSON file at:
```
/data/process-steps.json
```

## Project Structure

- **/css/** - Stylesheet files
- **/js/** - JavaScript files
- **/images/** - Image assets
- **/data/** - Data storage
- **/admin/** - Admin interface
- **server.js** - Main server file
- **package.json** - Project configuration

## Notes

- In a production environment, you would want to add authentication to the admin interface and API endpoints
- For a real production deployment, consider using a database instead of JSON files for data storage
- The server is configured to run on port 3000 by default, but you can change this by setting the PORT environment variable
