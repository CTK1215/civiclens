import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PhotoInput from '../components/PhotoInput';
import { CATEGORIES } from '../constants';
import { createIssue } from '../services/issues';

function CreateIssuePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', category: CATEGORIES[0] });
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const update = (field) => (event) => setForm({ ...form, [field]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const issue = await createIssue(form, photo);
      navigate(`/issues/${issue.id}`);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <section>
      <h1>Report an issue</h1>
      <form onSubmit={handleSubmit}>
        <p>
          <label>
            Title{' '}
            <input value={form.title} onChange={update('title')} required />
          </label>
        </p>
        <p>
          <label>
            Description<br />
            <textarea value={form.description} onChange={update('description')} rows={5} required />
          </label>
        </p>
        <p>
          <label>
            Category{' '}
            <select value={form.category} onChange={update('category')}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
        </p>
        <PhotoInput onChange={setPhoto} />
        {error && <p role="alert">{error}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit issue'}
        </button>
      </form>
    </section>
  );
}

export default CreateIssuePage;
