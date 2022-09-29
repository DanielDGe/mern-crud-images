import { Router } from "express";
import {
    getPost,
    createPost,
    updatePost,
    removePost,
    removeAll,
    getPosts,
} from "../controllers/posts.controllers.js";

const router = Router();

router.get("/posts", getPosts);

router.get("/posts/:id", getPost);

router.post("/posts", createPost);

router.put("/posts/:id", updatePost);

router.delete("/posts/:id", removePost);

router.delete("/posts", removeAll);

//router.get("/posts/download/:id", downloadImg);

export default router;