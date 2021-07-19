const jwt = require('jsonwebtoken');
const db = require('../models');
require('dotenv').config();



const auth={
    verifyToken(token){
      return new Promise((resolve,reject)=>{
            jwt.verify(token.replace(/^Bearer\s/, ''),process.env.SECRET_KEY,(err,result)=>{
                if(err) return reject(err)
               resolve(result)
            })
        })
    },
    async authenticated(req,res,next){
        if(!req.headers.authorization){
            return res.status(401).json({
                success:false,
                msg:'토큰이 포함되어 있지 않습니다.'
            })
        }

        const token=req.headers.authorization
        let payload
        try {
           payload =await auth.verifyToken(token)
           const user=await db.User.findOne({
               where:{id:payload.id}
           })
           req.user=user
        } catch (error) {
            console.error(error)
            return res.status(401).json({
                success:false,
                msg:'토큰이 유효하지 않습니다.'
            })
        }

        next()
    }
}

module.exports=auth