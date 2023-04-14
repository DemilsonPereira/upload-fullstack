import { response } from "express";
import { PostService } from "../services/Post-service.js";

class PostController {

    async index(request, response) {
        const postService = new PostService();
        const listarPosts = await postService.index();
        return response.json(listarPosts);
    }

    async create(request, response) {
        const { originalname: name, size, key, location: url = '' } = request.file;

        const postService = new PostService();
        const criarPost = await postService.create({ name, size, key, url });
        return response.json(criarPost);
    }

    async delete(request, response) {
        const { id } = request.params;
        const postService = new PostService();
        const deletarPost = await postService.delete({ id });
        return response.send();

    }
}

export {
    PostController
}