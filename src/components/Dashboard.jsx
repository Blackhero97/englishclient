import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBook, FaClipboardList } from "react-icons/fa";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Dashboard({ user, onUserLogin }) {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const response = await fetch(API_URL + "/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: credentialResponse.credential,
          email: decoded.email,
          name: decoded.name,
          picture: decoded.picture,
        }),
      });
      const data = await response.json();
      if (data.success) {
        const userData = {
          ...data.user,
          firstName: data.user.firstName || decoded.given_name || "",
          lastName: data.user.lastName || decoded.family_name || "",
        };
        localStorage.setItem("user", JSON.stringify(userData));
        onUserLogin(userData);
        toast.success("Welcome! Signed in successfully");
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Failed to sign in with Google");
    }
  };

  const handleGoogleError = () => {
    toast.error("Google sign in failed");
  };

  const handleContinueToTests = () => {
    // Navigate to test selection page (login will be handled there)
    navigate("/test-selection");
  };

  const handleContinueToLessons = () => {
    navigate("/lessons");
  };

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        <div className="text-center mb-4">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">English Learning Platform</h1>
          <p className="text-sm text-gray-600">Master English with AI assistance</p>
        </div>
        <div className="grid lg:grid-cols-2 gap-4 flex-1 min-h-0">
          <div className="space-y-3">
            {/* Platform Info */}
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg p-5 border border-blue-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                  </svg>
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">Welcome to English Learning!</h2>
                  <p className="text-sm text-gray-600">Your journey starts here</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">Interactive Lessons</h4>
                    <p className="text-sm text-gray-600">10+ lessons on grammar and vocabulary</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">AI-Powered Tests</h4>
                    <p className="text-sm text-gray-600">Instant AI feedback on answers</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">Track Progress</h4>
                    <p className="text-sm text-gray-600">Detailed results and analytics</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Features Grid - 4 cards */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-white rounded-xl p-3.5 shadow-lg border border-gray-100">
                <div className="w-11 h-11 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-2">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/></svg>
                </div>
                <h4 className="text-sm font-bold text-gray-900 mb-1">Teacher</h4>
                <p className="text-sm text-gray-600">Miss Nora</p>
              </div>
              <div className="bg-white rounded-xl p-3.5 shadow-lg border border-gray-100">
                <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-2">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/></svg>
                </div>
                <h4 className="text-sm font-bold text-gray-900 mb-1">Creator</h4>
                <p className="text-sm text-gray-600">N. Hasanboy</p>
              </div>
              <div className="bg-white rounded-xl p-3.5 shadow-lg border border-gray-100">
                <div className="w-11 h-11 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-2">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/></svg>
                </div>
                <h4 className="text-sm font-bold text-gray-900 mb-1">10+ Lessons</h4>
                <p className="text-sm text-gray-600">All levels</p>
              </div>
              <div className="bg-white rounded-xl p-3.5 shadow-lg border border-gray-100">
                <div className="w-11 h-11 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-2">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/></svg>
                </div>
                <h4 className="text-sm font-bold text-gray-900 mb-1">AI Results</h4>
                <p className="text-sm text-gray-600">Instant</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <button onClick={handleContinueToLessons} className="w-full group bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 text-left">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FaBook className="text-xl text-white" />
                </div>
                <span className="px-2.5 py-1 bg-white/25 rounded-full text-white text-xs font-bold">FREE</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1.5">English Lessons</h3>
              <p className="text-blue-50 text-sm mb-2 leading-relaxed">10+ interactive lessons covering grammar and vocabulary</p>
              <div className="flex items-center text-white font-semibold gap-1.5 text-sm">
                <span>Start Learning</span>
                <span className="text-base group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </button>
            <button onClick={handleContinueToTests} className="w-full group bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 text-left">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FaClipboardList className="text-xl text-white" />
                </div>
                <span className="px-2.5 py-1 bg-white/25 rounded-full text-white text-xs font-bold">TIMED</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1.5">Practice Tests</h3>
              <p className="text-purple-50 text-sm mb-2 leading-relaxed">
                Comprehensive assessments with instant AI feedback
              </p>
              <div className="flex items-center text-white font-semibold gap-1.5 text-sm">
                <span>Start Testing</span>
                <span className="text-base group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </button>
            <button onClick={() => navigate('/admin')} className="w-full group bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-3.5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 text-left">
              <div className="flex items-center justify-between mb-1.5">
                <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd"/>
                  </svg>
                </div>
                <span className="px-2.5 py-1 bg-white/25 rounded-full text-white text-xs font-bold">ADMIN</span>
              </div>
              <h3 className="text-base font-bold text-white mb-1.5">Admin Panel</h3>
              <p className="text-purple-50 text-sm mb-1.5 leading-relaxed">Manage platform</p>
              <div className="flex items-center text-white font-semibold gap-1.5 text-sm">
                <span>Login</span>
                <span className="text-base group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
