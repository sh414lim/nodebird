const express = require('express');
const { Post, User } = require('../models');

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user; 
  res.locals.followerCount = req.user ? req.user.Followers.length : 0;
  res.locals.followingCount = req.user ? req.user.Followings.length : 0;
  res.locals.followerIdList = req.user ? req.user.Followings.map(f=>f.id):[]; //팔로우 하고 잇는 사람들은 팔로우 버튼을 없애기위해
  next();
});

router.get('/profile', (req, res) => {
  res.render('profile', { title: '내 정보 - NodeBird' });
});

router.get('/join', (req, res) => {
  res.render('join', { title: '회원가입 - NodeBird' });
});

router.get('/', async (req, res, next) => {
    try{ // 업로드한 게시글 찾기
        const posts=await Post.findAll({
            include:{
                model:User,
                atributes:['id','nick'],
            },
            order:[['createdAt','DESC']],
        });
        res.render('main',{
            title:'NodeBird',
            twits:posts, //찾은 게시글을 posts 로 넣어주기
            user:req.user,
        });
    }catch(err){
        console.error(err);
        next(err);
    }


});

module.exports = router;