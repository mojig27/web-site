
// backend/src/models/category.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  type: string;
  parent?: Schema.Types.ObjectId;
  order: number;
  meta: {
    title?: string;
    description?: string;
    keywords?: string;
  };
  created_at: Date;
  updated_at: Date;
}

const CategorySchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    description: String,
    type: { type: String, required: true },
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'Category'
    },
    order: { type: Number, default: 0 },
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

// ایجاد slug از نام
CategorySchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  next();
});

export const CategoryModel = mongoose.model<ICategory>('Category', CategorySchema);