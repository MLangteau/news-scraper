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
app.use(express.static("/public"));
//  OR app.use(express.static(__dirname + "/public"));

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

// Import routes and give the server access to them.
//require("./controllers/_controller")(app);

// Main route (simple Message)
/*app.get("/", function(req, res) {
    res.send("App is running");
//    res.render('index', {atc:articles});
//    res.send(index.html);
});
*/

/*  dupl in apiRoutes
    app.get("/scrape", function(req, res) {
        console.log ("\n Grabbing every thread name and link from \n" + 
                    " from a website of my choice " + 
                    " ************ \n");
        //  Making a request call for OCPS' main website
        //  The callback's 3rd argument (body) is the website's HTML 
        request("https://www.washingtonpost.com", function (error, response, html) {
            //  save the html, loaded by cheerio, into $ variable
            //  like a DOM of the html
            var $ = cheerio.load(html);

            //  save the date scraped into this empty array
            var result = {};
            console.log("mrl");

            //  with cheerio, find each p-tag with the title class
            //  (i is the index(iterator) and element is the current element)
            $(".skin-card li").each(function(i, element) {
                //  save the text of the current element (this) into the variable 
                result.title = $(this).children("a").text();

                //  look at the current element's child element (its a-tags), 
                //  then save the values for any href attributes 
                result.link = $(element).children("a").attr("href");

                //  This passes the result object defined above and uses the Article model to 
                //  add/create a new entry
                var entry = new Article(result);
            
                //  save these results in an object that we'll push into the results array
                entry.save(function (error, doc) {
                  if (error) {
                      console.log(error);
                  }
                  else {
                      console.log(doc);
                  }
                });
            });
            res.redirect("/");  // Important to send this or else!
        });
        res.send("Scrape Complete");
    });
*/

/*
// Retrieve data from the db
app.get("/all", function(req, res) {
  // Find all results from the scrapedData collection in the db
  db.scrapedData.find({}, function(error, found) {
    // Throw any errors to the console
    if (error) {
      console.log(error);
    }
    // If there are no errors, send the data to the browser as a json
    else {
      res.json(found);
    }
  });
});

// Scrape data from one site and place it into the mongodb db
app.get("/scrape", function(req, res) {
  // Make a request for the news section of ycombinator
  request("https://news.ycombinator.com/", function(error, response, html) {
    // Load the html body from request into cheerio
    var $ = cheerio.load(html);
    // For each element with a "title" class
    $(".title").each(function(i, element) {
      // Save the text of each link enclosed in the current element
      var title = $(this).children("a").text();
      // Save the href value of each link enclosed in the current element
      var link = $(this).children("a").attr("href");

      // If this title element had both a title and a link
      if (title && link) {
        // Save the data in the scrapedData db
        db.scrapedData.save({
          title: title,
          link: link
        },
        function(error, saved) {
          // If there's an error during this query
          if (error) {
            // Log the error
            console.log(error);
          }
          // Otherwise,
          else {
            // Log the saved data
            console.log(saved);
          }
        });
      }
    });
  });

  // This will send a "Scrape Complete" message to the browser
  res.send("Scrape Complete");
});

*/
// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});

