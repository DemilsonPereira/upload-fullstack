import { Router } from "express";
import multer from "multer";
import multerConfig from "./config/multer.js";
import { PostController } from "./controllers/Post-controller.js";

const router = Router();

const postController = new PostController();

router.get('/posts', postController.index);
router.post('/posts', multer(multerConfig).single('file'), postController.create);
router.delete('/posts/:id', postController.delete);

export {
    router
}