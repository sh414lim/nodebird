const express = require('express');

const{ isLoggedIn } = require('./middlewares'); // 필수적 
const User = require('../models/user');

const router= express.Router();

//POST/user/1/follow ->  원칙 동사x  http api
router.post('/:id/follow',isLoggedIn, async(req,res,next)=>{
    try{
        const user = await User.findOne({ where: { id: req.user.id } }); 
    if (user) { 
      await user.addFollowing(parseInt(req.params.id, 10));
      res.send('success');
    } else {
      res.status(404).send('no user');
    }
    }catch(error){
        console.error(error)
        next(error);
    }
})

module.exports = router;