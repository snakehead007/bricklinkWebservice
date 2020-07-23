var express = require('express');
var router = express.Router();
var Order = require('../models/order');
const User = require('../models/user');
const db_getSpecificOrder = require('../functions/db/getSpecificOrder');
const db_updateSpecificOrder = require('../functions/db/updateSpecificOrder');
router.get('/orders',async(req,res,next)=>{
    let orders = await Order.findOne({consumer_key:user.CONSUMER_KEY});
    res.setHeader('Content-Type', 'application/json');
    res.send(orders);
});

router.get('/order/:order_id',async (req,res,next)=>{
    res.setHeader('Content-Type', 'application/json');
    let orders_total= Number(req.query.orders_total);
    let user = await User.findOne({_id:req.session._id});
    res.send(await db_getSpecificOrder.default(orders_total,user,req.params.order_id));
});

//updates a specific order from the db
//body properties can be:
//item: [string (inventory_id)] (this will change its boolean value, if not exists will create it)
//description: [String]
router.put('/order/:order_id',async (req,res,next)=>{
    let user = await User.findOne({_id:req.session._id});
    let order = await Order.findOne({order_id:req.params.order_id,consumer_key:user.CONSUMER_KEY});
    await db_updateSpecificOrder.default(order,user,req.body.item,req.params.order_id,req.body.description);
    res.send({}); //have to send something back, front end relies on a check if completed. (progress bar and description button)
});

module.exports = router;