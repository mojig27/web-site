// backend/src/models/Review.ts
import { Schema, model, Document } from 'mongoose';

export interface IReview extends Document {
  user: Schema.Types.ObjectId;
  product: Schema.Types.ObjectId;
  order: Schema.Types.ObjectId;
  rating: number;
  comment: string;
  advantages?: string[];
  disadvantages?: string[];
  images?: string[];
  status: 'pending' | 'approved' | 'rejected';
  likes: number;
  buyerVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  order: {
    type: Schema.Types.ObjectId,
    ref: 'Order'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 1000
  },
  advantages: [String],
  disadvantages: [String],
  images: [String],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  likes: {
    type: Number,
    default: 0
  },
  buyerVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// ایندکس‌ها برای بهبود کارایی
reviewSchema.index({ product: 1, status: 1 });
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

// محاسبه میانگین امتیازات محصول
reviewSchema.statics.calculateAverageRating = async function(productId) {
  const result = await this.aggregate([
    { $match: { product: productId, status: 'approved' } },
    {
      $group: {
        _id: '$product',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  if (result.length > 0) {
    await model('Product').findByIdAndUpdate(productId, {
      'ratings.average': result[0].averageRating,
      'ratings.count': result[0].totalReviews
    });
  }
};

reviewSchema.post('save', function() {
  // @ts-ignore
  this.constructor.calculateAverageRating(this.product);
});

export const Review = model<IReview>('Review', reviewSchema);