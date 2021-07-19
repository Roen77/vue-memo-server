const express = require('express');
const cors = require('cors');
const morgan=require('morgan');
const {sequelize} = require('./models');
const logger =require('./logger');
const prod = process.env.NODE_ENV === 'production';
const helmet = require('helmet');
const hpp = require('hpp');
const PORT=3085
// router
const userRouter=require('./router/user');
const boardRouter=require('./router/board');
const cardRouter=require('./router/card');
const categoryRouter=require('./router/category');


const app=express()

// db 연결
sequelize.sync()
.then(()=>{
    console.log('db 연결 성공')
})
.catch(err=>{
    console.error(err)
    logger.Error(err);
});

app.use(cors())
if(prod){
    app.use(helmet());
    app.use(hpp());
    app.use(morgan('combined'))
}else{
    app.use(morgan('dev'))
}

app.use(express.json())
app.use(express.urlencoded({extended:false}))


// router
app.use('/user',userRouter);
app.use('/boards',boardRouter);
app.use('/cards',cardRouter);
app.use('/categorys', categoryRouter);

app.listen(prod ? process.env.PORT : PORT,()=>{
    console.log(`${prod ? process.env.PORT : PORT}번에서 실행중`)
    logger.info('Server started and running');
})