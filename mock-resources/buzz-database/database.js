/**
 * @param settings
 * @returns {{db: (Mongoose.connection), mongoose: Mongoose}}
 */
module.exports = function(settings) {
    /**
     * @type {Mongoose}
     */
    var mongoose = require('mongoose');
    mongoose.connect(settings.database);

    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function (callback) {
        console.log("Connection to database was successful.");
    });

    return {"db" : db, "mongoose":mongoose};
};

module.exports['@singleton'] = true;
module.exports['@require'] = ['buzz-settings'];
