/*!
 * Thread class, contains the posts as well as references to parent and children Threads to create the tree structure
 * TODO: Add class variables (and possible auxiliary functions)
 */

//var Authorization = require("./Authorization");
var MoveThreadRequest = require("./MoveThreadRequest");
//<<<<<<< HEAD
var SubmitPostRequest = require("./SubmitPostRequest");
var SubmitPostResults = require("./SubmitPostResult");
var Post = require("./Post.js");
var mongoose = require("database");
//=======
//>>>>>>> origin/Jandre
var CloseThreadRequest = require("./CloseThreadRequest");

// schema for writing thread to database
var threadSchema = mongoose.Schema({
    thread_ID : String,
    thread_DateCreated : Date,
    thread_PostContent : [String],
    thread_SpaceID : String,
    thread_CreaterID : String,
    thread_Parent : String,
    thread_Archived : Boolean,
    thread_PostType : String,
    thread_Closed : Boolean,
    thread_DateClosed : Date
});

//! Public
//module.exports = Thread;

// constructs a thread object
// IMPORTANT: This thread is immediately written to the database upon creation
var Thread = function (/*userId,*/ post, buzzSpace, parent) { //TODO: Add relevant function parameters and class variables
    //console.log("Creating Thread using POST, BUZZSPACE and PARENT");

    var temp = 999;
    if (!parent) {
        //console.log("parent is NULL");
        parent = this;
        temp = 998;
    };

    this.post = post;
    this.parent =  parent;
    this.children = [];
    this.buzzSpace = buzzSpace;
    this.threadSummary = null;
    this.creatorsId = post.submitter;
    this.isArchived =false;
    this.isClosed =false;
    this.threadId = temp;

    // mid-level attributes
    this.dateCreated = Date.now();
    this.dateClosed = null;

    // create model to save to database
    var Thread_mongoose = mongoose.model("Thread", threadSchema, "Threads");
    var threadToSave = new Thread_mongoose(
        {
            thread_ID : this.threadId,
            thread_DateCreated : this.dateCreated,
            //thread_Name : newThread.thread_Name,
            thread_PostContent : this.post.content,
            thread_SpaceID : this.buzzSpace,
            thread_CreaterID : this.creatorsId,
            thread_Parent : this.parent.threadId,
            thread_Archived : this.isArchived,
            //thread_Attachments : newThread.thread_Attachments,
            thread_PostType : this.post.postType,
            thread_Closed : this.isClosed,
            thread_DateClosed : this.dateClosed
        }
    );

    // save new thread to database
    threadToSave.save(function (err, product, numberAffected, threadToSave) {
        if (err) return console.error(err);
        //console.log("product: " + product);
        //console.log("numberAffected: " + numberAffected);
    });

    //console.log("Thread created");
    return this;
};

// adds the passed thread to the list of children of the current thread
Thread.prototype.addChild = function(newChild) {
    this.children.push(newChild);
    newChild.parent = this;
};

Thread.prototype.addSummary = function() {
    this.threadSummary = threadSummary;
}

// creates a new thread from the data received and writes this new thread to the database
Thread.prototype.submitPost = function(submitPostRequest) { //TODO: Add Request object as function parameter  (E.g. submitPostRequest)

    //TODO: Confirm correct parameters to be passed to isAuthorized
    // Authorization to be handled next phase
/*    var isAuthorized = new Authorization().isAuthorized(new isAuthorizedRequest(submitPostRequest.userid,submitPostRequest.threadToPostIn.buzzSpace)); //TODO: Double check how the isAuthorized function returns (object or plain boolean?)
    if(!isAuthorized) { //! User is not authorized to make a post in this current space/thread
        console.log("Insufficient Permissions");

        return new SubmitPostResults('Insufficient Permissions');
    }

    if(this.getThread(threadToPostIn.threadId)==null) { //! Thread no longer exist
        console.log("Thread no longer exist");

        return new SubmitPostResults('Thread no longer exist');
    }

    if(submitPostRequest.threadToPostIn.isHidden) { //! check if parent thread is hidden
        console.log('The thread you are trying to post in is hidden');

        return new SubmitPostResults('The thread you are trying to post in is hidden');
    }
    else if(submitPostRequest.threadToPostIn.isClosed) { //check if parent thread is closed
        console.log('The thread you are trying to post in is closed');

        return new SubmitPostResults('The thread you are trying to post in is closed');
    }*/


    // find buzzspace to post in here, via database

    var newThread = new Thread(/*submitPostRequest.userid,*/ submitPostRequest.newPost, "default_buzz_space", this);
    this.addChild(newThread);

    // next line of code did not work
    //return new SubmitPostResults('Post was successfully made!');
    return { message: "Post was successfully made!" };
};

/*! Jandre */
Thread.prototype.closeThread = function(CloseThreadRequest) {

    threadToClose = CloseThreadRequest.threadToClose;
    userid = CloseThreadRequest.userid;

    var isAuthorized = new Authorization().isAuthorized(new isAuthorizedRequest(userid));
    if(isAuthorized){
        Object.freeze(threadToClose.parent);
        if(this.children.length > 0)
        {
            for(var i = 0; i < threadToClose.parent.children.length; i++)
            {
                Object.freeze(threadToClose.parent.children[i]);
            }
            //console.log("Closed Children");
        }
        console.log("Thread Closed");
        threadToClose.isClosed = true;
    }
    else{
        console.log("Insufficient Permissions");
    }
};

/*! Matthew */
Thread.prototype.moveThread = function(moveThreadRequest) {

    threadToMove = moveThreadRequest.threadToMove;
    newParent = moveThreadRequest.newParent;
    userid = moveThreadRequest.userid;

    //TODO: Confirm correct parameters to be passed to isAuthorized
    var isAuthorized = new Authorization().isAuthorized(new isAuthorizedRequest(userid)); //TODO: Double check how the isAuthorized function returns (object or plain boolean?)
    if(!isAuthorized) { //! User is not authorized to move this thread
        console.log("Insufficient Permissions");
        return false;
    }
    var index = threadToMove.parent.children.indexOf(threadToMove);

    if (index < 0) { //! This thread was not found in its current parent's child list, something went wrong.
        console.log("Child missing from its parent's child list");
        return false;
    }
    else {
        threadToMove.parent.children.splice(index, 1);
    }

    if(threadToMove.isHidden && !newParent.isHidden) { //! Unhide this thread as its new parent is not hidden
        if(!threadToMove.unhideThread()) { //unhideThread request was unsuccessfull
            return false;
        }
    }
    else if(newParent.isHidden && !threadToMove.isHidden) { //! Hide this thread as its parent is hidden
        if(threadToMove.hideThread()) { //hideThread request was unsuccessfull
            return false;
        }
    }

    threadToMove.parent = newParent;
    newParent.children.push(threadToMove);
    return true;
};

// converts the current thread into a string.
// IMPORTANT: this is NOT a JSON string
Thread.prototype.toString = function() {
    var str = "";
    str += "thread: " + this.threadId;
    str += "\n * parent: " +  this.parent.threadId;

    for (var i = 0; i < this.children.length; ++i) {
        str += "\n * child: " + this.children[i].threadId;
    }
    str += "\n * buzzSpace: " + this.buzzSpace;
    str += "\n * thread summary: " + this.threadSummary;
    str += "\n * creatorsId: " + this.creatorsId;
    str += "\n * archived: " + this.isArchived;
    str += "\n * closed: " + this.isClosed;

    str += "\npost:\n * MIMETYPE: " + this.post.mimeType;
    str += "\n * content: " + this.post.content;
    str += "\n * date created: " + this.post.dateTime;
    str += "\n * title: " + this.post.title;
    str += "\n * submitter: " + this.post.submitter;
    str += "\n * postType: " + this.post.postType;
    str += "\n * children: [";

    for (var i = 0; i < this.children.length; ++i) {
        str += " " +  this.children[i].threadId;
    }
    str += " ]";
    return str;
};

/*! Future functions to be delegated and implemented */
Thread.prototype.uncloseThread = function() { //! TODO: Add Request object as function parameter
};

Thread.prototype.summarizeThread = function() { //! TODO: Add Request object as function parameter
};

Thread.prototype.unhideThread = function() { //! TODO: Add Request object as function parameter
};

Thread.prototype.queryThreads = function() { //! TODO: Add Request object as function parameter
};

Thread.prototype.getUserThreads = function() { //! TODO: Add Request object as function parameter
};

Thread.prototype.getThreadsForPeriod = function() { //! TODO: Add Request object as function parameter
};

Thread.prototype.countDescendants = function() { //! TODO: Add Request object as function parameter
};

Thread.prototype.getThread = function() { //! TODO: Add Request object as function parameter
};

Thread.prototype.getPost = function() { //! TODO: Add Request object as function parameter
};

module.exports = Thread;


//console.log("-- Tiny program to test functionality --");
//var MockBuzz = {
//    buzzSpaceId : "test_buzz_space",
//    rootThread : new Thread(/*"admin_user",*/ new Post("text", "Root thread content", Date.now(), "Root Thread Title", "admin_user_post", "information"), "test_buzz_space")
//};
//
//var newSubmitPostRequest = {
//    threadToPostIn : MockBuzz.rootThread,
//    newPost: new Post("text", "I would like to ask a question?", Date.now(), "My Parent is Root", "lowerUser", "question"),
//    userId : "lowerUser"
//};
//console.log(newSubmitPostRequest.newPost);
//MockBuzz.rootThread.submitPost(newSubmitPostRequest);
//MockBuzz.rootThread.submitPost(newSubmitPostRequest);
//
//console.log(MockBuzz.rootThread.toString());
//this.threadToPostIn = threadToPostIn;
//this.newPost = newPost;
//this.userid = userid;
