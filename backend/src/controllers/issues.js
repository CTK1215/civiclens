const { badRequest, notFound } = require('../middleware/errorHandler');

// Phase 1: issues live in memory and reset every time the server restarts.
// Phase 2 replaces this array with the Sequelize Issue model.
// Shape: { id, title, description, category, status, createdAt }
const issues = [];
let nextId = 1;

// Where an issue sits in the array, or -1. The id arrives as text in the URL, so it is
// converted before comparing; anything that is not a number simply will not match.
const findIndexById = (id) => issues.findIndex((issue) => issue.id === Number(id));

// A required text field has to be a string with something other than spaces in it.
const hasText = (value) => typeof value === 'string' && value.trim() !== '';

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
const getIssueById = (req, res) => {
  const index = findIndexById(req.params.id);

  if (index === -1) {
    return notFound(res, `No issue with id ${req.params.id}`);
  }

  res.status(200).json(issues[index]);
};

// POST /issues
// title and description are required (400 if missing).
// Set id, status (default "open") and createdAt on the server, then 201 with the new issue.
const createIssue = (req, res) => {
  const { title, description, category } = req.body || {};

  if (!hasText(title) || !hasText(description)) {
    return badRequest(res, 'title and description are required');
  }

  const issue = {
    id: nextId++,
    title: title.trim(),
    description: description.trim(),
    category: hasText(category) ? category.trim() : 'other',
    status: 'open',
    createdAt: new Date().toISOString(),
  };

  issues.push(issue);
  res.status(201).json(issue);
};

// PUT /issues/:id
// 404 if not found, 400 if title or description is missing, 200 with the updated issue
const updateIssue = (req, res) => {
  const index = findIndexById(req.params.id);

  if (index === -1) {
    return notFound(res, `No issue with id ${req.params.id}`);
  }

  const { title, description, category, status } = req.body || {};

  if (!hasText(title) || !hasText(description)) {
    return badRequest(res, 'title and description are required');
  }

  const existing = issues[index];
  const updated = {
    ...existing,
    title: title.trim(),
    description: description.trim(),
    category: hasText(category) ? category.trim() : existing.category,
    status: hasText(status) ? status.trim() : existing.status,
  };

  issues[index] = updated;
  res.status(200).json(updated);
};

// DELETE /issues/:id
// 404 if not found, 204 with no body once removed
const deleteIssue = (req, res) => {
  const index = findIndexById(req.params.id);

  if (index === -1) {
    return notFound(res, `No issue with id ${req.params.id}`);
  }

  issues.splice(index, 1);
  res.status(204).end();
};

module.exports = {
  getAllIssues,
  getIssueById,
  createIssue,
  updateIssue,
  deleteIssue,
};
