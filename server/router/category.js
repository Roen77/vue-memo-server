const express = require('express');
const db = require('../models');
const {authenticated} = require('../middleware/auth')
const router = express.Router();
const {upload} =require('../middleware/photo');


// 카테고리 가져오기
router.get('/:BoardId',authenticated,async (req,res,next)=>{
    try {
        const {type}=req.body;
        const Board=await db.Board.findOne({
            where:{id:req.params.BoardId}});
        if(!Board){
            return  res.status(404).json({
                success:false,
                msg:'보드가 존재하지 않습니다.'
            })
        }
        const defaultcategoryList=[{type:'여행',icon:'mdi-train-car'},{type:'힐링',icon:'mdi-battery-heart'},{type:'회사',icon:'mdi-domain'}]
        // 샘플 카테고리를 생성하여 추가해줍니다.
        const categoryList=await Promise.all(defaultcategoryList.map(category=>{
            return db.Category.findOrCreate({
                where:category
            })
        }))
    //   if(req.body.CardId){
    //       const cardCategorys=await getCardTypes({ through: { where: { CardId:req.body.CardId} } })
    //       let reArr=[]
    //     categorys.filter((category,index)=>{
    //         if(cardCategorys.find((card,c_index)=>{
    //             card.id===category.id && c_index !==index
    //         })){
    //             reArr.push(category)
    //         }
    //     })

    // }
       return  res.json({
        success:true,
        categorys:categoryList.map(category=>category[0]),
    })
    } catch (error) {
        console.error(error)
      return  res.status(404).json({
            success:false,
            msg:'카드를 추가할 수 없습니다.'
        })
    }
})
// 카드카테고리 가져오기
// router.get('/:BoardId/:CardId',authenticated,async (req,res,next)=>{
//     try {
//         const Board=await db.Board.findOne({
//             where:{id:req.params.BoardId}});
//         const card=await db.Card.findOne({
//             where:{id:req.params.CardId}
//         })
//         if(!Board){
//             return  res.status(404).json({
//                 success:false,
//                 msg:'보드가 존재하지 않습니다.'
//             })
//         }

//       const categorys= await Board.getTypes({ through: { where: { BoardId:req.params.BoardId} } })
//       let reArr=[]
//       if(req.params.CardId){
//           const cardCategorys=await card.getCardTypes({ through: { where: { CardId:req.params.CardId} } })
//         categorys.filter((category,index)=>{
//             if(!cardCategorys.find((c,i)=>c.id ===category.id)){
//                 reArr.push(category)
//             }
//         })
//         console.log(reArr)

//     }
//        return  res.json({
//         success:true,
//         categorys:reArr
//     })
//     } catch (error) {
//         console.error(error)
//       return  res.status(404).json({
//             success:false
//         })
//     }
// })
// 카드 카테고리 추가
router.post('/:BoardId/:CardId',upload.single('image'),authenticated,async (req,res,next)=>{
    try {
        const {type}=req.body;
        const Card=await db.Card.findOne({
            where:{id:req.params.CardId}});
   
        if(!Card){
            return  res.status(404).json({
                success:false,
                msg:'카드가 존재하지 않습니다.'
            })
        }
        // 추가할 카테고리가 없을 경우에만 카테고리를 추가해줍니다.
        const category=await db.Category.findOrCreate({
           where:{type},
           defaults:{
               imagetype:true,
               icon:req.file.location
           }
        })

        // 추가예정인 카테고리가 이미 있는지 확인합니다.
        const excategory=await Card.getCardTypes({ through: { where: { CategoryId:category[0].id } } })
        if(excategory && excategory.length>0){
            // 이미 존재하는 카데고리가 있을 경우
            return res.status(400).json({
                success:false,
                msg:'이미 존재하는 카테고리입니다.'
            })
        }else{
            // 이미 존재하는 카테고리가 없을 경우에만 카테고리 데이터를 추가합니다.
            await Card.addCardTypes(category[0].dataValues.id)
            return  res.json({
                success:true,
                category,
                msg:'성공적으로 카테고리 생성 완료하였습니다.'
            })
        }
 
 
    } catch (error) {
        console.error(error)
      return  res.status(404).json({
            success:false
        })
    }
})
//카드 카테고리 삭제
router.delete('/:BoardId/:CardId/:CategoryId',authenticated,async (req,res,next)=>{
    try {   
            const Card=await db.Card.findOne({
                where:{id:req.params.CardId}});
       
            if(!Card){
                return  res.status(404).json({
                    success:false,
                    msg:'카드가 존재하지 않습니다.'
                })
            }
           await Card.removeCardTypes(req.params.CategoryId)
       return  res.json({
        success:true,
        // categorys,
        msg:'성공적으로 카테고리 삭제 완료하였습니다.'
    })
    } catch (error) {
        console.error(error)
      return  res.status(404).json({
            success:false
        })
    }
})
//카드 카테고리 수정
router.put('/:BoardId/:CardId',authenticated,async (req,res,next)=>{
    try {   
            const Card=await db.Card.findOne({
                where:{id:req.params.CardId}});
       
            if(!Card){
                return  res.status(404).json({
                    success:false,
                    msg:'카드가 존재하지 않습니다.'
                })
            }
         await db.Card.update({
            CategoryId:req.body.CategoryId
         },{
            where:{id:req.params.CardId}
         })
       return  res.json({
        success:true,
        // categorys,
        msg:'성공적으로 카테고리 삭제 완료하였습니다.'
    })
    } catch (error) {
        console.error(error)
      return  res.status(404).json({
            success:false
        })
    }
})
//카드 카테고리 삭제
// router.delete('/:categoryId/card/:cardId',authenticated,async (req,res,next)=>{
//     try {
//         const card=await db.Card.findOne({
//             where:{id:req.params.cardId}});
//         if(!card){
//             return  res.status(404).json({
//                 success:false,
//                 msg:'카드가 존재하지 않습니다.'
//             })
//         }
//         await card.removeCardTypes(req.params.categoryId)
//        return  res.json({
//         success:true,
//         msg:'성공적으로 카테고리 삭제 완료하였습니다.'
//     })
//     } catch (error) {
//         console.error(error)
//       return  res.status(404).json({
//             success:false
//         })
//     }
// })
module.exports=router;