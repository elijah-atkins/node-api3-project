const express = require('express');
const Users = require('./userDb')
const Posts = require('../posts/postDb')

const router = express.Router();

router.post('/', validateUser, (req, res) => {
  Users.insert(req.body)
  .then((post) => {
    res.status(201).json(post);
  })
  .catch((error) => {
    res.status(500).json({
      error: "There was an error while saving the post to the database",
    });
  });
});



router.get('/', (req, res) => {
      // console.log(req.query);
      Users.get(req.query)
      .then((user) => {
        // note the "200" response... 2xx responses are "success" responses.
        res.status(200).json(user);
      })
      .catch((error) => {
        res.status(500).json({
          error: "The posts information could not be retrieved.",
        });
      });
});

router.get('/:id', validateUserId, (req, res) => {
  // do your magic!
  const id = req.params.id;
  Users.getById(id)
  .then((user) => {
    // note the "200" response... 2xx responses are "success" responses.
    res.status(200).json(user);
  })
  .catch((error) => {
    res.status(500).json({
      error: "The User information could not be retrieved.",
    });
  });

});

router.post('/:id/posts', validateUserId, validatePost, async (req, res) => {
  const id = req.params.id;
  const postInfo = { ...req.body, user_id: id };
  try {
    const thisComment = await Posts.insert(postInfo);
    res.status(201).json(postInfo);
} catch (err) {
    console.log(err);
    res.status(500).json({ err });
}
  
});

router.get('/:id/posts', validateUserId, (req, res) => {
  const id = req.params.id;
  Users.getUserPosts(id)
  .then((user) => {
    // note the "200" response... 2xx responses are "success" responses.
    res.status(200).json(user);
  }) 
  .catch((error) => {
    res.status(500).json({
      error: "The User information could not be retrieved.",
      message: error,
    });
  });
  
});

router.delete('/:id', validateUserId, (req, res) => {
  const id = req.params.id;
  Users.remove(id)
  .then(count => {
      res.status(200).json({ message: 'The user has been removed' });
  }).catch(err =>{
    res.status(500).json({ message: 'The user could not be found', error: err });
  }
  )
  
  // do your magic!
});

router.put('/:id', validateUserId, (req, res) => {
  const id = req.params.id;
  const changes = req.body;
  Users.update(id, changes)
  .then((post) => {
    if (post) {
        res.status(200).json(changes);
    } else {
      res
        .status(500)
        .json({
          message: "The post could not be saved to the database",
        });
    }
  }
  )
  // do your magic!
});

//custom middleware

function validateUserId(req, res, next) {
  const { id } = req.params;
  Users.getById(id)
    .then(user => {
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(404).json({ message: 'invalid user id' });

      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'exception', err });
    });
}

function validateUser(req, res, next) {
    const body = req.body;
    const { name } = req.body;
    if (!body || Object.entries(body).length === 0) {
      res.status(400).json({ message: "missing user data" })
    }
    if(!name || name === []){
      res.status(400).json({ message: "missing required name field" })
    }
      next();
}

function validatePost(req, res, next) {
  if(!req.body){
    res.status(400).json({
      message: "missing post data",
    });
  } else {
    const { text } = req.body
    if(!text){
      res.status(400).json({
        message: "missing required text field",
      });
    }
  }

  next();
}

module.exports = router;
