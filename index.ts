
import express, { Express, Request, Response} from 'express';
import dotenv from 'dotenv'
import path from 'path'
import {test, postText, postImageToS3, getAllPosts} from './controller'
import cors from 'cors'

dotenv.config({ path: '../.env' });

const app: Express = express();
const PORT = 8000;

app.use(cors())
app.use(express.json({limit: '25mb'}))
app.use(express.static(path.resolve(__dirname, '../build')))



app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
  });

app.post('/postText', postText)
app.post('/postImageToS3', postImageToS3)
app.get('/getAllPosts', getAllPosts)

  app.listen(PORT, () => {
    console.log(`Server is running at https://localhost:${PORT}`);
  });