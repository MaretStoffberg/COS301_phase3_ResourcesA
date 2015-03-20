/**
 * Created by Patience Mtsweni on 3/20/2015.
 */
    /** Define dependencies*/
var express = require("express");
var multer = require('multer');
//var mime = require("mime");
var app = express();
var done = false;
var isValidMime;
var mimeType;

/** Configure the multer. */
app.use(multer({dest: './uploads/',
    rename: function(fieldname, filename){
        return filename+Date.now();
    },
    onFileUploadComplete:function(file){
        mimeType = file.mimetype;
        console.log(mimeType);
        done = true;
    }
}));
/** checks if mimetype is valid */
if(mimeType != "undefined")
{
    isValidMime = true;
}
/*Handling the routes. */
app.get('/', function(req, res){
    res.sendFile("upload.html", {root:__dirname})
});

app.post('/api/upload', function(req, res){
   if(done==true && isValidMime == true) {
       console.log(req.files);
        res.end("File uploaded");
    }
    else
   {
       res.end("File not uploaded")
   }
});

/*Run the server. */
app.listen(3000,function(){
    console.log("Working on port 3000")
});