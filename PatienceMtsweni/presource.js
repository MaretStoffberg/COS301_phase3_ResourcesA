/**
 * Created by Patience Mtsweni on 4/15/2015.
 */

// REQUIRES:
var conn = require('database');
var mongoose = conn.mongoose;

var fs = require('fs');
var schemas = require('./schemas.js');

var constraints = {};

// defines and object resources
var resources = module.exports;


resources.uploadFile = function(file, callback){

    // write to database and remove file from temp
    for(var j = 0; j < file.length ; j++) {

        if (!checkMimeType(file[j].mimetype)){

            return callback(false);
        }
        else{

            for (var i = 0; i < constraints.length; i++) {
                if (constraints[i].mime_type === file[j].mimetype) {
                    if (file[j].size > constraints[i].size_limit) {
                        deleteTemp(file[j]);
                        return callback(false);
                    }
                }
            }
            var R = mongoose.model('Resources', schemas.resourceSchema);
            var r = new R;

            r.file_name = file[j].name;
            r.data = fs.readFileSync(file[j].path);
            r.hidden = false;
            r.save(function (err) {
                if (!err) {
                    deleteTemp(file[j]);
                    return callback(true);
                } else {
                    deleteTemp(file[j]);
                    return callback(false);
                }

            });


        resources.getConstraints(function(err, results){
            // gets the constraints allowed from the database and stores them in the 'constraints' variable
            // exploit callback paradigm
            if (!err){
                constraints = results;
            }
        });

            return callback(true);
        }

    }

};

/**
 * PRIVATE: This method is not exported.
 *
 * Removes the uploaded file from the temp folder
 *
 * @param file The file to be deleted.
 */
deleteTemp = function(file){

    fs.unlink(file.path);
};

/**
 * PRIVATE: This function is not exported.
 *
 * Validates the MIME type of the file and sets max file size for that MIME type.
 *
 * @param mimeType The MIME type to be validated.
 * @returns {boolean} True if MIME type is allowed, else false.
 */
checkMimeType = function(mimeType){

    for (var i = 0; i < constraints.length; i++){
        if (constraints[i].mime_type === mimeType){
            return true;
        }
    }

    return false;
};


/**
 * Locates and logically removes the indicated resource, if possible.
 *
 * @param resourceID The id of the resource to be removed.
 * @param callback The callback function receives a success value based on the success
 * of the addition.
 */
resources.removeFile = function(resourceID, callback){

    var R = mongoose.model('Resources', schemas.resourceSchema);

    R.findOneAndUpdate({'_id' : resourceID}, {'hidden' : true}, function(err){
        if (err){
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
resources.getConstraints = function(callback){

    var C = mongoose.model("Resource_Constraints", schemas.constraintSchema);

    C.find({}, function(err, results){
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
resources.addConstraint = function(mimeType, sizeLimit, callback){

    var C = mongoose.model('Resource_Constraints', schemas.constraintSchema);
    var c = new C;

    c.mime_type = mimeType;
    c.size_limit = sizeLimit;
    c.save(function(err){
        if (err){
            callback(false);
        } else {
            callback(true);
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
resources.removeConstraint = function(objectID, callback){

    var pattern = /[a-f0-9]{24}/;
    if (!pattern.test(objectID)){
        callback(false);
        return;
    }

    var C = mongoose.model('Resource_Constraints', schemas.constraintSchema);

    C.findOneAndRemove({'_id' : objectID}, function(err){
        if (err){
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
resources.updateConstraint = function(constraintID, sizeLimit, callback){

    var C = mongoose.model('Resource_Constraints', schemas.constraintSchema);

    C.findOneAndUpdate({'_id' : constraintID}, {'size_limit' : sizeLimit}, function(err){
        if (err){
            callback(false);
        } else {
            callback(true);
        }
    });
};
