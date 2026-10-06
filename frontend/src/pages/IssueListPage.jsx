import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CATEGORIES, STATUSES } from '../constants';
import { listIssues, photoUrl } from '../services/issues';

function IssueListPage() {
  // Filters live in the URL, so a filtered view can be bookmarked or shared
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || '';
  const status = searchParams.get('status') || '';

  const [issues, setIssues] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    listIssues({ category, status })
      .then((data) => {
        if (!cancelled) {
          setIssues(data);
          setError('');
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [category, status]);

  const changeFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  return (
    <section>
      <h1>Community issues</h1>

      <p>
        <label>
          Category{' '}
          <select value={category} onChange={(e) => changeFilter('category', e.target.value)}>
            <option value="">All</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>{' '}
        <label>
          Status{' '}
          <select value={status} onChange={(e) => changeFilter('status', e.target.value)}>
            <option value="">All</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
      </p>

      {loading && <p>Loading issues...</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && issues.length === 0 && <p>No issues match these filters yet.</p>}

      <ul>
        {issues.map((issue) => (
          <li key={issue.id}>
            {issue.imageUrl && <img className="thumb" src={photoUrl(issue.imageUrl)} alt="" />}
            <Link to={`/issues/${issue.id}`}>{issue.title}</Link>{' '}
            ({issue.category}, {issue.status})
          </li>
        ))}
      </ul>
    </section>
  );
}

export default IssueListPage;
