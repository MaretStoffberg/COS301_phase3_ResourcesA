/**
 * Created by Paul on 2015/03/23.
 */
var conn = require('database');
var mongoose = conn.mongoose;

var schemas = module.exports = {};

schemas.resourceSchema = mongoose.Schema({

    file_name : String,
    data : Buffer,
    size : Number,
    hidden : Boolean,
    post_id : Number
}, {collection: 'Resources'});

schemas.constraintSchema = mongoose.Schema({

    mime_type : String,
    size_limit : Number
}, {collection: 'Resource_Constraints'});