// Import express
let express = require('express');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let config = require('config');

//retrieve config vars
const uri = config.get('app.mongoose.uri');

// Initialize the app
let app = express();


// Configure bodyparser to handle post requests
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


// Import routes
let apiRoutes = require("./api/routes");


// Connect to Mongoose and set connection variable
mongoose.connect(uri, { useNewUrlParser: true });

let db = mongoose.connection;
// Setup server port
let port = process.env.PORT || 8080;

// Use Api routes in the App
app.use('/', apiRoutes);

// Launch app to listen to specified port
app.listen(port, function () {
    console.log("Running app on port " + port);
});

module.exports = app;
