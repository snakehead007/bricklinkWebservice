module.exports = 
{
    vars:{
        express:{
            port:process.env.EXPRESS_PORT,
            session_secret:process.env.SESSION_SECRET
        },
        redis:{
            port:process.env.REDIS_PORT,
            host:(process.env.DEVELOP==="true")?process.env.DEVELOP_REDIS_HOST:process.env.PRODUCTION_REDIS_HOST
        },
        fyrebrick:{
            version:require("../../../package.json").version,
            type:process.env.TYPE,
            develop:(process.env.DEVELOP==="true"),
            updater_api_port:process.env.FYREBRICK_UPDATER_API_PORT,
            updater_api_host:(process.env.DEVELOP==="true")?process.env.DEVELOP_FYREBRICK_UPDATER_API_HOST:process.env.PRODUCTION_FYREBRICK_UPDATER_API_HOST
        },
        google:{
            secret:process.env.GOOGLE_CLIENT_SECRET,
            id:process.env.GOOGLE_CLIENT_ID,
            redirect_uri:(process.env.DEVELOP==="true")?process.env.DEVELOP_GOOGLE_REDIRECT_URL:process.env.PRODUCTION_GOOGLE_REDIRECT_URL
        },
        mongodb:{
            uri:(process.env.DEVELOP==="true")?process.env.DEVELOP_DB_URI:process.env.PRODUCTION_DB_URI
        }
        
    }
};