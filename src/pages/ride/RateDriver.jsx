import React from 'react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../lib/api.js';
import { useAsync } from '../../lib/useAsync.js';
import Spinner from '../../components/Spinner.jsx';
import { StarIcon } from '../../components/icons.jsx';

export default function RateDriver() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: ride, loading } = useAsync(() => api.get(`/api/rides/${id}`), [id]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function submit() {
    setSubmitting(true);
    setError('');
    try {
      await api.post(`/api/rides/${id}/rate`, { rating, comment: comment.trim() || undefined });
      navigate(`/ride/${id}/receipt`);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  if (loading || !ride) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col px-6 pb-8 pt-12">
      <div className="flex flex-1 flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-light text-xl font-semibold text-ink">
          {ride.driver?.name?.charAt(0) || '?'}
        </div>
        <h2 className="mt-4 text-xl font-bold text-ink">Rate {ride.driver?.name}</h2>
        <p className="mt-1 text-sm text-ink-faint">How was your trip?</p>

        <div className="mt-6 flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" onClick={() => setRating(n)} aria-label={`${n} star${n > 1 ? 's' : ''}`}>
              <StarIcon filled={n <= rating} width={36} height={36} />
            </button>
          ))}
        </div>

        <textarea
          id="rating-comment"
          className="input-field mt-6 min-h-24 resize-none"
          placeholder="Leave a comment (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        {error && <p className="mt-2 text-sm text-danger">{error}</p>}
      </div>

      <button type="button" className="btn-primary" onClick={submit} disabled={submitting}>
        {submitting ? <Spinner className="border-ink/30 border-t-ink" /> : 'Submit Rating'}
      </button>
      <button type="button" className="mt-3 text-sm font-medium text-ink-faint" onClick={() => navigate(`/ride/${id}/receipt`)}>
        Skip
      </button>
    </div>
  );
}
