// Scraping News Articles

// Dependencies
var express = require('express');

// Require body-parser
var bodyParser = require('body-parser');

// Require Mongoose ORM 
var mongoose = require('mongoose');

// Requiring our models
var Note = require("./models/note.js"); 
var Article = require("./models/article.js");

// Require request and cheerio for scraping
var request = require('request');
var cheerio = require('cheerio');

// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

// Initialize Express
var app = express();

//  const PORT is necessary for Heroku deployment
const PORT = process.env.PORT || 3000;

// Set up for the Express app to handle data parsing
// Parses the text as JSON and exposes the resulting object on req.body.
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

//  bodyParser.text() reads the buffer as plain text and exposes the resulting string on req.body.
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Serve static content for the app from the "public" directory in the application directory.
 
//need to change from process.cwd() to  __dirname since not using sequelize (process.cwd() + 
// app.use(express.static('public'));
app.use(express.static(__dirname + '/public'));

//  Set up API routes to make programs in the future easier
require("./routes/apiRoutes.js")(app);
//  Set up HTML routes to make programs in the future easier
require("./routes/htmlRoutes.js")(app);

// required for connection (both connect and creation connection take a mongodb://URL or 
//    host, etc. options)

//  var conn = mongoose.createConnection('mongodb://[username:password@]host1[:port1][,host2[:port2],...
//          [,hostN[:portN]]][/[database][?options]]', options);
  // or createConnection if more than one conn.

if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI);
}
else {
    mongoose.connect('mongodb://localhost/newsScraper');
};

// store mongoose connection to the db variable
var db = mongoose.connection;

//  if error in connection, show error
db.on("error", function(error) {
    console.log("Mongoose Error:", error);
});

//  successful log in to the database through mongoose
db.once("open", function(error) {
    console.log("Mongoose connection successful");
});

// store express-handlebars to the exphbs variable
var exphbs = require('express-handlebars');
var Handlebars = require('handlebars');

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Listener
app.listen(PORT, function() {
    console.log("App listening on PORT: " + PORT);
})

