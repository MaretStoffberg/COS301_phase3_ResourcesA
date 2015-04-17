//var schemas = require('./schemas.js');
var mongoose = require('mongoose');
//var mongoose = conn.mongoose;

var schemas = {};

schemas.constraintSchema = mongoose.Schema({

        mime_type: String,
        size_limit: Number
    }, {collection: 'Resource_Constraints'});

var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
	  // yay!
	});

var multer = require('multer');
var fs = require('fs');

var tempDir = './temp';
var maxSize = 16*1024*1024; //allowed by database
var constraints = {};

// defines and object resources
var resources = module.exports;

/**
 * PRIVATE: This method is not exported.
 *
 * Handles the start of a file upload. Checks the mime type of the file before
 * uploading.
 *
 * @param file The file to be uploaded.
 * @param req The request object.
 * @param res The response object.
 * @returns {boolean} True if upload my continue, else false.
 */
uploadFileStart = function(file, req, res){

    if (!checkMimeType(file.mimetype)){

        res.fileState = "File could not be uploaded. MIME type '"+file.mimetype+"' is not supported.";
        return false;
    }
    console.log("Starting upload of file "+file.name+"...");
    return true;
};

/**
 * PRIVATE: This method is not exported.
 *
 * NICE TO HAVE, NOT NECESSARY NOW
 *
 * STUB
 *
 * Displays progress of upload.
 *
 * @param file The file being uploaded.
 * @param data
 * @param req The request object.
 * @param res The response object.
 * @returns {boolean} True if upload my continue, else false.
 */
uploadFileData = function(file, data, req, res){

    //return true;
};

/**
 * PRIVATE: This method is not exported.
 *
 * Handles the event for when a file upload is complete.
 *
 * @param file The file that was uploaded.
 * @param req The request object.
 * @param res The response object.
 * @param postID The post which references the file.
 */
uploadFileComplete = function(file, req, res, postID){

    // write to database and remove file from temp
    console.log("Upload complete.");

    for (var i = 0; i < constraints.length; i++){
        if (constraints[i].mime_type === file.mimetype){
            if (file.size > constraints[i].size_limit){
                res.fileState = "File size is too large! Aborted.";
                deleteTemp(file);
                return;
            }
        }
    }

    var R = mongoose.model('Resources', schemas.resourceSchema);
    var r = new R;

    r.file_name = file.name;
    r.data = fs.readFileSync(file.path);
    r.hidden = false;
    r.post_id = postID;
    r.save(function(err){
        if (!err){
            console.log("File successfully saved.");
        } else {
            console.log(err);
        }
        deleteTemp(file);
    });

    res.fileState = "File successfully uploaded.";
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
 * This function is called by the upload handler in the server.
 *
 * @param req The request object.
 * @param res The result object.
 * @param next The next server function call in the Daisy Chain.
 * @param postID The post that references the file.
 */
resources.uploadFile = function(req, res, next, postID){

    var handler = multer({

        dest:
            tempDir,
        limits: {
            fileSize: maxSize
        },

        rename: function (fieldname, filename){
            return filename.replace(/\W+/g, '-').toLowerCase()+Date.now();
        },
        onFileUploadStart: function(file, req, res){
            return uploadFileStart(file, req, res);
        },
        onFileUploadData: function(file, data, req, res){
            uploadFileData(file, data, req, res);
        },
        onFileSizeLimit: function(file){
            deleteTemp(file);
        },
        onFileUploadComplete: function(file, req, res){
            uploadFileComplete(file, req, res, postID);
        }
    });

    resources.getConstraints(function(err, results){
        // gets the constraints allowed from the database and stores them in the 'constraints' variable
        // exploit callback paradigm
        if (!err){
            constraints = results;
            handler(req, res, next);
        }
    });
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
