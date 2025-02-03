// backend/src/models/comment.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  content: mongoose.Types.ObjectId;
  content_type: 'post' | 'product' | 'page';
  author: mongoose.Types.ObjectId;
  text: string;
  parent_id?: mongoose.Types.ObjectId;
  status: 'pending' | 'approved' | 'rejected';
  upvotes: number;
  downvotes: number;
  votes: Array<{
    user: mongoose.Types.ObjectId;
    type: 'up' | 'down';
  }>;
  reports: Array<{
    user: mongoose.Types.ObjectId;
    reason: string;
    created_at: Date;
  }>;
  metadata: {
    ip: string;
    user_agent: string;
  };
  created_at: Date;
  updated_at: Date;
}

const CommentSchema = new Schema({
  content: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'content_type'
  },
  content_type: {
    type: String,
    required: true,
    enum: ['post', 'product', 'page']
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true,
    maxlength: 2000
  },
  parent_id: {
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  upvotes: {
    type: Number,
    default: 0
  },
  downvotes: {
    type: Number,
    default: 0
  },
  votes: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    type: {
      type: String,
      enum: ['up', 'down']
    }
  }],
  reports: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: String,
    created_at: {
      type: Date,
      default: Date.now
    }
  }],
  metadata: {
    ip: String,
    user_agent: String
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

// Indexes
CommentSchema.index({ content: 1, status: 1 });
CommentSchema.index({ parent_id: 1 });
CommentSchema.index({ author: 1 });
CommentSchema.index({ created_at: -1 });

export const CommentModel = mongoose.model<IComment>('Comment', CommentSchema);

