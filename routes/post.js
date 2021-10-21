const express  =require('express');
const multer = require('multer');
const path =require('path');
const fs=require('fs');

const {Post}=require('../models');
const{isLoggedIn}=require('./middlewares');

const router = express.Router();

try{
    fs.readdirSync('uploads');
}catch(error){
    console.error('uploads 폴더가 없어서 uploads 폴더를 생성합니다');
    fs.mkdirSync('uploads');
}

//멀터 설정
const upload = multer({
    storage: multer.diskStorage({
        destination(req,file,cb){
            cb(null,'uploads/'); //업로드 폴더에 이미지 업로드
        },
        filename(req,file,cb){
            const ext = path.extname(file.originalname);
            cb(null,path.basename(file.originalname,ext)+Date.now()+ext); //파일에 업로드 날짜를 올린다 .
        },
    }),
    limits :{fileSize:5*1024*1024},//용량제한 5mb
});

router.post('/img',isLoggedIn,upload.single('img'),(req,res)=>{ // 멀터 미들웨어, 이미지 업로드
    console.log(req.file);
    res.json({url:`/img/${req.file.filename}`}); //요청 주소는 img 실제파일은 업로드에 들어잇다 요청과 파일주소가 다르다
});

//게시글 업로드 바디들만 업로드 하므로 None
router.post('/',isLoggedIn,upload.none(),async(req,res,next )=>{
    try{
        const post =await Post.create({
            content:req.body.content,
            img:req.body.url,
            UserId:req.user.id,
        });

        res.redirect('/');
    }catch(error){
        console.error(error);
        next(error);
    }
});


module.exports=router;