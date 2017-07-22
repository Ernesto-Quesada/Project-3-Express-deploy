const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const workerSchema = new Schema(
  // 1st arg -> fields of the documents of this collection
  {
    // All users
    name: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    //***  is better to use email as username 
    //***  than username + name + email , is too confusing  */
    email:    {type:String},
    phone:    {type:String},
    address:  {type:String},
    country:    {type:String},
    // role: { type: String,
    //         enum: [ 'guest', 'admin' ],
    //         default: 'guest'
    //         },
    workForAgency: { type: Schema.Types.ObjectId },

    // Traditional registration users
    username: { type: String },
    encryptedPassword: { type: String },

    // Login with Facebook users
    //facebookID: { type: String },

    // Login with Google users
   // googleID: { type: String }
  },

  // 2nd arg -> additional options
  {
    // Adds createdAt & updatedAt to documents
    timestamps: true
  }
);

const User = mongoose.model('User', workerSchema);


module.exports = User;