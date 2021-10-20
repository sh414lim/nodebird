const express = require('express');

const{ isLoggedIn } = require('./middlewares'); // 필수적 
const User = require('../models/user');

const router= express.Router();

//POST/user/1/follow ->  원칙 동사x  
router.post('/:id/follow',isLoggedIn, async(req,res,next)=>{
    try{
        const user = await User.findOne({where:{id:req.user.id}});//내가 누군지 찾기 
        if(user){  // setFollowing -> 새로운것으로 대체  팔로잉을 가져오려면 get
            await user.addFollowing(parseInt(req.params.id,10)); //1번사용자를 팔로잉
            res.send('success');
        }else{
            res.status(404).send('no user');
        }
    }catch(error){
        console.error(error)
        next(error);
    }
})

module.exports = router;