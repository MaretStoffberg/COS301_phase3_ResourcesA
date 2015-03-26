/**
 * Created by Jaco-Louis on 2015/03/20.
 */
var db = require('database');//this will have to be removed and will have to use the connection form connect.js
var mongoose = db.mongoose;//this will have to be removed and will have to use the connection form connect.js
//var json2csv = require('json2csv');
var fs = require('fs');

var reporting = {};

//schemas
var ThreadSchema = new mongoose.Schema
(
    {
        thread_DateCreated: Date,
        thread_Name: String,
        thread_PostContent: Array,
        thread_CreatorID: String,
        thread_SpaceID: String,
        thread_StatusID: Array,
        thread_Parent: String,
        thread_Archived: Date,
        thread_Attachments: Array,
        thread_PostType: String,
        thread_Closed: Boolean,
        thread_DateClosed: Date
    },
    {
        collection: 'Threads'
    }
);

var LecturerSchema = mongoose.Schema({
    lecturer_Name: String,
    lecturer_Surname: String,
    lecturer_Phone: String,
    lecturer_Email: String,
    lecturer_Archived: Boolean},{
    collection:"Lecturers"
});

var StudentSchema = new mongoose.Schema
( //Defines a schema for retrieving collections
    {
        std_StudentNumber : String,
        std_Name : String,
        std_Surname : String,
        std_PhoneNumber : String,
        std_Email : String,
        std_Mark : String
    },
    {
        collection: 'Students'
    }
);


/* getResponse(response)
 *  takes response given by user and mediates the correct function calls.
 */
reporting.getResponse =  function(response)
{
    if(response == "")
    {
        return;
    }

};

//getting the required data

/* getStudents
 * gets all relevant student data
 */
reporting.getStudents =  function()
{
    var Students_Collec = mongoose.model('Students',StudentSchema);
    var json = "";
    Students_Collec.find({}, function (err, Students)
    {
        json = "[";
        Students.forEach(function(Student)  //Retrieve one student collection and display in table
        {
            json = json + '{"Student Number": "'+Student.std_StudentNumber+'","Name": "'+Student.std_Name+'","Surname": "'+Student.std_Surname+'","PhoneNumber": "'+Student.std_PhoneNumber+'","Email": "'+Student.std_Email+'","Mark": "'+Student.std_Mark+'"},';
        });
        json = json + '{"Student Number": "","Name": "","Surname": "","PhoneNumber": "","Email": "","Mark": ""}]';//Adding in a blank record to cap it off and prevent trailing commas.
        json = json.replace("[object Object]","");//Some weird bug that keeps adding this to the beginning of the string,so I just remove it.

        reporting.downloadCSV("All Students",json, ['Student Number','Name','Surname','PhoneNumber','Email','Mark']);

    })
};

reporting.getLecturers =  function()
{
    var Lecturer = mongoose.model("Lecturers", LecturerSchema);
    var json = "";
    Lecturer.find({}, function (err, Lec) {
        json = "[";
        Lec.forEach(function (Lecturer) {
            json = json + '{"Name": "'+Lecturer.lecturer_Name+'","Surname": "'+Lecturer.lecturer_Surname+'","PhoneNumber": "'+Lecturer.lecturer_Phone+'","Email": "'+Lecturer.lecturer_Email+'","Archived": "'+Lecturer.lecturer_Archived+'"},';
            //console.log(Lecturer.lecturer_Name, Lecturer.lecturer_Surname, Lecturer.lecturer_Phone, Lecturer.lecturer_Email, Lecturer.lecturer_Archived)
        });
        json = json + '{"Name": "","Surname": "","PhoneNumber": "","Email": "","Archived": ""}]';//Adding in a blank record to cap it off and prevent trailing commas.
        json = json.replace("[object Object]","");//Some weird bug that keeps adding this to the beginning of the string,so I just remove it.
        reporting.downloadCSV("All Lecturers",json,['Name','Surname','PhoneNumber','Email','Archived']);
    });
};

reporting.getThreads =  function()
{
    var threadCollec = mongoose.model('Threads', ThreadSchema);
    var json = "";
    threadCollec.find({}, function (err, Threads) {
        json = "[";
        Threads.forEach(function (Thread)
        {
            json = json + '{"DateCreated": "'+Thread.thread_DateCreated+'","Name": "'+Thread.thread_Name +'","PostContent": "'+Thread.thread_PostContent+'","CreatorID": "'+Thread.thread_CreatorID
            +'","SpaceID": "'+Thread.thread_SpaceID +'","StatusID": "'+Thread.thread_StatusID+'","Parent": "'+Thread.thread_Parent+'","Archived": "'+Thread.thread_Archived+'","AllAttchements": "'+Thread.thread_Attachments
            +'","PostType": "'+Thread.thread_PostType +'","Closed": "'+Thread.thread_Closed  +'","ClosingDate": "'+Thread.thread_DateClosed +'"},';
        });
        json = json + '{"DateCreated": "","Name": "","PostContent": "","CreatorID": "","SpaceID": "","StatusID": "","Parent": "","Archived": "","AllAttchements": "","PostType": "","Closed": "","ClosingDate": ""}]';//Adding in a blank record to cap it off and prevent trailing commas.
        json = json.replace("[object Object]","");//Some weird bug that keeps adding this to the beginning of the string,so I just remove it.
        reporting.downloadCSV("All Threads",json,['DateCreated','Name','PostContent','CreatorID','SpaceID','StatusID','Parent','Archived','AllAttchements','PostType','Closed','ClosingDate']);
    });
};

reporting.getThreadsBy =  function(course)
{
    var threadCollec = mongoose.model('Threads', ThreadSchema);

    var subject = course; //= req.query.text;
    var json = "";
    threadCollec.find({'thread_SpaceID': subject}, function (err, Threads) {
        json = "[";
        Threads.forEach(function (Thread)
        {
            json = json + '{"DateCreated": "'+Thread.thread_DateCreated+'","Name": "'+Thread.thread_Name +'","PostContent": "'+Thread.thread_PostContent+'","CreatorID": "'+Thread.thread_CreatorID
            +'","SpaceID": "'+Thread.thread_SpaceID +'","StatusID": "'+Thread.thread_StatusID+'","Parent": "'+Thread.thread_Parent+'","Archived": "'+Thread.thread_Archived+'","AllAttchements": "'+Thread.thread_Attachments
            +'","PostType": "'+Thread.thread_PostType +'","Closed": "'+Thread.thread_Closed  +'","ClosingDate": "'+Thread.thread_DateClosed +'"},';
        });
        json = json + '{"DateCreated": "","Name": "","PostContent": "","CreatorID": "","SpaceID": "","StatusID": "","Parent": "","Archived": "","AllAttchements": "","PostType": "","Closed": "","ClosingDate": ""}]';//Adding in a blank record to cap it off and prevent trailing commas.
        json = json.replace("[object Object]","");//Some weird bug that keeps adding this to the beginning of the string,so I just remove it.
        downloadCSV(course + " Threads",json, ['DateCreated','Name','PostContent','CreatorID','SpaceID','StatusID','Parent','Archived','AllAttchements','PostType','Closed','ClosingDate']);
    });
};

reporting.downloadCSV = function(fileName, inJson, fields)//Uses json2csv and save the file on the HDD
{
    var json2csv = require('json2csv');
    var parsedJSON = JSON.parse(inJson);

    json2csv({data: parsedJSON, fields: fields}, function(err, csv) {
        if (err) console.log(err);
        fs.writeFile(fileName+'.csv', csv, function(err) {
            if (err) throw err;
            console.log('file saved');
        });
    });
};

module.exports = reporting;