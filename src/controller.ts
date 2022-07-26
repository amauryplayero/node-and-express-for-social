import S3 from 'aws-sdk/clients/s3'
import dotenv from 'dotenv'
import { Sequelize } from 'sequelize'
import {Request, Response} from 'express';

dotenv.config({ });

interface DatabaseType {
    DATABASE_URL?:string
}

console.log(process.env)

const ID = process.env.ID
const SECRET = process.env.SECRET
const BUCKET_NAME = process.env.BUCKET_NAME
const KEY = process.env.KEY
const DATABASE_URL:string= process.env.DATABASE_URL!


const sequelize = new Sequelize(DATABASE_URL,{
    dialect: 'postgres', 
    dialectOptions: {
        ssl: {   
            rejectUnauthorized: false
        }
    }
})

interface S3Parameters {
    Bucket?: string ,
    Key?: string ,
    Body?: string,
}

const s3 = new S3({
    accessKeyId: ID,
    secretAccessKey: SECRET,
    params: {Bucket: BUCKET_NAME}
    
    });


const test = ():void =>{
    
    
}

const getAllPosts = (req:Request, res:Response):void =>{
    sequelize.query(`
    SELECT * FROM Posts 
    `).then(dbRes => {res.status(200).send(dbRes[0]);console.log(dbRes[0])})
}

const postText = (req:Request, res:Response):void =>{
    const name:string = req.body.name
    const textContent:string = req.body.text
    console.log(name,textContent)
    sequelize.query(`
    INSERT INTO Posts (name, date, text_content) 
    VALUES (
        '${name}',
        current_timestamp,
        '${textContent}'
    );
    `).then(dbRes => res.status(200).send(dbRes[0]))
    

}

const postImageToS3 = (req:Request, res:Response):void =>{
    let parameters = {
        Bucket: BUCKET_NAME,
        Key: KEY,
    }
    console.log(req.body)
    // s3.upload(parameters, function (err:Error, data:Object){

    // })
    res.status(200).send(`${req.body.image}`)

}



export {
    test,
    postText, 
    postImageToS3,
    getAllPosts

}