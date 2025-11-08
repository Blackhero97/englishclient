import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaClock,
  FaBolt,
  FaSpinner,
  FaArrowLeft,
} from "react-icons/fa";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function TestSelection({ testSets, loading, onSelectTest, user, onUserLogin }) {
  const navigate = useNavigate();
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [selectedTest, setSelectedTest] = React.useState(null);
  const [showTests, setShowTests] = React.useState(false);

  // Check if user is logged in
  React.useEffect(() => {
    if (user && user.firstName && user.lastName) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setShowTests(true);
    }
  }, [user]);

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
        setFirstName(userData.firstName);
        setLastName(userData.lastName);
        setShowTests(true);
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

  const handleContinue = () => {
    if (firstName.trim() && lastName.trim()) {
      setShowTests(true);
    } else {
      toast.error("Please enter your name");
    }
  };

  const handleSelectTest = (test) => {
    setSelectedTest(test);
  };

  const handleStartTest = () => {
    if (selectedTest) {
      onSelectTest(selectedTest, firstName, lastName);
    }
  };

  // Show login form if user hasn't entered name yet
  if (!showTests) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 lg:p-8">
        <div className="max-w-md mx-auto">
          <button
            onClick={() => navigate("/")}
            className="mb-6 flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow hover:shadow-md text-gray-700 hover:text-blue-600 transition-all font-medium"
          >
            <FaArrowLeft className="text-sm" />
            <span className="text-sm">Back to Home</span>
          </button>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Practice Tests</h2>
              <p className="text-gray-600">Please enter your name to continue</p>
            </div>

            <div className="space-y-4 mb-6">
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 text-gray-900 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all placeholder-gray-400"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-3 text-gray-900 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all placeholder-gray-400"
              />
              <button
                onClick={handleContinue}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl"
              >
                Continue to Tests
              </button>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">Or sign in with Google</span>
              </div>
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
                theme="filled_blue"
                size="large"
                text="continue_with"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className="mb-6 flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow hover:shadow-md text-gray-700 hover:text-blue-600 transition-all font-medium"
        >
          <FaArrowLeft className="text-sm" />
          <span className="text-sm">Back to Home</span>
        </button>

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-3">
            Choose Your Test
          </h1>
          <p className="text-lg text-gray-600">
            Hi, {firstName} {lastName}! Select a test below to get started
          </p>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <FaSpinner className="animate-spin text-blue-600 text-5xl mx-auto mb-4" />
            <p className="text-gray-600 font-semibold">Loading tests...</p>
          </div>
        ) : testSets.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-lg">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCheckCircle className="text-4xl text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No tests available yet</h3>
            <p className="text-gray-600">Please contact your administrator</p>
          </div>
        ) : (
          <>
            {/* Test List */}
            <div className="space-y-5 mb-8">
              {testSets.map((test) => (
                <div
                  key={test.id}
                  onClick={() => handleSelectTest(test)}
                  className={`bg-white rounded-2xl border-2 p-6 lg:p-8 cursor-pointer transition-all hover:shadow-xl ${
                    selectedTest?.id === test.id
                      ? "border-blue-500 shadow-xl"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {test.name}
                      </h3>
                      <p className="text-gray-600">
                        {test.description || "Complete English proficiency assessment"}
                      </p>
                    </div>
                    <div
                      className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-4 transition-all ${
                        selectedTest?.id === test.id
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedTest?.id === test.id && (
                        <FaCheckCircle className="text-white text-base" />
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 lg:gap-6">
                    <div className="flex items-center gap-2 text-gray-700">
                      <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FaCheckCircle className="text-blue-600 text-sm" />
                      </div>
                      <span className="font-semibold">
                        {test.questions.length} Questions
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <div className="w-9 h-9 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <FaClock className="text-indigo-600 text-sm" />
                      </div>
                      <span className="font-semibold">
                        {test.duration} minutes
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center">
                        <FaBolt className="text-purple-600 text-sm" />
                      </div>
                      <span className="font-semibold">
                        Instant Results
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => window.history.back()}
                className="px-6 py-3.5 bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition-all shadow-md"
              >
                ← Back
              </button>
              <button
                onClick={handleStartTest}
                disabled={!selectedTest}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all shadow-lg disabled:shadow-none"
              >
                {selectedTest ? `Start ${selectedTest.name} →` : "Select a Test"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default TestSelection;
