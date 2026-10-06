import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PhotoInput from '../components/PhotoInput';
import { CATEGORIES, STATUSES } from '../constants';
import { deleteIssue, getIssue, photoUrl, updateIssue } from '../services/issues';
import { currentUser } from '../services/token';

function IssueDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = currentUser();

  const [issue, setIssue] = useState(null);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: '', status: '' });
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getIssue(id)
      .then((data) => {
        if (!cancelled) setIssue(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  // Only the owner sees Edit and Delete. The server checks ownership again on every request.
  const isOwner = Boolean(user && issue && issue.userId === user.id);

  const startEditing = () => {
    setForm({
      title: issue.title,
      description: issue.description,
      category: issue.category,
      status: issue.status,
    });
    setEditing(true);
  };

  const cancelEditing = () => {
    setPhoto(null);
    setEditing(false);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const updated = await updateIssue(id, form, photo);
      setIssue(updated);
      setPhoto(null);
      setEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this issue? This cannot be undone.')) return;
    setError('');
    try {
      await deleteIssue(id);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  if (!issue && error) {
    return (
      <section>
        <p role="alert">{error}</p>
        <Link to="/">Back to issues</Link>
      </section>
    );
  }

  if (!issue) return <p>Loading issue...</p>;

  if (editing) {
    return (
      <section>
        <h1>Edit issue</h1>
        <form onSubmit={handleSave}>
          <p>
            <label>
              Title{' '}
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </label>
          </p>
          <p>
            <label>
              Description<br />
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={5}
                required
              />
            </label>
          </p>
          <p>
            <label>
              Category{' '}
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>{' '}
            <label>
              Status{' '}
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </label>
          </p>
          <PhotoInput onChange={setPhoto} currentUrl={photoUrl(issue.imageUrl)} />
          {error && <p role="alert">{error}</p>}
          <button type="submit">Save</button>{' '}
          <button type="button" onClick={cancelEditing}>Cancel</button>
        </form>
      </section>
    );
  }

  return (
    <section>
      <h1>{issue.title}</h1>
      <p>{issue.description}</p>
      {issue.imageUrl && (
        <img className="photo" src={photoUrl(issue.imageUrl)} alt="Photo of the reported issue" />
      )}
      <p>
        Category: {issue.category} | Status: {issue.status} | Reported{' '}
        {new Date(issue.createdAt).toLocaleString()}
      </p>
      {error && <p role="alert">{error}</p>}
      {isOwner && (
        <p>
          <button type="button" onClick={startEditing}>Edit</button>{' '}
          <button type="button" onClick={handleDelete}>Delete</button>
        </p>
      )}
      <p><Link to="/">Back to issues</Link></p>
    </section>
  );
}

export default IssueDetailPage;
