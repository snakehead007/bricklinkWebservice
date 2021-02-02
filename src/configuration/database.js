const mongoose = require('mongoose');
const {logger} = require("fyrebrick-helper").helpers;
const {vars} = require('../helpers/constants/vars');
const start = async () => {
    const db_uri = vars.mongodb.uri;
    try {
        mongoose.connect(db_uri, {
            useCreateIndex: true,
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
        mongoose.connection.on('open', () => {
            logger.info(`mongodb connection opened at ${db_uri}`);
        });
        mongoose.connection.on('close', () => {
            logger.warn(`mongodb connection opened at ${db_uri}`);
        });
        mongoose.connection.on('error',(err)=>{
            logger.error(`MongoDB gave an error ${err}`);
            logger.debug(`retrying connection...`);
            mongoose.connect(db_uri, {
                useCreateIndex: true,
                useUnifiedTopology: true,
                useNewUrlParser: true
            });
        })
    } catch (e) {
        logger.error(`caught err: ${e}`);
        process.exit(1);
    }
};

module.exports = 
{
    start
};