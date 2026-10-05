const express = require('express');

const { requireAuth } = require('../middleware/auth');
const {
  getAllIssues,
  getIssueById,
  createIssue,
  updateIssue,
  deleteIssue,
} = require('../controllers/issues');

const router = express.Router();

// Reading is public. Changing issues needs a logged-in user.
router.get('/', getAllIssues);
router.get('/:id', getIssueById);
router.post('/', requireAuth, createIssue);
router.put('/:id', requireAuth, updateIssue);
router.delete('/:id', requireAuth, deleteIssue);

module.exports = router;
