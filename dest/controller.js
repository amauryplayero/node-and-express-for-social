"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPosts = exports.postImageToS3 = exports.postText = exports.test = void 0;
const s3_1 = __importDefault(require("aws-sdk/clients/s3"));
const dotenv_1 = __importDefault(require("dotenv"));
const sequelize_1 = require("sequelize");
dotenv_1.default.config({ path: '../.env' });
const ID = process.env.ID;
const SECRET = process.env.SECRET;
const BUCKET_NAME = process.env.BUCKET_NAME;
const KEY = process.env.KEY;
const DATABASE_URL = process.env.DATABASE_URL;
const sequelize = new sequelize_1.Sequelize(DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
});
const s3 = new s3_1.default({
    accessKeyId: ID,
    secretAccessKey: SECRET,
    params: { Bucket: BUCKET_NAME }
});
const test = () => {
};
exports.test = test;
const getAllPosts = (req, res) => {
    sequelize.query(`
    SELECT * FROM Posts 
    ORDER BY date DESC
    `).then(dbRes => { res.status(200).send(dbRes[0]); console.log(dbRes[0]); });
};
exports.getAllPosts = getAllPosts;
const postText = (req, res) => {
    const name = req.body.name;
    const textContent = req.body.text;
    console.log(name, textContent);
    sequelize.query(`
    INSERT INTO Posts (name, date, text_content) 
    VALUES (
        '${name}',
        current_timestamp,
        '${textContent}'
    );
    `).then(dbRes => res.status(200).send(dbRes[0]));
};
exports.postText = postText;
const postImageToS3 = (req, res) => {
    let parameters = {
        Bucket: BUCKET_NAME,
        Key: KEY,
    };
    console.log(req.body);
    // s3.upload(parameters, function (err:Error, data:Object){
    // })
    res.status(200).send(`${req.body.image}`);
};
exports.postImageToS3 = postImageToS3;
