import mongoose, { Schema, Document } from 'mongoose';

export interface IUrl extends Document {
  shortId: string;
  originalUrl: string;
  clicks: number;
  createdAt: Date;
  updatedAt: Date;
  lastAccessedAt: Date | null;
  title?: string;
  tags: string[];
  isActive: boolean;
  owner?: mongoose.Types.ObjectId;
}

const urlSchema = new Schema<IUrl>(
  {
    shortId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    originalUrl: {
      type: String,
      required: true,
      validate: {
        validator: function (v: string) {
          try {
            new URL(v);
            return true;
          } catch {
            return false;
          }
        },
        message: 'originalUrl must be a valid URL',
      },
    },
    clicks: {
      type: Number,
      default: 0,
    },
    lastAccessedAt: {
      type: Date,
      default: null,
    },
    title: {
      type: String,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: undefined,
    },
  },
  {
    timestamps: true,
  }
);

export const Url = mongoose.model<IUrl>('Url', urlSchema);

