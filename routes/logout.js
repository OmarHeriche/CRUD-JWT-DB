const express= require('express');
const {logout}=require('../controllers/auth');
const router=express.Router();

router.route('/').get(logout);
module.exports=router;