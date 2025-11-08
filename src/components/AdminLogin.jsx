import React, { useState } from "react";
import { FaLock, FaArrowLeft, FaKey } from "react-icons/fa";

function AdminLogin({ onLogin, onBack }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = onLogin(password);
    if (!success) {
      setError(true);
      setTimeout(() => setError(false), 2000);
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <button
          onClick={onBack}
          className="mb-4 flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow hover:shadow-md text-gray-700 hover:text-blue-600 transition-all font-medium"
        >
          <FaArrowLeft className="text-sm" />
          <span className="text-sm">Back to Home</span>
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <FaLock className="text-white text-3xl" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-center mb-2 text-gray-900">
            Admin Access
          </h2>
          <p className="text-center text-gray-500 mb-6">
            Enter your password to continue
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2 text-sm">
                <FaKey className="text-blue-600" />
                <span>PASSWORD</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <FaKey
                    className={`${error ? "text-red-500" : "text-gray-400"}`}
                  />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className={`w-full pl-12 pr-4 py-3 rounded-lg focus:outline-none transition-all border-2 ${
                    error
                      ? "border-red-400 bg-red-50 text-red-900 placeholder-red-400 focus:ring-2 focus:ring-red-200"
                      : "border-2 border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 focus:bg-white hover:border-gray-400"
                  }`}
                  autoFocus
                />
              </div>
              {error && (
                <p className="mt-2 text-red-600 text-sm flex items-center gap-2">
                  <span>⚠️</span>
                  <span>Incorrect password. Please try again.</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <FaLock />
              <span>Sign In</span>
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-xs">Secure admin authentication</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
