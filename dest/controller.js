"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPosts = exports.postImageToS3 = exports.postText = void 0;
const s3_1 = __importDefault(require("aws-sdk/clients/s3"));
const dotenv_1 = __importDefault(require("dotenv"));
const sequelize_1 = require("sequelize");
const uuid_1 = require("uuid");
dotenv_1.default.config({ path: '../.env' });
const ID = process.env.ID;
const SECRET = process.env.SECRET;
const BUCKET_NAME = process.env.BUCKET_NAME;
const KEY = process.env.KEY;
const DATABASE_URL = process.env.DATABASE_URL;
const s3 = new s3_1.default({
    accessKeyId: ID,
    secretAccessKey: SECRET,
    params: { Bucket: BUCKET_NAME }
});
const sequelize = new sequelize_1.Sequelize(DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    },
});
const getAllPosts = (req, res) => {
    sequelize.query(`
    SELECT * FROM Posts 
    ORDER BY date DESC
    `)
        .then((dbRes) => {
        res.status(200).send(dbRes[0]);
    });
};
exports.getAllPosts = getAllPosts;
const postText = (req, res) => {
    const name = req.body.name;
    const textContent = req.body.text;
    sequelize.query(`
    INSERT INTO Posts (name, date, text_content, type) 
    VALUES (
        '${name}',
        current_timestamp,
        '${textContent}',
        'text'
    );
    `).then(dbRes => res.status(200).send(dbRes[0]));
};
exports.postText = postText;
const postImageToS3 = (req, res) => {
    let myuuid = (0, uuid_1.v4)();
    const imageName = req.body.imageName;
    const image = req.body.image;
    const buffer = Buffer.from(image, 'binary');
    const name = req.body.name;
    const description = req.body.description;
    const params = {
        Bucket: BUCKET_NAME,
        Key: `${myuuid}.jpeg`,
        Body: buffer,
        ContentType: "image/jpeg",
    };
    s3.upload(params, function (err, data) {
        console.log(err, data);
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
        `).then(dbRes => {
            res.status(200).send({ s3Response: data });
        });
    });
};
exports.postImageToS3 = postImageToS3;
