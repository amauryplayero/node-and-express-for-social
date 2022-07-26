"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const controller_1 = require("./controller");
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config({ path: '../.env' });
const app = (0, express_1.default)();
const PORT = 8001;
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '25mb' }));
// app.use(express.static(path.resolve(__dirname, '../build')))
app.get('/', (req, res) => {
    res.send('Express + TypeScript Server');
});
app.post('/postText', controller_1.postText);
app.post('/postImageToS3', controller_1.postImageToS3);
app.get('/getAllPosts', controller_1.getAllPosts);
app.listen(PORT, () => {
    console.log(`Server is running at https://localhost:${PORT}`);
});
