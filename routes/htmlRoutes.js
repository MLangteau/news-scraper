// Requiring our models
var Note = require("../models/Note");  // .js is optional for both
var Article = require("../models/Article");

// These are the proper routes (html) that is presented to the user
module.exports = function(app) {

  // index route loads view.html
  app.get("/", function(req, res) {
      // retrieving all Articles from the database (data)
      Article.find({}).then(function(data) {
          var handlebrsObject = {
              articles: data      // articles is where the articles are in the html 
          };
          //  using the index.handlebars file for displaying the object
          res.render("index", handlebrsObject);
      });
  });

}; // end of module.exports