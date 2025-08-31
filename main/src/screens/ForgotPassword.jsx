import React, { useState } from "react";
import { Link } from "react-router-dom";
import ChangePassOtp from "../components/ChangePassOtp";

import VerifyOtp from "../components/VerifyOtp";
import {
  forgotPasswordRequestApi,
  forgotPasswordVerifyApi,
  resetPasswordApi,
} from "../api/authenticationsApi";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState("email"); // "email" | "verify" | "reset"
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const submitEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await forgotPasswordRequestApi(email);
      setMessage(res.message);
      setIsSuccess(true);
      setStep("verify"); // ✅ move to verify
    } catch (err) {
      setMessage(err.message);
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (otp) => {
    setLoading(true);
    try {
      const res = await forgotPasswordVerifyApi(email, otp);
      setMessage(res.message);
      setIsSuccess(true);
      setStep("reset"); // ✅ move to reset password
    } catch (err) {
      setMessage(err.message);
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (newPassword) => {
    setLoading(true);
    try {
      const res = await resetPasswordApi(email, newPassword);
      setMessage(res.message);
      setIsSuccess(true);
      setStep("done");
    } catch (err) {
      setMessage(err.message);
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {message && (
        <div
          className={`flex items-center p-4 mb-4 text-sm rounded-lg ${
            isSuccess
              ? "text-green-800 border border-green-300 bg-green-50"
              : "text-red-800 border border-red-300 bg-red-50"
          }`}
          role="alert"
        >
          {message}
        </div>
      )}

      {step === "email" && (
        <form onSubmit={submitEmail} className="max-w-sm mx-auto">
          <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
          <div className="mb-5">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
              placeholder="name@example.com"
              required
            />
          </div>
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      )}

      {step === "verify" && (
        <VerifyOtp email={email} onVerify={handleVerify} loading={loading} />
      )}

      {step === "reset" && (
        <ChangePassOtp onReset={handleResetPassword} loading={loading} />
      )}

      {step === "done" && (
        <p className="text-green-700 font-bold">
          ✅ Password reset successful. You can now log in.
        </p>
      )}
    </div>
  );
}

export default ForgotPassword;
