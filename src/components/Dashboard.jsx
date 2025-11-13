import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBook,
  FaClipboardList,
  FaGraduationCap,
  FaClock,
  FaTrophy,
  FaUsers,
  FaRocket,
  FaStar,
  FaChartLine,
  FaInstagram,
  FaGithub,
  FaTelegram,
  FaEnvelope,
} from "react-icons/fa";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Dashboard({ user, onUserLogin }) {
  const navigate = useNavigate();

  const handleContinueToTests = () => {
    navigate("/test-selection");
  };

  const handleContinueToLessons = () => {
    navigate("/lessons");
  };

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="h-full overflow-y-auto">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
          {/* Hero Section */}
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-5 sm:p-8 lg:p-12 mb-4 sm:mb-8 shadow-2xl">
            <div className="absolute inset-0 bg-grid-white/10"></div>
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                  <FaGraduationCap className="text-2xl sm:text-3xl text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-white mb-1">
                    Welcome to English Learning Platform
                  </h1>
                  <p className="text-blue-100 text-sm sm:text-base lg:text-lg">
                    Your journey to English fluency starts here
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mt-4 sm:mt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/20">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                    <FaBook className="text-lg sm:text-2xl text-blue-200" />
                    <span className="text-2xl sm:text-3xl font-bold text-white">
                      17+
                    </span>
                  </div>
                  <p className="text-blue-100 text-xs sm:text-sm">
                    Interactive Lessons
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/20">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                    <FaClipboardList className="text-lg sm:text-2xl text-indigo-200" />
                    <span className="text-2xl sm:text-3xl font-bold text-white">
                      50+
                    </span>
                  </div>
                  <p className="text-indigo-100 text-xs sm:text-sm">
                    Practice Tests
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/20">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                    <FaRocket className="text-lg sm:text-2xl text-purple-200" />
                    <span className="text-2xl sm:text-3xl font-bold text-white">
                      AI
                    </span>
                  </div>
                  <p className="text-purple-100 text-xs sm:text-sm">
                    Powered Feedback
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/20">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                    <FaUsers className="text-lg sm:text-2xl text-pink-200" />
                    <span className="text-2xl sm:text-3xl font-bold text-white">
                      1k+
                    </span>
                  </div>
                  <p className="text-pink-100 text-xs sm:text-sm">
                    Active Learners
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-8">
            {/* Main Learning Card */}
            <button
              onClick={handleContinueToLessons}
              className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 text-left"
            >
              <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-24 sm:h-24 bg-white/5 rounded-full -ml-10 sm:-ml-12 -mb-10 sm:-mb-12"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FaBook className="text-xl sm:text-2xl text-white" />
                  </div>
                  <span className="px-2.5 py-1 sm:px-3 bg-green-400/90 text-green-900 rounded-full text-xs font-bold uppercase tracking-wider">
                    Free
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  English Lessons
                </h3>
                <p className="text-blue-100 text-sm sm:text-base mb-3 sm:mb-4 leading-relaxed">
                  Master grammar, vocabulary, and pronunciation with 17+
                  interactive lessons
                </p>

                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                  <span className="px-2 py-0.5 sm:py-1 bg-white/10 text-white text-xs rounded-full">
                    Grammar
                  </span>
                  <span className="px-2 py-0.5 sm:py-1 bg-white/10 text-white text-xs rounded-full">
                    Vocabulary
                  </span>
                  <span className="px-2 py-0.5 sm:py-1 bg-white/10 text-white text-xs rounded-full">
                    Speaking
                  </span>
                </div>

                <div className="flex items-center text-white font-semibold gap-2">
                  <span className="text-sm sm:text-base">Start Learning</span>
                  <span className="text-lg sm:text-xl group-hover:translate-x-2 transition-transform">
                    →
                  </span>
                </div>
              </div>
            </button>

            {/* Practice Tests Card */}
            <button
              onClick={handleContinueToTests}
              className="group relative overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 text-left"
            >
              <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-24 sm:h-24 bg-white/5 rounded-full -ml-10 sm:-ml-12 -mb-10 sm:-mb-12"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FaClipboardList className="text-xl sm:text-2xl text-white" />
                  </div>
                  <span className="px-2.5 py-1 sm:px-3 bg-yellow-400/90 text-yellow-900 rounded-full text-xs font-bold uppercase tracking-wider">
                    Timed
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  Practice Tests
                </h3>
                <p className="text-purple-100 text-sm sm:text-base mb-3 sm:mb-4 leading-relaxed">
                  Test your knowledge with comprehensive assessments and instant
                  AI feedback
                </p>

                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                  <span className="px-2 py-0.5 sm:py-1 bg-white/10 text-white text-xs rounded-full">
                    Reading
                  </span>
                  <span className="px-2 py-0.5 sm:py-1 bg-white/10 text-white text-xs rounded-full">
                    Writing
                  </span>
                  <span className="px-2 py-0.5 sm:py-1 bg-white/10 text-white text-xs rounded-full">
                    Listening
                  </span>
                </div>

                <div className="flex items-center text-white font-semibold gap-2">
                  <span className="text-sm sm:text-base">Start Testing</span>
                  <span className="text-lg sm:text-xl group-hover:translate-x-2 transition-transform">
                    →
                  </span>
                </div>
              </div>
            </button>

            {/* Admin Panel Card */}
            <button
              onClick={() => navigate("/admin")}
              className="group relative overflow-hidden bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 text-left"
            >
              <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 sm:w-24 sm:h-24 bg-white/5 rounded-full -ml-10 sm:-ml-12 -mb-10 sm:-mb-12"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="px-2.5 py-1 sm:px-3 bg-red-400/90 text-red-900 rounded-full text-xs font-bold uppercase tracking-wider">
                    Admin
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  Admin Panel
                </h3>
                <p className="text-purple-100 text-sm sm:text-base mb-3 sm:mb-4 leading-relaxed">
                  Manage platform content, users, and monitor learning progress
                </p>

                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                  <span className="px-2 py-0.5 sm:py-1 bg-white/10 text-white text-xs rounded-full">
                    Dashboard
                  </span>
                  <span className="px-2 py-0.5 sm:py-1 bg-white/10 text-white text-xs rounded-full">
                    Analytics
                  </span>
                  <span className="px-2 py-0.5 sm:py-1 bg-white/10 text-white text-xs rounded-full">
                    Settings
                  </span>
                </div>

                <div className="flex items-center text-white font-semibold gap-2">
                  <span className="text-sm sm:text-base">Admin Access</span>
                  <span className="text-lg sm:text-xl group-hover:translate-x-2 transition-transform">
                    →
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Features Section */}
          <div className="mb-4 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
              <FaStar className="text-yellow-500 text-lg sm:text-xl" />
              Why Choose Our Platform?
            </h2>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-5 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-2 sm:mb-3">
                  <FaGraduationCap className="text-lg sm:text-xl text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-1 sm:mb-2">
                  Expert Teachers
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Learn from experienced instructors like Miss Nora
                </p>
              </div>

              <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-5 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mb-2 sm:mb-3">
                  <FaClock className="text-lg sm:text-xl text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-1 sm:mb-2">
                  Learn Anytime
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Study at your own pace, 24/7 access to all materials
                </p>
              </div>

              <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-5 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-2 sm:mb-3">
                  <FaTrophy className="text-lg sm:text-xl text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-1 sm:mb-2">
                  Track Progress
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Monitor your improvement with detailed analytics
                </p>
              </div>

              <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-5 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center mb-2 sm:mb-3">
                  <FaChartLine className="text-lg sm:text-xl text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-1 sm:mb-2">
                  AI Feedback
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Get instant intelligent feedback on your answers
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Info Section */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 mb-4 sm:mb-6">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6">
              <div className="flex-1 text-center lg:text-left">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2">
                  Ready to Start Your English Journey?
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Join thousands of learners improving their English skills
                  every day
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                <button
                  onClick={handleContinueToLessons}
                  className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl hover:shadow-lg transition-all hover:-translate-y-0.5"
                >
                  Start Free Lessons
                </button>
                <button
                  onClick={handleContinueToTests}
                  className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-indigo-600 text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl border-2 border-indigo-600 hover:bg-indigo-50 transition-all hover:-translate-y-0.5"
                >
                  Take a Test
                </button>
              </div>
            </div>
          </div>

          {/* Footer - Creator & Teacher Info */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-indigo-100">
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Teacher Section */}
              <div className="bg-white rounded-lg sm:rounded-xl p-4 shadow-md border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                    <FaGraduationCap className="text-lg sm:text-xl text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">
                      Teacher
                    </p>
                    <h4 className="text-base sm:text-lg font-bold text-gray-900">
                      Miss Nora
                    </h4>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-600">
                  Expert English instructor with years of teaching experience
                </p>
              </div>

              {/* Creator Section */}
              <div className="bg-white rounded-lg sm:rounded-xl p-4 shadow-md border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">
                      App Creator
                    </p>
                    <h4 className="text-base sm:text-lg font-bold text-gray-900">
                      Nurmuhammadov Hasanboy
                    </h4>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mb-3">
                  Full-stack developer & educator
                </p>

                {/* Social Links */}
                <div className="flex items-center gap-2 flex-wrap">
                  <a
                    href="https://www.instagram.com/nurmuhammadov8/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all hover:-translate-y-0.5 hover:text-white text-xs font-medium"
                  >
                    <FaInstagram className="text-sm" />
                    <span>Instagram</span>
                  </a>

                  <a
                    href="https://github.com/Blackhero97"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 text-white rounded-lg hover:shadow-lg transition-all hover:-translate-y-0.5 hover:text-white text-xs font-medium"
                  >
                    <FaGithub className="text-sm" />
                    <span>GitHub</span>
                  </a>

                  <a
                    href="https://t.me/reactjsdasturchi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:shadow-lg transition-all hover:-translate-y-0.5 hover:text-white text-xs font-medium"
                  >
                    <FaTelegram className="text-sm" />
                    <span>Telegram</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
