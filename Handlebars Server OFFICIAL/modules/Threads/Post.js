/*!
 * Post class, contains data relevant to the posts of the system
 */

//! Public
module.exports = Post;

function Post(mimeType, content, dateTime, title, submitter, postType) {
    this.mimeType = mimeType;
    this.content = content;
    this.dateTime = dateTime;
    this.title = title;
    this.submitter = submitter;
    this.postType = postType;

    return this;
}


