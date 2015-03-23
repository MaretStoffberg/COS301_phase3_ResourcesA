/**
 * Created by Hlavutelo (u12318109) on 2015-03-20.
 */

// REQUIRES:

console.log("Entering resources.js");



var connection = require('../Database/connect.js'); // definitely
var multer = require('multer'); //probably


// need to connect to the server

var app = require('../../app.js');



// defines and object resources
var resources = new Object();

// might be needed for uploading before adding to database, useful where a upload my be interrupted.
// No corrupt data in database.
var tempDir = '../../temp';

/**
 * This function is called by the upload handler in the server.
 * @param req The request object.
 * @param res The result object.
 * @param next The next server function call in the Daisy Chain.
 * @param userID The user uploading an image.
 */

var express = require("express");
var app = express();

app.use(multer({dest: tempDir,
    rename: function(fieldname, filename){
        return filename+Date.now();
    },
    onFileUploadComplete:function(file){
        mimeType = file.mimetype;
        path = file.path;
        size = file.size;
        done = true;
    }
}));


resources.uploadFile = function(req, res, next, userID){

    /** Configure the multer. */
    var handler = multer({

        dest: tempDir,
        rename:function (fieldname, filename){
                return filename.replace(/\W+/g, '-').toLowerCase()+Date.now();
            },
        onFileUploadStart:function(file, req, res){
                uploadFileStart(file, req, res);
            },
        onFileUploadData:function(file, data, req, res){
                uploadFileData(file, data, req, res);
            },
        onFileUploadComplete:function(file, req, res){
                uploadFileComplete(file, req, res, userID);
            }
    });

    handler(req, res, next); // calls the handler.
}

/**
 * PRIVATE: This method is not exported.
 *
 * Handles the start of a file upload. Checks the mime type of the file before
 * uploading.
 * @param file The file to be uploaded.
 * @param req The request object.
 * @param res The response object.
 * @returns {boolean} True if upload my continue, else false.
 */
uploadFileStart = function(file, req, res){

    if (!resources.checkConstraints(file.mimetype, file.fileSize)){

        // display error

        return false;
    }

    // else continue with upload

    return true;
}

/**
 * PRIVATE: This method is not exported.
 *
 * NICE TO HAVE, NOT NECESSARY NOW
 *
 * Displays progress of upload.
 * @param file The file being uploaded.
 * @param request The request object.
 * @param response The response object.
 * @returns {boolean} True if upload my continue, else false.
 */
uploadFileData = function(file, data, req, res){

    // progress output
}

/**
 * PRIVATE: This method is not exported.
 *
 * Handles the event for when a file upload is complete.
 * @param file The file that was uploaded.
 * @param req The request object.
 * @param res The response object.
 * @param userID The user who uploaded the file.
 */
uploadFileComplete = function(file, req, res, userID){

    // write to database and remove file from temp
    var mimeType = file.mimetype;
    var path = file.path;
    var size = file.size;
    var done = true;

    /*

        gridfs-stream: to stream files to and from database.

        store file directly to db rather than file system

    */
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    mongoose.connect('mongodb://45.55.154.156:27017/Buzz');

    var conn =  mongoose.connection;

    var fs = require('fs');
    var Grid = require('gridfs-stream');
    Grid.mongo = mongoose.mongo;

    conn.once('open', function()
    {
        console.log('open');
        var gfs = Grid(conn.db);

        // streaming to gridfs
        // file to store into mongodb

        var writestream = gfs.createWriteStream({
            filename: file.name;
        });
        fs.creatReadStream('../../temp/sourcefile.txt').pipe(writestream);
        writestream,on('close', function(file)
        {
            // do something with file
            console.log(file.filename + 'Written to DB');
        });
    });

    // after this is done, you will see two collections added to the database 'fs.chunks' and 'fs.files'

}

/**
 * Locates and removes the indicated resource, if possible.
 * @param resourceID The id of the resource to be removed.
 * @returns {boolean} True if successful, else false.
 */
resources.removeResource = function(resourceID){

    // search database for resource and remove it logically.
    // if successful, return true

    return false;
}

/**
 * Validates the MIME type and size allowed for the specified MIME type.
 * @param mimeType The MIME type to be validated.
 * @param fileSize The file size to be tested.
 * @returns {boolean} True if successful in both case, else false.
 */
resources.checkConstraints = function(mimeType, fileSize){

    var mime_success = false,
        size_success = false;

    // retrieve constraints from database
    // check for mime type,
    // if mime type found, check size against size_limit of matching mime_type

    return mime_success && size_success;
}

/**
 * Adds a new constraint to the Resource_Constraints collection in the database.
 * @param mimeType The new MIME type
 * @param sizeLimit The size limit for the MIME type.
 * @returns {boolean} True if successfully added, else false.
 */
resources.addConstraint = function(mimeType, sizeLimit){

    return false;
}

/**
 * Removes a constraint from the Resource_Constraints collection.
 * @param constraintID The ID of the constraint to be removed.
 * @returns {boolean} True if successfully removed, ele false.
 */
resources.removeResourceConstraint = function(constraintID){

    return false;
}

/**
 * Updates the specified constraint with a new size limit.
 * @param constraintID The ID of the constraint to be updated.
 * @param sizeLimit The new size limit of the constraint.
 * @return {boolean} True if successful, else false.
 */
resources.updateConstraint = function(constraintID, sizeLimit){

    //update to database

    return false;
}

console.log("Exiting resources.js");

module.exports = resources;