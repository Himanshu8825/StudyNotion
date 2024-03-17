const mongoose = require("mongoose");
const mailSender = require("../utils/nodemailer");

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 5 * 60,
  },
});

let sendVerificationEmail = async (email, otp) => {
  try {
    const mailResponse = await mailSender(
      email,
      "Verification Email From StudyNotion",
      otp
    );
    console.log("Email Sent Successfuly", mailResponse);
  } catch (error) {
    console.log("Error while sending verification email", error);
    throw error;
  }
};

OTPSchema.pre("save", async (next) => {
  await sendVerificationEmail(this.email, this.otp);
  next();
});

module.exports = mongoose.model("OTP", OTPSchema);
