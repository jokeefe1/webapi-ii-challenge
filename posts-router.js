const express = require('express');
const db = require('./data/db.js');
const router = express.Router();

// | POST   | /api/posts     | Creates a post using the information sent inside the `request body`.
router.post('/', async (req, res) => {
    const { title, contents } = req.body;
    try {
        if (title && contents) {
            const newPost = await db.insert({ title, contents });
            res.status(201).json(newPost);
        } else {
            res.status(400).json({
                errorMessage: 'Please provide title and contents for the post.'
            });
        }
    } catch (error) {
        res.status(500).json({
            error: 'There was an error while saving the post to the database'
        });
    }
});

// | GET    | /api/posts     | Returns an array of all the post objects contained in the database.
router.get('/', async (req, res) => {
    try {
        const posts = await db.find();
        res.json(posts);
    } catch (error) {
        res.status(500).json({
            error: 'The posts information could not be retrieved.'
        });
    }
});

// | GET    | /api/posts/:id | Returns the post object with the specified id.
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const post = await db.findById(id);
        if (post.length) {
            res.json(post);
        } else {
            res.status(404).json({
                message: 'The post with the specified ID does not exist.'
            });
        }
    } catch (error) {
        res.status(500).json({
            error: 'The post information could not be retrieved.'
        });
    }
});

// | DELETE | /api/posts/:id | Removes the post with the specified id and returns the **deleted post object**. You may need to make additional calls to the database in order to satisfy this requirement. |
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletePost = await db.remove(id);
        if (deletePost) {
            res.json(deletePost);
        } else {
            res.status(404).json({
                message: 'The post with the specified ID does not exist.'
            });
        }
    } catch (error) {
        res.status(500).json({ error: 'The post could not be removed' });
    }
});

// | PUT    | /api/posts/:id | Updates the post with the specified `id` using data from the `request body`. Returns the modified document, **NOT the original**.
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, contents } = req.body;
    const update = { title, contents };
    try {
        const updatedPost = await db.update(id, update);
        if (!title || !contents) {
            res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
        }
        if (update) {
            res.json(updatedPost)
        }
        else {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        }
    } catch (error) {
        res.status(500).json({
            error: 'The post information could not be modified.'
        });
    }
});

module.exports = router;
