# Soccer Player Data Visualization System

This project combines backend and frontend technologies to deliver a comprehensive system for visualizing soccer player data. The backend is built using Flask to serve player information via REST API endpoints, while the frontend is developed in React.js, featuring dynamic tables and interactive visualizations.

## Project Structure

- `backend/`: Contains the Flask server (`backend.py`) and a JSON data file (`soccer_small.json`).
- `frontend/`: Contains a React application for rendering the player data.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Python 3.x
- Flask
- Node.js
- npm (Node Package Manager)

### Installing

#### Backend Setup

1. Navigate to the `backend` directory:
   ```
   cd backend
   ```
2. Install Flask and CORS if you haven't already:
   ```
   pip install Flask Flask-CORS
   ```
3. Start the Flask server:
   ```
   python backend.py
   ```
   The server will start on `http://localhost:5002/`.

#### Frontend Setup

1. Navigate to the `frontend` directory:
   ```
   cd frontend
   ```
2. Install the necessary Node modules:
   ```
   npm install
   ```
3. Start the React application:
   ```
   npm start
   ```
   The application will start and be available on `http://localhost:3000/`.

## Usage

- The Flask server provides REST API endpoints to retrieve soccer player data.
- The React application presents this data in a dynamic table with sorting capabilities and interactive visualizations.
- You can interact with the table and visualizations to explore player skills and attributes in detail.

## API Endpoints

- `GET /players`: Retrieves a list of all players and their attributes.
- `GET /players/<name>`: Retrieves details of a specific player.
- `GET /clubs`: Retrieves all clubs with their respective players.
- `GET /attributes`: Retrieves a list of all attribute names.