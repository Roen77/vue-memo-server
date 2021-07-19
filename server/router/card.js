const express = require('express');
const {authenticated} = require('../middleware/auth');
const { Op } = require("sequelize");
const db = require('../models');
// const sequelize=require('sequelize');
const router = express.Router();

// 카드 생성
router.post('/',authenticated,async (req,res,next)=>{
    try {
       const {title,description,BoardId,CategoryId}=req.body;
       if(!title){
        return  res.status(404).json({
            success:false,
            msg:'카드이름이 존재하지 않습니다.'
        })
       }
    //    카드 생성
      const newCard= await db.Card.create({
           title,
           description,
           bgcolor:req.body.bgcolor || '#00BCD4',
           BoardId,
           CategoryId,
           UserId:req.user.id
           
       })
       let categoryList;
       if(req.body.category){
        const {category}=req.body;
        categoryList= await Promise.all(category.map(c=>{
            return db.Category.findOrCreate({where:{
                type:c.type,
                icon:c.icon
            }})
        }))
       }


     await newCard.addCardTypes(categoryList.map(category=>category[0]))

     const card=await db.Card.findOne({where:{
        id:newCard.id
    },include:[{
       model:db.Category,
       as:'CardTypes',
    },{
        model:db.Category,

    }]})
       
       return  res.status(200).json({
        success:true,
        card,
        msg:'성공적으로 카드 생성 완료하였습니다.'
    })
    } catch (error) {
        console.error(error)
      return  res.status(404).json({
            success:false,
            error
        })
    }
})
// 카드가져오기
router.get('/:CardId',authenticated,async (req,res,next)=>{
    try {

        const cards=await db.Card.findOne({
            where:{[Op.and]:[{UserId:req.user.id},{id:req.params.CardId}]},
            order:[['createdAt','DESC']],
            include:[{
                model:db.Category,
                as:'CardTypes',
                order:[['type','ASC']]
            },{
                model:db.Category,
                attributes:['id','type','icon','imagetype']
                
            }]
        })
        if(!cards){
            return  res.status(404).json({
                success:false,
                msg:'해당 카드는 존재하지 않습니다.'
            })
        }
       return  res.json({
        success:true,
        cards
    })
    } catch (error) {
        console.error(error)
      return  res.status(404).json({
            success:false,
            msg:'해당 카드는 존재하지 않습니다.'
        })
    }
})
//카드 수정
router.put('/:CardId',authenticated,async (req,res,next)=>{
    try {
       const card=await db.Card.findOne({
        where:{[Op.and]:[{UserId:req.user.id},{id:req.params.CardId}]}
       });
       if(!card){
        return  res.status(404).json({
            success:false,
            msg:'해당 카드는 존재하지 않습니다.'
        })
       }
       let updateData={}
    //    카드의 진행중/완료 상태 수정
       if (req.body.cardState) {
           updateData = {
               complete: req.body.complete
           }
       } else if (req.body.title && req.body.description) {
        //    카드의 내용 수정(카드의 제목,메모)
           let bgcolor;
        //    req.body에 bgcolor 속성이 없다면, 카드 색을 수정하지 않은 것으로, 기존의 카드 색을 찾습니다.
           if (!req.body.bgcolor) {
               const cardColor= await db.Card.findOne({
                   where: {
                       [Op.and]: [{
                           UserId: req.user.id
                       }, {
                           id: req.params.CardId
                       }]
                   },
                   attributes: ['bgcolor']
               })
               bgcolor = cardColor.bgcolor
           } else {
            //    카드 색을 수정했다면, 수정한 데이터를 넣어줍니다.
               bgcolor = req.body.bgcolor
           }
           updateData = {
               title: req.body.title,
               description: req.body.description,
               bgcolor
           }
       }
    //    카드 수정
        await db.Card.update(updateData,{
        where:{ id:req.params.CardId }
       })
       
    //    const newcard=await db.Card.findOne({
    //     where:{ id:req.params.CardId },
    //     include:[{
    //         model:db.Category,
    //         as:'CardTypes',
    //         order:[['type','ASC']],
    //         through:db.Category
    //     }]
    // });
       return  res.status(200).json({
        success:true,
        // card:newcard,
        msg:'성공적으로 카드 수정 완료했습니다.'
    })
    } catch (error) {
        console.error(error)
      return  res.status(404).json({
            success:false,
            error,
            msg:'카드 수정시 오류가 발생했습니다. 다시 시도해주세요'
        })
    }
})
//카드 삭제
router.delete('/:BoardId/:CardId',authenticated,async (req,res,next)=>{
    try {
        await db.Card.destroy({
            where:{[Op.and]:[{UserId:req.user.id},{id:req.params.CardId}]},
        })
        // 보드에 존재하는 카드의 갯수를 불러옵니다.
        const cardCount=await db.Card.count({where:{[Op.and]:[{UserId:req.user.id},{BoardId:req.params.BoardId}]}})
        // 보드에 존재하는 카드가 없다면 해당 보드를 삭제해줍니다.
        if(!cardCount){
            await db.Board.destroy({where:{[Op.and]:[{UserId:req.user.id},{id:req.params.BoardId}]}})
            return  res.status(200).json({
                success:true,
                isNotCard:true,
                msg:'성공적으로 카드 삭제 완료했습니다.'
            })
        }

       return  res.status(200).json({
        success:true,
        msg:'성공적으로 카드 삭제 완료했습니다.'
    })
    } catch (error) {
        console.error(error)
      return  res.status(404).json({
            success:false
        })
    }
})
// 카드 진행중/완료한카드 가져오기
router.get('/status/:complete',authenticated,async (req,res,next)=>{
    try {
        let cards;
        // 완료된 카드를 가져옵니다.
       if(req.params.complete ==="2"){
        cards=await db.Card.findAll({
            where:{[Op.and]:[{UserId:req.user.id},{complete:true}]},
            order:[['createdAt','DESC']],
            attributes:['complete','title','id','description','bgcolor'],
            include:[{
                model:db.Category,
                attributes:['type']
            }]
        })
       }else{
        //    진행중인 카드를 가져옵니다.
        cards=await db.Card.findAll({
            where:{[Op.and]:[{UserId:req.user.id},{complete:false}]},
            order:[['createdAt','DESC']],
            attributes:['complete','title','id','description','bgcolor'],
            include:[{
                model:db.Category,
                attributes:['type']
            }]
        })
       }

       return  res.status(200).json({
        success:true,
        cards
    })
    } catch (error) {
        console.error(error)
      return  res.status(404).json({
            success:false,
        })
    }
})
module.exports=router;