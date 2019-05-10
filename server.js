const express = require('express')
const PostsRouter = require('./posts-router.js')
const server = express()

server.use(express.json())
server.use('/api/posts', PostsRouter)

server.get('/', (req, res) => {
    res.send(
        `<h3>Welcome to my app API</h3>
        <p>We hope you enjoy your experience!</p>
         `
    )
})

module.exports = server