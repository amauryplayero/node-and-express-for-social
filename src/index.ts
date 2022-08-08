
import express, { Express, Request, Response} from 'express';
import dotenv from 'dotenv'
import {postText, postImageToS3, getAllPosts} from './controller'
import cors from 'cors'
import multerS3 = require('multer-s3');

dotenv.config({ path: '../.env' });

const app: Express = express();
const PORT = 8001;

app.use(cors())
app.use(express.json({limit: '25mb'}))

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
  });

app.post('/postText', postText)
app.post('/postImageToS3', postImageToS3)
app.get('/getAllPosts', getAllPosts)


  app.listen(PORT, () => {
    console.log(`Server is running at https://localhost:${PORT}`);
  });