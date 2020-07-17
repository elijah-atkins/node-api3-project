const express = require("express");
const Posts = require("./postDb");

const router = express.Router();

router.get("/", (req, res) => {
  // console.log(req.query);
  Posts.get(req.query)
    .then((post) => {
      // note the "200" response... 2xx responses are "success" responses.
      res.status(200).json(post);
    })
    .catch((error) => {
      res.status(500).json({
        error: "The posts information could not be retrieved.",
      });
    });
});

router.get("/:id", validatePostId, (req, res) => {
  // do your magic!
  const { id } = req.params;
  Posts.getById(id)
    .then((post) => {
      res.status(200).json(post);
    })
    .catch((error) => {
      res.status(500).json({
        error: "The posts information could not be retrieved.",
      });
    });
});

router.delete("/:id", validatePostId, (req, res) => {
  const id = req.params.id;
  Posts.remove(id)
  .then(count => {
      res.status(200).json({ message: 'The user has been removed' });
  }).catch(err =>{
    res.status(500).json({ message: 'The user could not be found', error: err });
  }
  )
});

router.put("/:id", validatePostId, (req, res) => {
  const id = req.params.id;
  const changes = req.body;
  Posts.update(id, changes)
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

// custom middleware

function validatePostId(req, res, next) {
  const { id } = req.params;
  Post.getById(id)
    .then((post) => {
      if (post) {
        req.post = post;
        next();
      } else {
        res.status(404).json({ message: "invalid user id" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "exception", err });
    });
}

module.exports = router;
