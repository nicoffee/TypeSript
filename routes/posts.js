const express = require('express');
const Post = require('../models/post');

const router = express.Router();

router.get('/', function(req, res) {
  Post.find({}, function(err, posts) {
    res.send(posts);
  })
    .limit(Number(req.query.limit))
    .skip(Number(req.query.offset));
});

router.get('/:id', function(req, res) {
  Post.findById(req.params.id, function(err, postDetails) {
    res.send(postDetails);
  });
});

router.post('/', function(req, res, next) {
  Post.create(req.body, function(err, post) {
    if (err) {
      res.send(422, err);
      next(err);
    } else {
      res.send({id: post.id});
    }
  });
});

module.exports = router;
