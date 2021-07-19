const aws= require('aws-sdk');
const multer=require('multer');
const multer3=require('multer-s3');
require("dotenv").config();

aws.config.update({
    secretAccessKey:process.env.AWSSECRETKEY,
    accessKeyId:process.env.AWSACCESSKEYID,
    region:'ap-northeast-2'
})
let s3= new aws.S3();

exports.upload=multer({
    storage:multer3({
        s3:s3,
        bucket:"aws-memoapp",
        acl:'public-read',
        metadata:function(req,file,cb){
            cb(null,{fieldName:file.fieldname})
        },
        key:function(req,file,cb){
            cb(null,Date.now().toString())
        }
    })
})

