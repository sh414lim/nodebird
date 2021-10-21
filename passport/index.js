const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const User = require('../models/user');

module.exports = ()=>{ //req.login이 넘어온다(auth.js)
    passport.serializeUser((user,done)=>{
        done(null,user.id); //세션의 user 아이디만 저장
    });
    // 유저의 정보를 아이디로 함축
        //{id:3,'connect.sid' :s%1231412495} 세션 쿠키

        //유저의 정보로 다시 복구 (메모리 효율문제 해결)
    passport.deserializeUser((id,done)=>{ //req.user 이 여기서 생성된다
        User.findOne({
            where:{id},
            include:[{
                model:User,
                attributes:['id','nick',],
                as:'Followers',
            },{
                model:User,
                attributes:['id','nick'],
                as:'Followings',
            }],
        })
        .then(user => done(null,user)) //req.user,req.isAuthenticated()
        .catch(err=>done(err));
    });

    local();
    kakao();
}