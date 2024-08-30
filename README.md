# Real-Time Location Tracker

This is a real-time location tracking application built with Node.js, Express, Socket.io, and Leaflet.js. The application allows users to share their live location, which can be viewed on an interactive map. It is useful for tracking devices or people in real-time.

## Features

- **Real-time Location Sharing:** Users can share their current location with others in real-time.
- **Interactive Map:** The application uses [Leaflet.js](https://leafletjs.com/) to display an interactive map where users can see the locations of all connected devices.
- **Device Information:** The application can display additional information about the device sharing its location.
- **User Connection Management:** Automatically detects when a user connects or disconnects.

## Technologies Used

- **Node.js & Express:** For server-side logic and handling HTTP requests.
- **Socket.io:** For real-time, bidirectional communication between clients and the server.
- **Leaflet.js:** To display and manage the interactive map.
- **EJS:** Template engine for rendering views.
- **dotenv:** For managing environment variables.

## Getting Started

### Prerequisites

- **Node.js**: Ensure you have Node.js installed on your system. You can download it from [here](https://nodejs.org/).
- **npm**: Node Package Manager is installed automatically with Node.js.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/vishalxtyagi/realtime-location-tracker.git
   cd realtime-location-tracker
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and define the following environment variables:

   ```plaintext
   PORT=3000
   ```

4. Start the server:

   ```bash
   npm start
   ```

   By default, the application will run on `http://localhost:3000`.

### Folder Structure

```plaintext
├── public
│   ├── css
│   ├── js
│   ├── views
│   │   └── index.ejs
├── .env
├── server.js
├── README.md
├── package.json
└── package-lock.json
```

### Usage

1. Open your browser and navigate to `http://localhost:3000`.
2. You should see a map rendered using Leaflet.js.
3. Share your location by allowing the browser to access your GPS/location.
4. The server will broadcast your location to all connected clients, and they will see your location on the map in real-time.
5. If you open multiple browser windows, you can simulate tracking multiple devices.

### Code Overview

- **server.js**: The main server file. It sets up the Express app, configures Socket.io for real-time communication, and renders the map view.
  
- **public/views/index.ejs**: The EJS template that renders the HTML and includes the map and client-side JavaScript for connecting to the Socket.io server.

- **public/js/**: This directory should contain the client-side JavaScript files for handling map rendering, location sharing, and receiving location updates.

- **public/css/**: This directory should contain any CSS files used to style the application.

### How It Works

- **Connection**: When a user connects, a socket is created for communication with the server.
- **Location Sharing**: The user shares their location, which is then broadcasted to all other connected clients.
- **Map Updates**: The map is updated in real-time with the locations of all connected users.
- **Disconnection**: When a user disconnects, the server notifies the remaining clients to remove the user from the map.

### Example Environment Setup

```plaintext
PORT=3000
```

## Dependencies

- [Express](https://expressjs.com/): Fast, unopinionated, minimalist web framework for Node.js.
- [Socket.io](https://socket.io/): Enables real-time, bidirectional and event-based communication.
- [Leaflet.js](https://leafletjs.com/): Open-source JavaScript library for mobile-friendly interactive maps.
- [dotenv](https://www.npmjs.com/package/dotenv): Loads environment variables from a `.env` file.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue to discuss improvements or bug fixes.

## Acknowledgments

- Special thanks to the developers of [Node.js](https://nodejs.org/), [Socket.io](https://socket.io/), and [Leaflet.js](https://leafletjs.com/) for their amazing tools that made this project possible.
