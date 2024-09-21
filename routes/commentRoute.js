// routes/commentRoutes.js
const express = require('express');
const {
  addCommentController,
  getCommentsController,
  deleteCommentController
} = require('../controllers/commentController');

const router = express.Router();

router.post('/add-comment', addCommentController);
router.get('/get-comments/:blogId', getCommentsController);
router.delete('/delete-comment/:id', deleteCommentController);

module.exports = router;
