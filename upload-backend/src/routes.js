import { Router } from "express";
import multer from "multer";
import multerConfig from "./config/multer.js";
import Post from "./models/Post.js";

const router = Router();


router.post('/posts', multer(multerConfig).single('file'), async (request, response) => {
    const { originalname: name, size, filename: key } = request.file;

    const post = await Post.create({
        name,
        size,
        key,
        url: ''
    })
    return response.json(post);
});

export {
    router
}