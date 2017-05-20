'use strict';

// Require mongoose
var mongoose = require("mongoose");
// Create a schema class
var Schema = mongoose.Schema;

mongoose.models = {};
mongoose.modelSchema = {};

// Create the Note schema
var NoteSchema = new Schema({
  // Just a string
  title: {
    type: String
  },
  // Just a string
  body: {
    type: String
  }
});

// Mongoose automatically saves the Object Ids of the notes
// These Ids are referred to in the Article model

// Create the Note model with the NoteSchema
var Note = mongoose.model("Note", NoteSchema);

// Export the Note model
module.exports = Note;
