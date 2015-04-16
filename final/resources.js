// REQUIRES:
var conn = require('database');
var mongoose = conn.mongoose;
var multer = require('multer');
var fs = require('fs');
var schemas = require('./schemas.js');
var tempDir = './temp';
var maxSize = 16*1024*1024; //allowed by database
var constraints = {};

// defines and object resources
var resources = module.exports;


resources.getResourceById = function(resIds, callback) {
    /**
     * Takes a list of resource ids/urls(if possible, preferably as stated in the spec)
     * and returns a list of those resources to the callback function
     * @param resIds : array of query Resource IDs
     * */
    var R = mongoose.model('Resources', schemas.resourceSchema);
    callback(R.find({'_id': {$in: resIds}}));
};

resources.getResourceBySpaceId = function(spaceID, callback){
    //not ready
    /*Takes a spaceID and retrieves the resources pertaining to that space.*/
    callback(false);
};

resources.getConstraints = function(callback){

    var C = mongoose.model("Resource_Constraints", schemas.constraintSchema);

    C.find({}, function(err, results){
        callback(err, results);
    });
};

resources.getResourceByPostId = function(postID, callback){
    /*Takes a PostID and retrieves the resources pertaining to that space. */
    var R = mongoose.model('Resources', schemas.resourceSchema);
    callback(R.find({'post_id' : postID}));
};

resources.getResourcesRelated= function(relatedID, callback){
    /**Takes a threadID or an appraisalTypeID and returns all related resources.*/
    //not ready
    callback(false);
};

resources.getResourcesAll= function(callback){
    /*Returns all resources to the callback function.*/
    var R = mongoose.model('Resources', schemas.resourceSchema);
    callback(R.find());
};

resources.uploadResources= function(files,callback){
    /*Upload resources in files selected.*/
    // write to database and remove file from temp
    for(var j = 0; j < file.length ; j++)
    {
        if (!checkMimeType(file[j].mimetype))
        {
            return callback(false);
        }
        else
        {
            for (var i = 0; i < constraints.length; i++)
            {
                if (constraints[i].mime_type === file[j].mimetype)
                {
                    if (file[j].size > constraints[i].size_limit)
                    {
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
        }
/*        resources.getConstraints(function(err, results){
            // gets the constraints allowed from the database and stores them in the 'constraints' variable
            // exploit callback paradigm
            if (!err){
                constraints = results;
            }
        });*/

    }


    return callback(true);
};

resources.checkMimeType= function(mimeType, callback){
    //check mimetype with database query
    //callback(true/false) depending on whether the mimeType is in the database
   var constraints = mongoose.model('Resource_Constraints', schemas.constraintSchema);
    var k = constraints.find({'mime_type': mimeType});
   if(k.count()>0)
      callback(true);
    else
      callback(false);


};

resources.removeFile = function(resourceID, callback){

    /**
     * Locates and logically removes the indicated resource, if possible.
     *
     * @param resourceID The id of the resource to be removed.
     * @param callback The callback function receives a success value based on the success
     * of the addition.
     */
    var R = mongoose.model('Resources', schemas.resourceSchema);

    R.findOneAndUpdate({'_id' : resourceID}, {'hidden' : true}, function(err){
        if (err){
            callback(false);
        } else {
            callback(true);
        }
    });
};


resources.prototype.checkConstraints = function(mimeType, fileSize){
    /* check if file constrains are valid
    * @parem mimeType: the mime type of the file
    * @parem fileSize: the size of the file*/
    var c = mongoose.model('Resource_Constraints', schemas.constraintSchema);
     var res = c.findfind({"mime_type" : _mimeType, "size_limit" : {$lte : _fileSize}});
    if(res.count()>0)
    callback(true);
    else callback(false);
};

resources.updateConstraint = function(mimetype, sizeLimit, callback){

    var C = mongoose.model('Resource_Constraints', schemas.constraintSchema);

    C.findOneAndUpdate({'mime_type' : mimetype}, {'size_limit' : sizeLimit}, function(err){
        if (err){
            callback(false);
        } else {
            callback(true);
        }
    });
};

resources.removeConstraint = function(mimetype, callback){

    var C = mongoose.model('Resource_Constraints', schemas.constraintSchema);

    C.remove({'mime_type' : mimetype}, function(err){
        if (err){
            callback(false);
        } else {
            callback(true);
        }
    });
};

resources.addConstraint = function(mimeType, sizeLimit, callback){

    if(resources.checkMimeType(mimeType))//checkMimeType(mimeType))
    {
        resources.updateConstraint(mimeType,sizeLimit);
        callback(true);
    }
    else{

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
    }

};



