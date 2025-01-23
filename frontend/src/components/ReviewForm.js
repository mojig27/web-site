import { useState } from 'react';
import axios from 'axios';
import { notifySuccess, notifyError } from '../components/Notifications';

export default function ReviewForm({ productId, onReviewAdded }) {
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/reviews', { product: productId, rating, comment });
      notifySuccess('Review added successfully');
      onReviewAdded(response.data);
    } catch (error) {
      notifyError(error.response.data.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add a Review</h2>
      <label>
        Rating:
        <select value={rating} onChange={(e) => setRating(e.target.value)}>
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </label>
      <label>
        Comment:
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}