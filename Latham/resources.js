/*
 *  Created by Paul Engelke (u13093500)
 *  some functions implemented by Latham
 */

// REQUIRES:
var connection = require('../Database/connect.js'); // definitely
var multer = require('multer'); //probably

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
resources.prototype.uploadFile = function(req, res, next, userID){

    var handler = multer({

        dest:
            tempDir,
        rename:
            function (fieldname, filename){
                return filename.replace(/\W+/g, '-').toLowerCase()+Date.now();
            },
        onFileUploadStart:
            function(file, req, res){
                uploadFileStart(file, req, res);
            },
        onFileUploadData:
            function(file, data, req, res){
                uploadFileData(file, data, req, res);
            },
        onFileUploadComplete:
            function(file, req, res){
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
}

/**
 * Locates and removes the indicated resource, if possible.
 * @param resourceID The id of the resource to be removed.
 * @returns {boolean} True if successful, else false.
 */
resources.prototype.removeResource = function(resourceID){

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
resources.prototype.checkConstraints = function(mimeType, fileSize){

    var mime_success = false; 
        //size_success = false; 

//alternative db.getCollection('Resource_Constraints').find({})
	mime_success = db.Resource_Constraints.find( { mime_type: mimeType, size_limit:{$lt:fileSize}  } ) 
	// if it finds the same mime type and its size_limit is less than file size it
	//makes mime_success true, else false --well this is the goal, not sure how it works


    // retrieve constraints from database
    // check for mime type,
    // if mime type found, check size against size_limit of matching mime_type

    return mime_success ;//&& size_success;
}

/**
 * Adds a new constraint to the Resource_Constraints collection in the database.
 * @param mimeType The new MIME type
 * @param sizeLimit The size limit for the MIME type.
 * @returns {boolean} True if successfully added, else false.
 */
resources.prototype.addConstraint = function(mimeType, sizeLimit){

	// this supposed to append to the mongodb and add to the resource_constraints db. 
	// it assigns automatically an _id and inserts the mimeType field and the sizeLimit field
	//alt db.getCollection('Resource_Constraints').insert({})
	return db.Resource_Constraints.insert( { mime_type: mimeType, size_limit: sizeLimit } );


	//return below can be taken out because above returns a true if it appended/added or a false if it failed.
    //return false;
}

/**
 * Removes a constraint from the Resource_Constraints collection.
 * @param constraintID The ID of the constraint to be removed.
 * @returns {boolean} True if successfully removed, else false.
 */
resources.prototype.removeResourceConstraint = function(constraintID)
{
	//returns true if item is removed, otherwise false if not. deletes only one item
	//alt db.getCollection('Resource_Constraints').remove({})
	 return db.Resource_Constraints.remove( 
	 	{ _id: constraintID },
	 	1
	  )
   // return false;
}

/**
 * Updates the specified constraint with a new size limit.
 * @param constraintID The ID of the constraint to be updated.
 * @param sizeLimit The new size limit of the constraint.
 * @return {boolean} True if successful, else false.
 */
resources.prototype.updateConstraint = function(constraintID, sizeLimit){

    //update to database

//as i looked at the mongo documents information, the functions return true if changes where made, otherwise false;
//alt db.getCollection('Resource_Constraints').update({})
   return db.Resource_Constraints.update(
   { _id: constraintID }, //going to update where the id matches
   { $set:
      {
        size_limit: sizeLimit //sets a new size_limit size
      }
   }
)

    //return false;
}

module.exports = resources;