const express = require('express');
const db= require('../models');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
require('dotenv').config();
const router = express.Router();

// 토큰 발급
const setToken = (user,res) => {
    const payload = {
        id: user.id,
        email: user.email,
    };
    jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: process.env.EXPIRATION_DATE
    }, async (err, token) => {
        const fullUser = await db.User.findOne({
            where: {
                id: user.id
            },
            attributes: ['nickname']
        });
       return res.status(200).json({
            success: true,
            user: fullUser,
            token: `Bearer ${token}`,
            msg: '로그인되었습니다.'
        })
    })
}

// login 로그인
router.post('/login',async (req,res,next)=>{
    try {
        const user=await db.User.findOne({
            where:{email:req.body.email}
        })
        // email로 사용자가 존재하는지 확인합니다.
        if(!user){
          return res.status(404).json({
                success:true,
                msg:'가입되지 않은 이메일입니다.'
            })
        }
        // 해당 사용자가 존재한다면, 비밀번호를 비교하여 확인합니다.
        bcrypt.compare(req.body.password,user.password).then((isMatch)=>{
            if(isMatch){
                // 사용자가 존재하고 비밀번호가맞다면 토근값을 발급하고 로그인해줍니다.
                setToken(user,res)
            }else{
                return res.status(404).json({
                    msg:'비밀번호가 일치하지 않습니다',
                    success:false
                })
            }
        })
        
    } catch (error) {
        console.error(error)
      return  res.status(404).json({
            success:false
        })
    }
})

// register 회원가입
router.post('/register',async (req,res,next)=>{
    try {
        const {email,password,nickname}=req.body
      const user = await db.User.findOne({where:{
          email
      }})
       // email로 사용자가 존재하는지 확인합니다.
        if(user){
            return res.status(404).json({
                success:false,
                msg:'이미 가입된 회원입니다.'
            }) 
        }
        // 이미 가입된 사용자가 없다면 비밈번호를 암호화하여 저장시켜줍니다.
        bcrypt.hash(password,10, async(err,hashPassword)=>{
            if(err){
                return status(400).json({
                    success:false,
                    err
                })
            }else{
                // 사용자 정보 저장
              const newuser=await db.User.create({
                    email,
                    password:hashPassword,
                    nickname
                })

                // 회원가입 후 바로 로그인 할 수 있도록 토큰값을 발급해줍니다.
                const newUser=await db.User.findOne({
                    where:{id:newuser.id}
                })
                setToken(newUser,res)

            }
        })
    } catch (error) {
        console.error(error)
      return  res.status(404).json({
            success:false
        })
    }
})

module.exports=router;
