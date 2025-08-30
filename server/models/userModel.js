import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Please add a name"], unique: true },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
    },
    password: { type: String, required: [true, "Please add a password"] },
    profilePicture: { type: String, default: "" },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isVerified: { type: Boolean, default: false }, // user can verify later
    otp: { type: String },
    otpExpire: { type: Date },
    canResetPassword: { type: Boolean, default: false },
  },

  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
