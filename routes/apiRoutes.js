// Require request and cheerio for scraping
var request = require('request');
var cheerio = require('cheerio');

// Require Mongoose ORM 
var mongoose = require('mongoose');

// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

var Note = require("../models/note.js");
var Article = require("../models/article.js"); 

//  API routes
module.exports = function(app) {

    app.get("/scrape", function(req, res) {
        console.log ("\n Grabbing every thread name and link from \n" + 
                    " from a website of my choice " + 
                    " ************ \n");
        //  Making a request call for OCPS' main website
        //  The callback's 3rd argument (body) is the website's HTML 
//request("http://www.espn.com/", function(error, response, html) {
    request("http://www.ufgator.com/", function(error, response, html) {
//        request("https://www.ocps.net", function (error, response, html) {
//request("https://www.washingtonpost.com", function (error, response, html) {
            //  save the html, loaded by cheerio, into $ variable
            //  like a DOM of the html
            var $ = cheerio.load(html);

            //  save the date scraped into this empty array
            var result = {};
            //console.log("mrl");

            //  with cheerio, find each p-tag with the title class
            //  (i is the index(iterator) and element is the current element)
              $(".widget li").each(function(i, element) {
                //  save the text of the current element (this) into the variable 
                result.title = $(this).children("a").text();
          //     console.log("result.title", result.title);

                //  look at the current element's child element (its a-tags), 
                //  then save the values for any href attributes 
                result.link = $(element).children("a").attr("href");
            //    console.log("result.link", result.link);

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

    // This will get the articles we scraped from the mongoDB
    app.get("/articles", function(req, res) {
      // Grab every doc in the Articles array
      Article.find({}, function(error, doc) {
        // Log any errors
        if (error) {
          console.log(error);
        }
        // Or send the doc to the browser as a json object
        else {
          res.json(doc);
        }
      });
    });

    // Grab an article by it's ObjectId
    app.get("/articles/:id", function(req, res) {
      // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
      Article.findOne({ "_id": req.params.id })
      // ..and populate all of the notes associated with it
      .populate("note")
      // now, execute our query
      .exec(function(error, doc) {
        // Log any errors
        if (error) {
          console.log(error);
        }
        // Otherwise, send the doc to the browser as a json object
        else {
          res.json(doc);
        }
      });
    });


    // Create a new note or replace an existing note
    app.post("/articles/:id", function(req, res) {
      // Create a new note and pass the req.body to the entry
      var newNote = new Note(req.body);

      // And save the new note the db
      newNote.save(function(error, doc) {
        // Log any errors
        if (error) {
          console.log(error);
        }
        // Otherwise
        else {
          // Use the article id to find and update it's note
          Article.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id })
          // Execute the above query
          .exec(function(err, doc) {
            // Log any errors
            if (err) {
              console.log(err);
            }
            else {
              // Or send the document to the browser
              res.send(doc);
            }
          });
        }
      });
    });

};  //  End of module.exports