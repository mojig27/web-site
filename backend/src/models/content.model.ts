// backend/src/models/content.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IContent extends Document {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  type: string;
  status: string;
  author: Schema.Types.ObjectId;
  category?: Schema.Types.ObjectId;
  tags: string[];
  thumbnail?: string;
  meta: {
    title?: string;
    description?: string;
    keywords?: string;
  };
  created_at: Date;
  updated_at: Date;
}

const ContentSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    excerpt: String,
    type: { type: String, required: true },
    status: {
      type: String,
      enum: ['draft', 'published', 'pending'],
      default: 'draft'
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category'
    },
    tags: [String],
    thumbnail: String,
    meta: {
      title: String,
      description: String,
      keywords: String
    }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

// ایجاد slug از عنوان
ContentSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  next();
});

export const ContentModel = mongoose.model<IContent>('Content', ContentSchema);