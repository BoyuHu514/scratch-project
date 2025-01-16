import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const SALT_WORK_FACTOR = 10;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    avatarUrl: {
      type: String, // Profile picture
    },

    // Authentication fields
    password: {
      type: String,
      minlength: 6,
      // Password is only required for regular authentication
      required: function () {
        // Here, this refers to the User being validated.
        return this.provider === 'local';
      },
    },
    provider: {
      type: String,
      enum: ['local', 'google', 'github'], // List of supported providers
      required: true,
    },

    // OAuth-specific fields (optional)
    googleId: {
      type: String,
      unique: true,
      //The sparse option in Mongoose is used for creating indexes that allow multiple documents to have null values in a field while still maintaining uniqueness for non-null values.
      // sparse: true is essential for fields like googleId or githubId in a user schema because not all users will use OAuth.
      // It allows you to enforce uniqueness without causing conflicts for null or missing values.
      sparse: true,
    },
    githubId: {
      type: String,
      unique: true,
      sparse: true, // allows multiple null values
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    //With timestamps: true, createdAt and updatedAt are automatically managed by Mongoose on the backend.
    // we don't need to pass them from the frontend; they are handled by Mongoose when a document is created or updated.
    // Automatically adds `createdAt` and `updatedAt` fields
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  try {
    // Check if the password has been modified
    if (!this.isModified('password')) return next();

    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    // Ignore this warning await does have an effect for local auth
    this.password = await bcrypt.hash(this.password, salt);
    next(); // Proceed to save
  } catch (error) {
    next(error); // Pass any errors to the next middleware
  }
});
const User = mongoose.model('User', userSchema);
export default User;
