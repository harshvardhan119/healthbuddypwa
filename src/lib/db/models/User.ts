import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  profile: {
    age: number;
    gender: string;
    height: number;
    weight: number;
    targetWeight: number;
    targetTimeline: number;
    activityLevel: string;
    dietPreference: string;
    allergies: string[];
    sleepHours: number;
  };
  currentPlan?: any;
  history: any[];
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  profile: {
    age: Number,
    gender: String,
    height: Number,
    weight: Number,
    targetWeight: Number,
    targetTimeline: Number,
    activityLevel: String,
    dietPreference: String,
    allergies: [String],
    sleepHours: Number,
  },
  currentPlan: Schema.Types.Mixed,
  history: [Schema.Types.Mixed],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
