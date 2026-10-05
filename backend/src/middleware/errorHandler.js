// One function per status code, each returns the response so a controller can
// write `return badRequest(res, '...')` and stop there. Same shape as the week-7
// countries API, using this project's { error: ... } body.

function badRequest(res, message, extra = {}) {
  return res.status(400).json({ error: message, ...extra });
}

function notFound(res, message) {
  return res.status(404).json({ error: message });
}

// Express sends anything a route throws, or passes to next(err), here.
// The four arguments are what make Express treat it as an error handler,
// so `next` stays in the list even though it is not used.
function handleError(err, req, res, next) {
  // express.json() rejects a malformed body with this, before any route runs
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  console.error(err);
  res.status(500).json({ error: 'Something went wrong' });
}

module.exports = { badRequest, notFound, handleError };
