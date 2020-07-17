const express = require('express');

const postRouter = require('./posts/postRouter')
const userRouter = require('./users/userRouter')

const server = express();
server.use(express.json());
server.use(logger)

server.use('/api/posts', postRouter)
server.use('/api/users', userRouter)

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function notFound(req, res) {
  res.status(404).send(`<h2>${req.url}? Ain't nobody got time for dat! </h2>`)
}

function logger(req, res, next) {
  console.log(`Request Method: ${req.method}`);
  console.log(`URL: ${req.url}`);
  console.log(`Timestamp: ${new Date()}`);
  next();
}


server.use(notFound)

module.exports = server;
