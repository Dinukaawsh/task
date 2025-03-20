import mongoose from 'mongoose';

// User Schema
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    profile_image: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: ['admin', 'manager', 'salesman'],
      required: true,
    },
    managedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to User
  },
  {
    timestamps: true, // Automatically adds createdAt & updatedAt
  }
);

export default mongoose.models.User || mongoose.model('User', userSchema);


