const Issue = require('../models/Issue');
const { badRequest, notFound, forbidden } = require('../middleware/errorHandler');
const { imageUrlFor, removeImage } = require('../middleware/upload');

// Postgres integer ids top out here. Anything bigger would error instead of 404ing.
const MAX_ID = 2147483647;

// A required text field has to be a string with something other than spaces in it.
const hasText = (value) => typeof value === 'string' && value.trim() !== '';

// The id arrives as text in the URL. Only a whole number in range can match a row,
// so anything else resolves to null (a 404) without touching the database.
const findIssue = async (id) => {
  if (!/^\d+$/.test(id) || Number(id) > MAX_ID) return null;
  return Issue.findByPk(id);
};

// GET /issues
// 200 with every issue. Optional filters: ?category=pothole&status=open
const getAllIssues = async (req, res) => {
  const { category, status } = req.query;
  const where = {};

  if (category) where.category = category;
  if (status) where.status = status;

  const issues = await Issue.findAll({ where });
  res.status(200).json(issues);
};

// GET /issues/:id
// 200 with the issue, 404 if no issue has that id
const getIssueById = async (req, res) => {
  const issue = await findIssue(req.params.id);

  if (!issue) {
    return notFound(res, `No issue with id ${req.params.id}`);
  }

  res.status(200).json(issue);
};

// POST /issues
// Needs a logged-in user (requireAuth in the route). title and description are required (400 if missing).
// The model sets id, status (default "open"), votes (default 0) and createdAt. userId is the logged-in user.
// An optional photo arrives as the "image" field (uploadImage in the route). 201 with the new issue.
const createIssue = async (req, res) => {
  const { title, description, category } = req.body || {};

  if (!hasText(title) || !hasText(description)) {
    return badRequest(res, 'title and description are required');
  }

  const issue = await Issue.create({
    title: title.trim(),
    description: description.trim(),
    category: hasText(category) ? category.trim() : 'other',
    userId: req.user.id,
    imageUrl: req.file ? imageUrlFor(req.file) : null,
  });

  res.status(201).json(issue);
};

// PUT /issues/:id
// 404 if not found, 403 if the issue belongs to someone else, 400 if title or description is missing,
// 200 with the updated issue. A new photo replaces the old one, and the old file is removed.
const updateIssue = async (req, res) => {
  const issue = await findIssue(req.params.id);

  if (!issue) {
    return notFound(res, `No issue with id ${req.params.id}`);
  }

  if (issue.userId !== req.user.id) {
    return forbidden(res, 'You can only change your own issues');
  }

  const { title, description, category, status } = req.body || {};

  if (!hasText(title) || !hasText(description)) {
    return badRequest(res, 'title and description are required');
  }

  const previousImage = issue.imageUrl;

  await issue.update({
    title: title.trim(),
    description: description.trim(),
    category: hasText(category) ? category.trim() : issue.category,
    status: hasText(status) ? status.trim() : issue.status,
    imageUrl: req.file ? imageUrlFor(req.file) : issue.imageUrl,
  });

  // Remove the old photo only after the new one is saved on the issue
  if (req.file && previousImage) {
    await removeImage(previousImage);
  }

  res.status(200).json(issue);
};

// DELETE /issues/:id
// 404 if not found, 403 if the issue belongs to someone else, 204 with no body once removed
const deleteIssue = async (req, res) => {
  const issue = await findIssue(req.params.id);

  if (!issue) {
    return notFound(res, `No issue with id ${req.params.id}`);
  }

  if (issue.userId !== req.user.id) {
    return forbidden(res, 'You can only delete your own issues');
  }

  const photo = issue.imageUrl;
  await issue.destroy();
  await removeImage(photo);

  res.status(204).end();
};

module.exports = {
  getAllIssues,
  getIssueById,
  createIssue,
  updateIssue,
  deleteIssue,
};
