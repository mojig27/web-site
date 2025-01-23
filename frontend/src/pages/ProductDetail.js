import { useState, useEffect } from 'react';
import axios from 'axios';
import ReviewForm from '../components/ReviewForm';

export default function ProductDetail({ productId }) {
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      const response = await axios.get(`/api/products/${productId}`);
      setProduct(response.data);
    };

    const fetchReviews = async () => {
      const response = await axios.get(`/api/reviews/${productId}`);
      setReviews(response.data);
    };

    fetchProduct();
    fetchReviews();
  }, [productId]);

  const handleReviewAdded = (newReview) => {
    setReviews([...reviews, newReview]);
  };

  return (
    <div>
      {product && (
        <>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <ReviewForm productId={productId} onReviewAdded={handleReviewAdded} />
          <ul>
            {reviews.map((review) => (
              <li key={review._id}>{review.comment} - {review.rating} stars</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}