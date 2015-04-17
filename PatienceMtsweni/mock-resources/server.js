/**
 * Created by XPS on 4/16/2015.
 */
var express = require('express');
var app = express();
var Ioc = require('electrolyte');
Ioc.loader(Ioc.node('./'));
var db = Ioc.create('resources');
var multer = require('multer');

app.use(multer({
    dest: './uploads',
    rename: function(fieldname,filename){
        return filename + Date.now();
    },
   putSingleFilesInArray : true
}));

app.get('/', function(req,res){
    res.sendfile("index.html");
});
app.get('/manageConstraints', function(req, res){

    db.getConstraints(function(err, results){
        if (err){
            var html = "<p>Could not retrieve requested information from the database.</p>"
        } else {
            html = "<table><tr><td>Mime Type</td><td>File Size Limit</td></tr>\r\n";
            results.forEach(function(con){
                html += "<tr><td>"+con.mime_type+
                "</td><td>"+Math.round(con.size_limit/(1024*1024))+
                " MB</td><td><a href='/removeConstraint/"+con._id+"'>remove</a></td></tr>\r\n";
            });
            html += "</table>";
            res.render('dynamic_views/constraintsManagement', { results:  html});
        }
    });
});

app.get('/addConstraint', function(req, res){

    res.sendFile("addconstraint.html");
    /*{
        success : ""
    });*/
});
/*app.get('/removeConstraint', function(req, res){

    var id = req.url.replace('/removeConstraint/', "");
    db.removeConstraint(id, function(truth){
        if (!truth){
            res.render('dynamic_views/constraintsManagement', {
                results: "An error occurred!"
            });
        } else {
            db.getConstraints(function(err, results){
                if (err){
                    var html = "<p>Could not retrieve requested information from the database.</p>";
                } else {
                    html = "<table><tr><td>Mime Type</td><td>File Size Limit</td></tr>\r\n";
                    results.forEach(function(con){
                        html += "<tr><td>"+con.mime_type+
                        "</td><td>"+Math.round(con.size_limit/(1024*1024))+
                        " MB</td><td><a href='/removeConstraint/"+con._id+"'>remove</a></td></tr>\r\n";
                    });
                    html += "</table>";
                    res.render('dynamic_views/constraintsManagement', { results:  html});
                }
            });
        }
    });
});*/

// adds a new constraint (for DEMO)
/*app.post('/submitConstraint',function(req, res){

    db.addConstraint(req.body.mime_type, req.body.size_limit, function(truth){
        if (!truth){
            res.sendFile('constraintsManagement.html', {
                results: "An error occurred!"
            });
        } else {
            db.getConstraints(function(err, results){
                if (err){
                    var html = "<p>Could not retrieve requested information from the database.</p>"
                } else {
                    html = "<table><tr><td>Mime Type</td><td>File Size Limit</td></tr>\r\n";
                    results.forEach(function(con){
                        html += "<tr><td>"+con.mime_type+
                        "</td><td>"+Math.round(con.size_limit/(1024*1024))+
                        " MB</td><td><a href='/removeConstraint/"+con._id+"'>remove</a></td></tr>\r\n";
                    });
                    html += "</table>";
                    res.render('dynamic_views/constraintsManagement', { results:  html});
                }
            });
        }
    });
});
*/
app.post('/submitPost',function(req,res){
    console.log(req.files['resource']);
   db.uploadResources(req.files['resource'],1,function(truth) {
        if (!truth)
	    res.end("File not uploaded to db.");
        else
            res.end("File uploaded to db.");
    });
});

app.listen(3000,function(){
    console.log("working on port 3000");
});