import S3, { GetObjectRequest, PutObjectRequest } from 'aws-sdk/clients/s3'
import dotenv from 'dotenv'
import { Sequelize } from 'sequelize'
import {Request, Response} from 'express';
import {v4 as uuidv4} from 'uuid';




dotenv.config({path: '../.env'});

const ID = process.env.ID
const SECRET = process.env.SECRET
const BUCKET_NAME = process.env.BUCKET_NAME
const KEY = process.env.KEY
const DATABASE_URL:string= process.env.DATABASE_URL!




interface DatabaseType {
    DATABASE_URL?:string
}

interface S3Parameters {
    Bucket: string ,
    Key: string ,
    Body: string,
}

const s3 = new S3({
    accessKeyId: ID,
    secretAccessKey: SECRET,
    params: {Bucket: BUCKET_NAME}
    
    });


  

const sequelize = new Sequelize(DATABASE_URL,{
    dialect: 'postgres', 
    dialectOptions: {
        ssl: {   
            rejectUnauthorized: false
        }
    },
  
})


interface IdbRes {
    dbRes:{
        image_uuid: string | null,
        image_s3_url: string | null
    }

}

const getAllPosts = (req:Request, res:Response):void=>{
    sequelize.query(`
    SELECT * FROM Posts 
    ORDER BY date DESC
    `)
    .then((dbRes:any[]) => 
        {
        res.status(200).send(dbRes[0])   
    })

}


const postText = (req:Request, res:Response):void =>{
    const name:string = req.body.name
    const textContent:string = req.body.text

    sequelize.query(`
    INSERT INTO Posts (name, date, text_content, type) 
    VALUES (
        '${name}',
        current_timestamp,
        '${textContent}',
        'text'
    );
    `).then(dbRes => res.status(200).send(dbRes[0]))
    

}

const postImageToS3 = (req:Request, res:Response):void =>{
    let myuuid = uuidv4();
    const imageName = req.body.imageName
    const image:string = req.body.image
    const buffer = Buffer.from(image, 'binary')
    const name = req.body.name
    const description = req.body.description

    
    const params:PutObjectRequest = {
        Bucket: BUCKET_NAME as string,
        Key: `${myuuid}.jpeg` as string,
        Body:buffer,
        ContentType: "image/jpeg",
    }
    
    s3.upload(params, function(err, data){
        console.log(err, data)
        
        sequelize.query(`
        INSERT INTO Posts (name, date, text_content, type, image_uuid, image_s3_url) 
        VALUES (
            '${name}',
            current_timestamp,
            '${description}',
            'image',
            '${myuuid}.jpg',
            '${data.Location}'
        )
        `).then(dbRes=>{
            res.status(200).send({ s3Response:data });
        }
        )
        
    }
    )

}




export {
   
    postText, 
    postImageToS3,
    getAllPosts,
 
}