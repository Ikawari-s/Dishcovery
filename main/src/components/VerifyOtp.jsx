import React, { useState, useRef } from "react";
import { forgotPasswordResendOtpApi } from "../api/authenticationsApi";

function VerifyOtp({ onVerify, loading, email }) {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [resendLoading, setResendLoading] = useState(false);
  const [message, setMessage] = useState("");
  const inputs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;

    // accept only digits
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < inputs.current.length - 1) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const submitOtp = (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (!otpValue) return;
    onVerify(otpValue);
  };

  const resendOtp = async () => {
    try {
      setResendLoading(true);
      setMessage("");
      const res = await forgotPasswordResendOtpApi(email);
      setMessage(res.message || "OTP resent successfully");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-700 shadow-2xl rounded-3xl w-full max-w-md overflow-hidden grid md:grid-cols-1 transform transition-transform duration-300 hover:scale-105 mx-auto">
      <div className="p-8 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 400 300"
          className="mx-auto mb-6 w-48 h-48 animate-pulse"
        >
          <circle cx="200" cy="200" r="150" fill="#3B82F6" />
          <circle cx="200" cy="200" r="120" fill="#FFFFFF" />
          <circle cx="200" cy="200" r="90" fill="#3B82F6" />
          <circle cx="200" cy="200" r="60" fill="#FFFFFF" />
          <text
            x="200"
            y="200"
            textAnchor="middle"
            fill="#2563EB"
            fontSize="40"
            fontWeight="bold"
            dy=".3em"
            className="text-center"
          >
            OTP
          </text>
        </svg>

        <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">
          Verify OTP
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
          Enter the 6-digit code sent to {email}
        </p>

        {/* OTP INPUTS */}
        <form onSubmit={submitOtp}>
          <div className="flex justify-center space-x-4 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputs.current[index] = el)}
                className="w-12 h-16 text-center text-2xl border-2 border-blue-500 rounded-xl
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                  dark:bg-gray-600 dark:text-white dark:border-blue-400
                  transition-transform duration-300 hover:scale-110"
              />
            ))}
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-300 mb-6">
            Didn't receive code?{" "}
            <button
              type="button"
              onClick={resendOtp}
              disabled={resendLoading}
              className="text-blue-500 hover:underline dark:text-blue-400 transition-colors duration-300 hover:text-blue-600 dark:hover:text-blue-500"
            >
              {resendLoading ? "Resending..." : "Resend OTP"}
            </button>
          </div>

          {message && (
            <p className="mb-4 text-sm font-medium text-green-600 dark:text-green-400">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600
              transition-transform duration-300 hover:scale-105
              dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default VerifyOtp;
