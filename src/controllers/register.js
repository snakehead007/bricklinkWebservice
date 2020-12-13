const bricklinkPlus = require("bricklink-plus");
const User = require('../models/user');
const {logger} = require('../configuration/logger');
const {vars} = require('../helpers/constants/vars');
const superagent = require('superagent');
const { set } = require("mongoose");

const register = {
    get:async (req,res,next)=>{
        const user = await User.findById(req.session._id);
        res.render('register',{user:user});
    },
    post:async(req,res,next)=>{
        let userInfo = {
            CONSUMER_KEY:req.body.consumerKey.trim(),
            CONSUMER_SECRET:req.body.consumerSecret.trim(),
            TOKEN_SECRET:req.body.tokenSecret.trim(),
            TOKEN_VALUE:req.body.tokenValue.trim(),
            setUpComplete:false
        };
        console.log(req.session);
        const test = await bricklinkPlus.api.item.getItem("PART","3001",userInfo);
        logger.info(`Test of bricklink API keys : status code ${test.meta.code}`);
        if(test.meta.code==200){
            logger.info(`Test complete, user ${req.session.email} has provided with valid keys`);
            userInfo.setUpComplete=true;
            const user = await User.findOne({_id:req.session._id}); //find out if user is returning user
            if(!user){
                logger.warn(`Could not find user from its _id ${req.session._id}, logging out`);
                res.redirect('/logout');
            }else if(!user.setUpComplete){
                logger.info(`New user found, getting all information for user ${user.email}`);
                await User.updateOne({_id:req.session._id},userInfo); //new user, so update its bricklink tokens.               
                superagent.post(`${vars.fyrebrick.updater_api_host}:${vars.fyrebrick.updater_api_port}/all`)
                .send({_id:req.session._id})
                .set('accept','json')
                .end((err,res)=>{
                    if(err){
                        logger.error(`giving updater-api request to update all gave err: ${err}`);
                        res.render('register');
                    }
                    logger.info(`request to updater-api for user ${req.session.user.email} successful`);
                })
            }
            req.session.user = await User.findOne({_id:req.session._id});
            req.session.logged_in = true;
            res.redirect('/');
          }else{
            logger.warn(`user trying to register but gave status code ${test.meta.code}, err: ${test.meta.message}`);
            res.render('register',{user:userInfo});
          }
    }
}

module.exports = register;