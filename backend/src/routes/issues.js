const express = require('express');

const { requireAuth } = require('../middleware/auth');
const { uploadImage } = require('../middleware/upload');
const {
  getAllIssues,
  getIssueById,
  createIssue,
  updateIssue,
  deleteIssue,
} = require('../controllers/issues');

const router = express.Router();

// Reading is public. Changing issues needs a logged-in user.
// uploadImage accepts an optional photo on create and edit. JSON requests pass straight through.
router.get('/', getAllIssues);
router.get('/:id', getIssueById);
router.post('/', requireAuth, uploadImage, createIssue);
router.put('/:id', requireAuth, uploadImage, updateIssue);
router.delete('/:id', requireAuth, deleteIssue);

module.exports = router;
