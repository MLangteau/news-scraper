var path = require("path");
// Requiring our models
var Note = require("../models/note.js");
var Article = require("../models/article.js");

// These are the proper routes (html) that is presented to the user
module.exports = function(app) {

    // index route loads view.html
    app.get("/", function(req, res) {
            res.render("index");
    })

    // // index route loads view.html
  // app.get("/", function(req, res) {
  //     // retrieving all Articles from the database (data)
  //     Article.find({}).then(function(data) {
  //         var handlebrsObject = {
  //             articles: data      // articles is defined in the html
  //         };
  //         //  using the index.handlebars file for displaying the object
  //         res.render("index", handlebrsObject);
  //     });
  // });
  //
}; // end of module.exports