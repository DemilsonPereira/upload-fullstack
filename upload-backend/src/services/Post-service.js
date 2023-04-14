import Post from "../models/Post.js";


class PostService {

    index() {
        const listarPosts = Post.find();

        return listarPosts;
    }

    create({ name, size, key, url }) {
        const criarPost = Post.create({
            name,
            size,
            key,
            url
        })
        return criarPost;
    }

    async delete({ id }) {
        const deletarPost = Post.findById(id);
        await deletarPost.deleteOne();
    }
}

export {
    PostService
}