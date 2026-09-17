// Phase 1: issues live in memory and reset every time the server restarts.
// Phase 2 replaces this array with the Sequelize Issue model.
// Shape: { id, title, description, category, status, createdAt }
const issues = [];
let nextId = 1;

const notImplemented = (res) => res.status(501).json({ error: 'Not implemented yet' });

// GET /issues
// 200 with every issue. Optional filters: ?category=pothole&status=open
const getAllIssues = (req, res) => {
  const { category, status } = req.query;

  let results = issues;

  if (category) {
    results = results.filter((issue) => issue.category === category);
  }

  if (status) {
    results = results.filter((issue) => issue.status === status);
  }

  res.status(200).json(results);
};

// GET /issues/:id
// 200 with the issue, 404 if no issue has that id
const getIssueById = (req, res) => notImplemented(res);

// POST /issues
// title and description are required (400 if missing).
// Set id, status (default "open") and createdAt on the server, then 201 with the new issue.
const createIssue = (req, res) => notImplemented(res);

// PUT /issues/:id
// 404 if not found, 400 if title or description is missing, 200 with the updated issue
const updateIssue = (req, res) => notImplemented(res);

// DELETE /issues/:id
// 404 if not found, 204 with no body once removed
const deleteIssue = (req, res) => notImplemented(res);

module.exports = {
  getAllIssues,
  getIssueById,
  createIssue,
  updateIssue,
  deleteIssue,
};
