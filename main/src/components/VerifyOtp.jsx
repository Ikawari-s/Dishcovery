import React, { useState } from "react";

function VerifyOtp({ onVerify, loading }) {
  const [otp, setOtp] = useState("");

  const submitOtp = (e) => {
    e.preventDefault();
    if (!otp) return;
    onVerify(otp); // ✅ pass otp to parent
  };

  return (
    <form className="max-w-sm mx-auto" onSubmit={submitOtp}>
      <h2 className="text-xl font-bold mb-4">Type in your OTP</h2>
      <div className="mb-5">
        <label
          htmlFor="otp"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          OTP
        </label>
        <input
          type="text"
          id="otp"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          required
        />
      </div>
      <button
        type="submit"
        className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5"
        disabled={loading}
      >
        {loading ? "Verifying..." : "Submit"}
      </button>
    </form>
  );
}

export default VerifyOtp;
