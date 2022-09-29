import { deleteImage, getImageAttachment, uploadImage } from "../libs/cloudinary.js";
import Post from "../models/Post.js";
import fs from "fs-extra";

export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find({});
        return res.json(posts);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const createPost = async (req, res) => {

    try {

        //test with rc-uploader
        /* console.log(req);
        console.log(req.body);
        console.log("name:" + req.files.file.name);

        return res.json({message: "Success"}); */

        const { title, description } = req.body;
        let image = null;

        if (req.files?.image) { //Si req.file existe y image existe.
            
            let textname = (req.files.image.name).toString();
            let txt = textname.substring(0, textname.lastIndexOf("."));

            const result = await uploadImage(req.files.image.tempFilePath);
            const urlImg = await getImageAttachment(result.public_id, txt);

            await fs.remove(req.files.image.tempFilePath);

            image = {
                url: result.secure_url,
                public_id: result.public_id,
                format: result.format,
                original_name: req.files.image.name,
                download_url: urlImg,
            };

        }

        const newPost = new Post({ title, description, image });
        await newPost.save();
        return res.json(newPost);

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

};

export const getPost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);
        if (!post) return res.sendStatus(404);
        return res.json(post);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const updatePost = async (req, res) => {

    try {

        const { id } = req.params;
        // TODO: validate req.body before to update

        // if a new image is uploaded upload it to cloudinary
        if (req.files?.image) {

            let textname = (req.files.image.name).toString();
            let txt = textname.substring(0, textname.lastIndexOf("."));

            //Delete file in cloudinary to update.
            const post = await Post.findById(id);
            if (post && post.image.public_id) {
                await deleteImage(post.image.public_id);
            }

            const result = await uploadImage(req.files.image.tempFilePath);
            const urlImg = await getImageAttachment(result.public_id, txt);
                        
            // add the new image to the req.body
            req.body.image = {
                url: result.secure_url,
                public_id: result.public_id,
                original_name: req.files.image.name,
                format: result.format,
                download_url: urlImg,
            };

            await fs.remove(req.files.image.tempFilePath);

        }

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { $set: req.body },
            {
                new: true, //Showing new data to update, return new object
            }
        );
        return res.json(updatedPost);

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const removePost = async (req, res) => {

    try {
        const { id } = req.params;
        const post = await Post.findByIdAndDelete(id);

        if (post && post.image.public_id) {
            await deleteImage(post.image.public_id);
        }

        if (!post) return res.sendStatus(404);
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

};


export const removeAll = async (req, res) => {

    try {

        const removed = await Post.deleteMany();

        if (!removed) return res.sendStatus(404);
        res.sendStatus(204);

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

}


//Testing a code
export const downloadImg = async (req, res) => {

    /* try {

        const { id } = req.params;
        const post = await Post.findById(id);

        if (post && post.image.public_id) {
            const result = await getImageAttachment(post.image.public_id);
            console.log(result);
            return res.json(result);
        }

        if (!post) return res.sendStatus(404);


        // Other to download images from external link.

        let imgName = post.image.original_name;
        let imgFormat = post.image.format;

        const resp = await axios.get(post.image.url, {
            responseType: "stream",
        })

        fs.mkdirSync(dir);

        resp.data.pipe(fs.createWriteStream("tmp/" + imgName + "." + imgFormat))

        const file = "tmp/" + imgName + "." + imgFormat;

        res.setHeader('Content-disposition', 'attachment; filename=' + imgName + "." + imgFormat);

        //return res.download(file); // Set disposition and send it.

        return res.sendStatus(204);
        

    } catch (error) {
        return res.status(500).json({ message: error.message });
    } */

}