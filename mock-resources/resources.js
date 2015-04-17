/**
 *  Created by Paul Engelke (u13093500)
 *
 *  NOTE: This module, in it's current state is a dummy module. While some of the functionality
 *  works, a lot of it still needs to be implemented. Those that have yet to be implemented are
 *  indicated as such and return mock information.
 */

exports = module.exports = function(database) {

    var mongoose = database.mongoose;
    var fs = require('fs');
    var schemas = require('./schemas.js')(mongoose);

    var tempDir = './temp';
    var maxSize = 16 * 1024 * 1024; //allowed by database

    var resources = {};

    /**
     * PRIVATE
     *
     * Checks whether or not the MIME type exists in the database.
     * @param mimeType The MIME Type to be checked.
     * @param callback The function to which a truth value is returned. False if the MIME type EXISTS, else true.
     */
    var checkConstraint = function(mimeType, callback){

        var C = mongoose.model("Resource_Constraints");
        C.find({'mime_type' : mimeType}, function(err, results){
            if (err){
                callback(false);
            } else {
                callback(results.length == 0);
            }
        });
    };

    /**
     * TODO: This function is a mock function and returns a mock value. Needs specified implementation.
     *
     * PRIVATE
     *
     * Determines whether or not a file may be uploaded.
     * @param mimeType The mime type of the file.
     * @param fileSize The files size.
     * @param callback Receives a truth value determined by the file's validity.
     */
    var validateFile = function(mimeType, fileSize, callback){

        callback(true);
    };

    /**
     * TODO: This function is a mock function and returns a mock value. Needs specified implementation.
     *
     * This function takes one or more files as input and attempts to upload them to the server.
     * {Pre-conditions} All files must be legal in terms of the the allowed file types and
     * size limitations described by the system.
     * @param files The files to be uploaded.
     * @param relatedID An object ID that references the item to which this resource belongs.
     * @param callback A function that receives a truth value dependent on the success of the call.
     */
    resources.uploadResources = function(files, relatedID, callback){

        var R = mongoose.model("Resources", schemas.resourceSchema);

        var r = new R;
        r.file_name = "MOCK_RESOURCE_"+Date.now()+".jpg";
        r.data = null;
        r.size = 0;
        r.hidden = false;
        r.related_id = relatedID;
        r.save(function(err){
            if (err){
                callback(false);
            } else {
                callback(true);
            }
        });
    };

    /**
     * TODO: This function is a mock function and returns all resources. Needs specified implementation.
     *
     * Retrieves resources specified by an array of resource IDs.
     * @param resIDs The array of resource IDs.
     * @param callback Receives the requested resources and an error object.
     */
    resources.getResourcesById = function(resIDs, callback){

        var R = mongoose.model("Resources", schemas.resourceSchema);

        R.find({'hidden' : false})
            .populate('_id', 'file_name')
            .exec(function(err, results){
                callback(err, results);
            });
    };

    /**
     * TODO: This function is a mock function and returns all resources. Needs specified implementation.
     *
     * Retrieves all resources for the specified buzz space.
     * @param spaceID The buzz space ID.
     * @param callback Receives the requested resources and an error object.
     */
    resources.getResourcesBySpaceId = function(spaceID, callback){

        var R = mongoose.model("Resources", schemas.resourceSchema);

        R.find({'hidden' : false})
            .populate('_id', 'file_name')
            .exec(function(err, results){
                callback(err, results);
            });
    };

    /**
     * TODO: This function is a mock function and returns all resources. Needs specified implementation.
     *
     * Retrieves all resources related to a thread or appraisal type.
     * @param relatedID The ID of the thread or appraisal type.
     * @param callback Receives the requested resources and an error object.
     */
    resources.getResourcesRelated = function(relatedID, callback){

        var R = mongoose.model("Resources", schemas.resourceSchema);

        R.find({'hidden' : false})
            .populate('_id', 'file_name')
            .exec(function(err, results){
                callback(err, results);
            });
    };


    /**
     * Returns all the resources in the database.
     * @param callback Receives the requested resources and an error object.
     */
    resources.getResourcesAll = function(callback){

        var R = mongoose.model("Resources", schemas.resourceSchema);

        R.find({'hidden' : false})
            .populate('_id', 'file_name')
            .exec(function(err, results){
                callback(err, results);
            });
    };

    /**
     * Locates and logically removes the indicated resource, if possible.
     *
     * @param resourceID The id of the resource to be removed.
     * @param callback The callback function receives a success value based on the success
     * of the addition.
     */
    resources.removeResource = function (resourceID, callback) {

        var R = mongoose.model('Resources', schemas.resourceSchema);

        R.findOneAndUpdate({'_id': resourceID}, {'hidden': true}, function (err) {
            if (err) {
                callback(false);
            } else {
                callback(true);
            }
        });
    };

    /**
     * This function gets all the resource constraints from the database.
     *
     * @param callback The callback function receives a err object and a
     * query object containing the results from the Resource_Constraints collection.
     */
    resources.getConstraints = function (callback) {

        var C = mongoose.model("Resource_Constraints", schemas.constraintSchema);

        C.find({}, function (err, results) {
            callback(err, results);
        });
    };

    /**
     * Adds a new constraint to the Resource_Constraints collection in the database.
     *
     * @param mimeType The new MIME type.
     * @param sizeLimit The size limit for the MIME type.
     * @param callback The callback function receives a success value based on the success
     * of the addition.
     */
    resources.addConstraint = function (mimeType, sizeLimit, callback) {

        checkConstraint(mimeType, function(success){

            if (!success){
                callback(false);
            } else {
                var C = mongoose.model('Resource_Constraints', schemas.constraintSchema);
                var c = new C;

                c.mime_type = mimeType;
                c.size_limit = sizeLimit;
                c.save(function (err) {
                    if (err) {
                        callback(false);
                    } else {
                        callback(true);
                    }
                });
            }
        });
    };

    /**
     * Removes a constraint from the Resource_Constraints collection.
     *
     * PRE-CONDITION: The objectID must conform to a hexadecimal sequence. If the objectID
     * specified is not hexadecimal, the function returns false.
     *
     * @param objectID The ID of the constraint to be removed.
     * @param callback The callback function receives a success value based on the success
     * of the remove query.
     */
    resources.removeConstraint = function (objectID, callback) {

        var pattern = /[a-f0-9]{24}/;
        if (!pattern.test(objectID)) {
            callback(false);
            return;
        }

        var C = mongoose.model('Resource_Constraints', schemas.constraintSchema);

        C.findOneAndRemove({'_id': objectID}, function (err) {
            if (err) {
                callback(false);
            } else {
                callback(true);
            }
        });
    };

    /**
     * Updates the specified constraint with a new size limit.
     *
     * @param constraintID The ID of the constraint to be updated.
     * @param sizeLimit The new size limit of the constraint.
     * @param callback The callback function receives a success value based on the success
     * of the update query.
     */
    resources.updateConstraint = function (constraintID, sizeLimit, callback) {

        var C = mongoose.model('Resource_Constraints', schemas.constraintSchema);

        C.findOneAndUpdate({'_id': constraintID}, {'size_limit': sizeLimit}, function (err) {
            if (err) {
                callback(false);
            } else {
                callback(true);
            }
        });
    };

    return resources;
};

exports['@singleton'] = true;
exports['@require'] = ['buzz-database'];