const express = require('express');
const { Op } = require("sequelize");
const {authenticated} = require('../middleware/auth');
const db = require('../models');
const router = express.Router();

// 보드 생성
router.post('/',authenticated,async (req,res,next)=>{
    try {
       const {title,description}=req.body;
       if(!title){
        return  res.status(404).json({
            success:false,
            msg:'보드이름이 존재하지 않습니다.'
        })
       }
      const newBoard= await db.Board.create({
           title,
           description,
           bgcolor:req.body.bgcolor || '#FFF8E1',
           UserId:req.user.id
       })
       return  res.status(200).json({
        success:true,
        board:newBoard,
        msg:'성공적으로 보드 생성 완료하였습니다.'
    })
    } catch (error) {
        console.error(error)
      return  res.status(404).json({
            success:false,
            msg:'보드가 생성되지 않았습니다.'
        })
    }
})
// 보드 가져오기
router.get('/',authenticated,async (req,res,next)=>{
    try {
        // 보드는 무조건 샘플보드를 생성합니다.
        const board=await db.Board.findOrCreate({where:{
            title:'샘플보드..',
            bgcolor:'#FFF8E1',
            UserId:req.user.id
        }})
        const boards=await db.Board.findAll({
            where:{UserId:req.user.id},
            order:[['createdAt','DESC']]
        })
       return  res.json({
        success:true,
        boards
    })
    } catch (error) {
        console.error(error)
      return  res.status(404).json({
            success:false,
            msg:'해당 보드는 존재하지 않습니다.',
            error,
        })
    }
})
// 보드에있는 카드 가져오기
router.get('/:BoardId', authenticated, async (req, res, next) => {
    try {
        const board=await db.Board.findOne({
            where: {
                [Op.and]: [{
                    UserId: req.user.id
                }, {
                    id:req.params.BoardId
                }]
            },
        })
        // 보드가 존재하지 않을때 오류처리
        if(!board){
            return res.status(404).json({
                success: false,
                msg: '해당 보드는 존재하지 않습니다.'
            })
        }
        // 해당 보드의 카드의 갯수를 가져옵니다.
        const cardcount = await db.Card.count({where:{
            [Op.and]: [{
                UserId: req.user.id
            }, {
                BoardId: req.params.BoardId
            }]
        }})
        // 해당 보드에 카드가 없을 경우에만 샘플카드를 생성해줍니다.
        if(!cardcount){
            // 샘플 카드의 샘플 카테고리 생성
            const sampleCategory = await db.Category.findOrCreate({
                where: {
                    type: '카테고리',
                    icon: 'mdi-train-car',
                }
            })
            // 샘플 카드 생성
            const sampleCard = await db.Card.findOrCreate({
                where: {
                    title: '샘플카드..',
                    description:'샘플 카드 내용 입니다',
                    BoardId: req.params.BoardId,
                    CategoryId: sampleCategory[0].dataValues.id,
                    bgcolor: '#FFF8E1',
                    UserId: req.user.id
                }
            })
            // 샘플 카테고리 추가
            await sampleCard[0].addCardTypes(sampleCategory[0].dataValues.id)
        }

        const cards = await db.Card.findAll({
            where: {
                [Op.and]: [{
                    UserId: req.user.id
                }, {
                    BoardId: req.params.BoardId
                }]
            },
            order: [
                ['createdAt', 'DESC']
            ],
            include: [{
                model: db.Category,
                as: 'CardTypes',
                order: [
                    ['type', 'ASC']
                ]
            }, {
                model: db.Category,

            }]
        })
        return res.json({
            success: true,
            cards
        })
    } catch (error) {
        console.error(error)
        return res.status(404).json({
            success: false,
            msg: '해당 보드를 불러올 수 없습니다'
        })
    }
})
//보드 수정
router.put('/:BoardId',authenticated,async (req,res,next)=>{
    try {

       const board=await db.Board.findOne({
        where:{[Op.and]:[{UserId:req.user.id},{id:req.params.BoardId}]},
           });

       if(!board){
        return  res.status(404).json({
            success:false,
            msg:'해당 보드는 존재하지 않습니다.'
        })
       }
        // 보드 수정시, 보드 색을 수정하지 않았다면, 기존의 보드 색을 찾아 보내줍니다.
       let bgcolor;
       if (!req.body.bgcolor){
        //    보드 색을 수정하지 않았으므로 기존 보드의 색 
         const boardColor=await db.Board.findOne({ where:{[Op.and]:[{UserId:req.user.id},{id:req.params.BoardId}]},attributes:['bgcolor']})
         bgcolor=boardColor.bgcolor
       }else{
        //    보드 색을 수정했으니 수정한 보드의 색
           bgcolor=req.body.bgcolor
       }
    //    보드 수정
     await db.Board.update({
           title:req.body.title,
           description:req.body.description,
           pos:req.body.pos,
           bgcolor
       },{
        where:{id:req.params.BoardId }
       })
       const newBoard=await db.Board.findOne({
            where:{ id:req.params.BoardId }
       })
       return  res.status(200).json({
        success:true,
        board:newBoard,
        msg:'성공적으로 보드 수정 완료했습니다.'
    })
    } catch (error) {
        console.error(error)
      return  res.status(404).json({
            success:false
        })
    }
})
//보드 삭제
router.delete('/:BoardId',authenticated,async (req,res,next)=>{
    try {

        // 보드 삭제시, 보드가 가지고 있는 카드도 삭제해줍니다.
        await db.Card.destroy({
            where:{[Op.and]:[{UserId:req.user.id},{BoardId:req.params.BoardId}]},
        })
        // 보드 삭제
        await db.Board.destroy({
            where:{[Op.and]:[{UserId:req.user.id},{id:req.params.BoardId}]},
        })

       return  res.status(200).json({
        success:true,
        msg:'성공적으로 보드 삭제 완료했습니다.'
    })
    } catch (error) {
        console.error(error)
      return  res.status(404).json({
            success:false
        })
    }
})
module.exports=router;