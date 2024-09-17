// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');


const app = express();

// Point static path to dist
app.use(express.static(path.join(__dirname, '.next/server/app/')));

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '.next/server/app/index.html'));

});

/**
 * Get port from environment and store in Express.
 */
const port = '8042';
app.set('port', port);

/**git
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => // console.log(`API running on http://localhost:${port}`));
