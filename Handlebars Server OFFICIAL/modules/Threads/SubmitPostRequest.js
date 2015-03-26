/*!
 * SubmitPostRequest class, used to make a request for  post to be made
 */

//! module.exports --> makes the function available to other files using the require() function;
module.exports.SubmitPostRequest=function(threadToPostIn, newPost, userid/*, newThreadId*/) {

    this.threadToPostIn = threadToPostIn;
    this.newPost = newPost;
    this.userid = userid;
    //this.newThreadId=newThreadId;

};