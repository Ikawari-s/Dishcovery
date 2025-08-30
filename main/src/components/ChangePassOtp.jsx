import React, { useState } from "react";

function ChangePassOtp({ onReset, loading }) {
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPass, setShowPass] = useState(false);

  const submitNewPass = (e) => {
    e.preventDefault();
    if (password !== password2) {
      alert("Passwords do not match");
      return;
    }
    onReset(password); // ✅ pass new password up
  };

  return (
    <form onSubmit={submitNewPass} className="max-w-sm mx-auto">
      <h2 className="text-xl font-bold mb-4">Type New Password</h2>
      <div className="mb-5">
        <label
          htmlFor="password"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          New Password
        </label>
        <input
          type={showPass ? "text" : "password"}
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          required
        />
      </div>
      <div className="mb-5">
        <label
          htmlFor="password2"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Confirm Password
        </label>
        <input
          type={showPass ? "text" : "password"}
          id="password2"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
          required
        />
      </div>
      <div class="flex items-start mb-5">
        <div class="flex items-center h-5">
          <input
            id="showpass"
            type="checkbox"
            value=""
            class="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
            checked={showPass}
            onChange={() => setShowPass(!showPass)}
          />
        </div>
        <label
          for="showpass"
          class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          Show Password
        </label>
      </div>
      <button
        type="submit"
        className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5"
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}

export default ChangePassOtp;
