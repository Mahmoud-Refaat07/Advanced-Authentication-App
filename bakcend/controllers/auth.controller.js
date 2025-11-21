import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../lib/generateTokenAndSetCookie.js";
import crypto from "crypto";
import {
  sendResetPasswordEmail,
  sendResetSucessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../mailtrap/emails.js";
import "dotenv/config";

export const signup = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    if (!email || !password || !name) {
      return res.status(400).json({ message: "all fields required" });
    }

    const userIsExist = await User.findOne({ email });
    if (userIsExist)
      return res.status(400).json({ message: "User already exist" });

    const hashPassword = await bcrypt.hash(password, 10);

    const verificationToken = Math.floor(
      10000 + Math.random() * 900000
    ).toString();

    const user = new User({
      email,
      password: hashPassword,
      name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });
    await user.save();
    generateTokenAndSetCookie(res, user._id);
    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({ user: { ...user._doc, password: undefined } });
  } catch (error) {
    console.log("Error at signup controller", error);
  }
};

export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification code" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;

    await user.save();
    await sendWelcomeEmail(user.email, user.name);

    res.status(200).json({
      message: "Email verified sucessfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("Error in verification email endpoint", error);
    res.status(400).json({ message: "Error in verification email endpoint" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email && !password) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "User not found" });
    }
    const hashedPassword = await bcrypt.compare(password, user.password);
    if (!hashedPassword) {
      return res.status(400).json({ message: "Incorrect Password" });
    }

    generateTokenAndSetCookie(res, user._id);

    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      message: "Logged in sucessfully",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    console.log("Error in login endpoint", error);
    res.status(400).json({ message: "Error in login endpoint", error });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "logged out successfully" });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiersAt = resetTokenExpiresAt;

    // Send email
    await sendResetPasswordEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );

    await user.save();
    res.status(201).json({ message: "Password reset link sent to your email" });
  } catch (error) {
    console.log("Error sending password reset endpoint", error);
    res
      .status(400)
      .json({ message: "Error sending password reset endpoint", error });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiersAt: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "invalid or expires reset token" });
    }

    // update password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpiersAt = undefined;

    await user.save();

    sendResetSucessEmail(user.email);
    res.status(201).json({ message: "Password updated" });
  } catch (error) {
    console.log("Error reset password endpoint", error);
    res.status(400).json({ message: "Error reset password endpoint", error });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log("Error in check auth endpoint");
    res.status(500).json({ message: "Error in check auth endpoint" });
  }
};
