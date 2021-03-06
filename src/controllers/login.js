const google = require('../helpers/auth/google');
const redis = require('../configuration/session');
const {User} = require("fyrebrick-helper").models;
const logon = async (req,res,next) => {
    if(req.session.logged_in !== undefined){
        if(req.session.logged_in){
            if(req.query && req.query.returnUrl){
                req.session.returnUrl = undefined;
                res.redirect(decodeURIComponent(req.query.returnUrl));
            }else{
                res.redirect("/my/dashboard");
            }
            return;
        }else{
            if(req.session._id){
                const user = await User.findById(req.session._id);
                if(user && user.isBlocked===false && user.setUpComplete ===false){
                    res.render("register",{
                        titleJumbo:"Welcome",
                        buttonTitle:"Create your profile"
                    }); 
                    return;
                }else if(user && user.isBlocked===false && user.setUpComplete === true){
                    res.redirect("/my/dashboard");
                    return;
                }
            }
            if(process.env.NO_LOGIN==="true"){
                req.session.user = await User.findOne();
                req.session._id = req.session.user._id;
                req.session.logged_in = true;
                res.redirect('/my/dashboard');
            }else{
                res.redirect(google.urlGoogle());
            }
            return;
        }
    }
    if(req.query && req.query.returnUrl){
        req.session.returnUrl = req.query.returnUrl;
        if(process.env.NO_LOGIN==="true"){
            req.session.user = await User.findOne();
            req.session._id = req.session.user._id;
            req.session.logged_in = true;
            res.redirect('/my/dashboard');
        }else{
            res.redirect(google.urlGoogle());
        }
        return;
    }else{
        if(process.env.NO_LOGIN==="true"){
            req.session.user = await User.findOne();
            req.session._id = req.session.user._id;
            req.session.logged_in = true;
            res.redirect('/my/dashboard');
        }else{
            res.redirect(google.urlGoogle());
        }
        return;
    }
}

const index = async (req,res,next) => {
    let length = Number.MAX_SAFE_INTEGER;
    let done = 0;
    let found = false;
    if(req.signedCookies && req.signedCookies.fyrebrick_login){
        await redis.client.keys("session*", async (error, keys)=>{
            length = keys.length;
            if(length===0){
                checkLogin(req,res);
                return;
            }
            await keys.forEach(async key=>{
                await redis.client.get(key,async (err,session) =>{
                    session = JSON.parse(session);
                    done++;
                    if(session.sessionID=== req.signedCookies.fyrebrick_login){
                        if(session && session.user){
                            req.session.save();
                            Object.assign(req.session,session);
                            res.redirect('/my/dashboard');
                            found = true;
                            return;
                        }
                    }else if(done===length && found===false){
                        checkLogin(req,res);
                        return;
                    }
                });
            });
        });
    }else{
        checkLogin(req,res);
        return;
    }

}

const acceptCookies = async (req,res)=>{
    if(req.session && req.session._id){
        //found user, will update immediately
        await User.updateOne({_id:req.session._id},{isAcceptedCookies:true});
        res.send({success:true});
    }else{
        //no user found, will have to set a cookie, to update user later
        //set cookie fyrebrick_setAcceptCookie to true
        res.cookie('fyrebrick_setAcceptCookie',true,{expires: new Date(Date.now()+259200000)}); //unsigned, expires in 3 days
        res.send({success:true});
    }
}

const checkLogin = async (req,res) => {
    if(req.session && req.session.logged_in !== undefined){
        if(req.session.returnUrl){
            res.redirect(req.session.returnUrl);
            return;
        }else if(req.session._id){
            const user = await User.findById(req.session._id);
            if(user && user.isBlocked===false && user.setUpComplete ===false){
                res.render("register",{
                    titleJumbo:"Welcome",
                    buttonTitle:"Create your profile"
                }); 
                return;
            }else if(user && user.isBlocked===false && user.setUpComplete === true){
                res.redirect("/my/dashboard");
                return;
            }else{
                req.flash("warning","You are not permitted to login. We are currently in closed alpha. To sign up to the queue send an email at info@fyrebrick.be");
                res.render('logon');
            }
            return;
        }else{
            req.session.destroy();
            res.render('logon');
            return;
        }
    }else{
        res.render('logon');
        return;
    }
}

module.exports = 
{
    logon,
    index,
    acceptCookies
}