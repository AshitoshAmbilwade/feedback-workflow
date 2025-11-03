import mongoose, { Schema } from 'mongoose';

export interface IUser extends mongoose.Document {
  email: string;
  name: string;
  role: 'hr' | 'client';
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['hr', 'client'],
      required: true,
    },
    password: {
      type: String,
      required: function (this: IUser): boolean {
        return this.role === 'hr'; // ✅ TypeScript now knows it returns boolean
      },
      select: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>('User', userSchema);
