/**
 * Created by Patience Mtsweni(11116774) on 3/22/2015.
 */
var fs = require('fs');
var multer = require('multer'); /**used for uploading*/
var isValid = false;
var done = false;
var tmpPath = '../../temp/';
var path;
var mimtyp;
var size;

/**
 *handles the uploading of a file
 * @param usrID ID of th user who is about to upload the resource
 * @param resource this is the resource the user wants to upload
 * @return (boolean) true if file uploaded successfully, false otherwise
 */
exports.upload = function(usrID,resource){

    multer({
        dest: tmpPath,
        rename: function(fieldname,filename,usrID){
            return filename+usrID+Date.now();
        },
        onFileUploadComplete:function(file){
            path = file.path;
            mimtyp = file.mimetype;
            size = file.size;
            done=true;
        }
    });

    if(done==true) {
        if (checkConstraints(mimtyp, size) == true) {
            /** TODO: Add code to upload file to db **/

            fs.unlink(path);
            isValid= true;
        }

        else {

            fs.unlink(path);
            isValid = false;
        }

    }
    else{
        isValid = false;
    }


    return isValid;

}
/**
 * Validates the MIME type and size allowed for the specified MIME type.
 * @param mimeType The MIME type to be validated.
 * @param fileSize The file size to be tested.
 * @returns {boolean} True if successful in both case, else false.
 */
exports.checkConstraints = function(mimeType,fileSize){

}
/**
 * Locates and removes the indicated resource, if possible.
 * @param resourceID The id of the resource to be removed.
 * @returns {boolean} True if successful, else false.
 */
exports.removeResource = function(resourceID){

}