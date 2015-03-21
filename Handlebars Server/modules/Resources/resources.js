/*
 *  Created by Paul Engelke (u13093500)
 */

// REQUIRES:
var connection = require('../Database/connect.js'); // definitely
var multer = require('multer'); //probably
var app = require('../../app.js'); // maybe

// defines and object resources
var resources = new Object();

// might be needed for uploading before adding to database, useful where a upload my be interrupted.
// No corrupt data in database.
var tempDir = '../../temp';

/**
 * Handles the start of a file upload. Checks the mime type of the file before
 * uploading.
 * @param file The file to be uploaded.
 * @param request The request object.
 * @param response The response object.
 * @returns {boolean} True if upload my continue, else false.
 */
resources.prototype.uploadFileStart = function(file, request, response){

    if (resources.checkConstraints(file.mimetype, file.fileSize)){

        // continue
        return true;
    }

    // if constraints not met, return false.
    return false;
}

/**
 * Displays progress of upload. ----------------------  NICE TO HAVE, NOT NECESSARY NOW
 * @param file The file being uploaded.
 * @param request The request object.
 * @param response The response object.
 * @returns {boolean} True if upload my continue, else false.
 */
resources.prototype.uploadFileData = function(file, data, req, res){

    // progress output
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
resources.prototype.addConstraint = function(mimeType, sizeLimit){

    return false;
}

/**
 * Removes a constraint from the Resource_Constraints collection.
 * @param constraintID The ID of the constraint to be removed.
 * @returns {boolean} True if successfully removed, ele false.
 */
resources.prototype.removeResourceConstraint = function(constraintID){

    return false;
}

/**
 * Updates the specified constraint with a new size limit.
 * @param constraintID The ID of the constraint to be updated.
 * @param sizeLimit The new size limit of the constraint.
 * @return {boolean} True if successful, else false.
 */
resources.prototype.updateConstraint = function(constraintID, sizeLimit){

    //update to database

    return false;
}

module.exports = resources;