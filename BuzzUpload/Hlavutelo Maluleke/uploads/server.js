/**
 * Created by GreaterThanSolomon on 2015-03-20.
 */
var express = require("express");
var multer = require('multer');
//var mime = require("mime");
var app = express();
var done = false;
var isValidMime;
var fs = require("fs");
var path;
var size;
var mimeType;
var validSize = false;
/** Configure the multer. */
app.use(multer({dest: '/uploads/',
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
/** check mime type */

function validate(_mimeType,_size){
    if(mimeType != null && size > 0)
        return true;
    else
        return false;
}
/*Handling the routes. */
app.get('/', function(req, res){
    res.sendFile("index.html", {root:__dirname})
});

app.post('/api/upload', function(req, res){
    if(done==true && validate() == true) {
        console.log(req.files);
        res.end("File uploaded");
    }
    else {
        if(size > 0)
            fs.unlink(path);
        res.end("File not uploaded")
    }
});

/*Run the server. */
app.listen(3000,function(){
    console.log("Working on port 3000")
});