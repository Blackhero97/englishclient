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

  // Check if test is available based on deadline
  const getTestStatus = (test) => {
    const now = new Date();
    
    if (test.startDate) {
      const startDate = new Date(test.startDate);
      if (now < startDate) {
        return { available: false, status: 'locked', date: startDate };
      }
    }
    
    if (test.endDate) {
      const endDate = new Date(test.endDate);
      if (now > endDate) {
        return { available: false, status: 'expired', date: endDate };
      }
    }
    
    return { available: true, status: 'active' };
  };

  const handleStartTest = () => {
    if (selectedTest) {
      // Deadline tekshiruvi
      const now = new Date();
      
      if (selectedTest.startDate) {
        const startDate = new Date(selectedTest.startDate);
        if (now < startDate) {
          const startFormatted = startDate.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
          toast.error(`Test will be available from ${startFormatted}`, {
            position: "top-center",
            autoClose: 5000,
          });
          return;
        }
      }
      
      if (selectedTest.endDate) {
        const endDate = new Date(selectedTest.endDate);
        if (now > endDate) {
          toast.error('This test deadline has passed!', {
            position: "top-center",
            autoClose: 4000,
          });
          return;
        }
      }
      
      onSelectTest(selectedTest, firstName, lastName);
    }
  };

  // Show login form if user hasn't entered name yet
  if (!showTests) {
    return (
      <div className="h-screen overflow-hidden">
        <div className="h-full overflow-y-auto bg-gradient-to-br from-slate-50 to-blue-50 px-3 sm:px-4 py-4 sm:py-6">
          <div className="max-w-md mx-auto">
            <button
              onClick={() => navigate("/")}
              className="mb-4 flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg shadow hover:shadow-md text-gray-700 hover:text-blue-600 transition-all text-sm font-medium"
            >
              <FaArrowLeft className="text-xs" />
              <span>Back to Home</span>
            </button>

            <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6 border border-gray-100">
              <div className="text-center mb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Welcome to Practice Tests</h2>
                <p className="text-sm text-gray-600">Please enter your name to continue</p>
              </div>

              <div className="space-y-3 mb-4">
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 text-sm text-gray-900 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all placeholder-gray-400"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2 text-sm text-gray-900 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all placeholder-gray-400"
                />
                <button
                  onClick={handleContinue}
                  className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold rounded-lg transition-all shadow-lg hover:shadow-xl"
                >
                  Continue to Tests
                </button>
              </div>

              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-white text-gray-500 font-medium">Or sign in with Google</span>
                </div>
              </div>

              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap
                  theme="filled_blue"
                  size="medium"
                  text="continue_with"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden">
      <div className="h-full overflow-y-auto bg-gradient-to-br from-slate-50 to-blue-50 px-3 sm:px-4 py-4 sm:py-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate("/")}
            className="mb-4 flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg shadow hover:shadow-md text-gray-700 hover:text-blue-600 transition-all text-sm font-medium"
          >
            <FaArrowLeft className="text-xs" />
            <span>Back to Home</span>
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 mb-2">
              Choose Your Test
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Hi, {firstName} {lastName}! Select a test below to get started
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <FaSpinner className="animate-spin text-blue-600 text-4xl mx-auto mb-3" />
              <p className="text-gray-600 text-sm font-semibold">Loading tests...</p>
            </div>
          ) : testSets.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100 shadow-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="text-3xl text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">No tests available yet</h3>
              <p className="text-sm text-gray-600">Please contact your administrator</p>
            </div>
          ) : (
            <>
              {/* Test List */}
              <div className="space-y-3 mb-5">
                {testSets.map((test) => (
                  <div
                    key={test.id}
                    onClick={() => handleSelectTest(test)}
                    className={`bg-white rounded-xl border-2 p-4 sm:p-5 cursor-pointer transition-all hover:shadow-lg ${
                      selectedTest?.id === test.id
                        ? "border-blue-500 shadow-lg"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                          {test.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {test.description || "Complete English proficiency assessment"}
                        </p>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-3 transition-all ${
                          selectedTest?.id === test.id
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedTest?.id === test.id && (
                          <FaCheckCircle className="text-white text-sm" />
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <div className="flex items-center gap-2 text-gray-700">
                        <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FaCheckCircle className="text-blue-600 text-xs" />
                        </div>
                        <span className="text-xs sm:text-sm font-semibold">
                          {test.questions.length} Questions
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <div className="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <FaClock className="text-indigo-600 text-xs" />
                        </div>
                        <span className="text-xs sm:text-sm font-semibold">
                          {test.duration} minutes
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <div className="w-7 h-7 bg-purple-100 rounded-lg flex items-center justify-center">
                          <FaBolt className="text-purple-600 text-xs" />
                        </div>
                        <span className="text-xs sm:text-sm font-semibold">
                          Instant Results
                        </span>
                      </div>
                    </div>
                    
                    {/* Deadline status */}
                    {(() => {
                      const status = getTestStatus(test);
                      
                      if (status.status === 'locked') {
                        return (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                              <span className="text-2xl">🔒</span>
                              <div className="flex-1">
                                <div className="text-xs font-bold text-yellow-800">LOCKED</div>
                                <div className="text-xs text-yellow-700">
                                  Available from: {status.date.toLocaleString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      
                      if (status.status === 'expired') {
                        return (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg p-2">
                              <span className="text-2xl">⏱️</span>
                              <div className="flex-1">
                                <div className="text-xs font-bold text-red-800">DEADLINE PASSED</div>
                                <div className="text-xs text-red-700">
                                  Ended: {status.date.toLocaleString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      
                      // Show deadline info if available
                      if (test.startDate || test.endDate) {
                        return (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            {test.startDate && (
                              <div className="text-xs text-green-600 font-semibold mb-1">
                                🟢 Available from: {new Date(test.startDate).toLocaleString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                            )}
                            {test.endDate && (
                              <div className="text-xs text-red-600 font-semibold">
                                🔴 Deadline: {new Date(test.endDate).toLocaleString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                            )}
                          </div>
                        );
                      }
                      
                      return null;
                    })()}
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => window.history.back()}
                  className="px-4 py-2 bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-lg transition-all shadow-md"
                >
                  ← Back
                </button>
                <button
                  onClick={handleStartTest}
                  disabled={!selectedTest || (selectedTest && !getTestStatus(selectedTest).available)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-bold py-2 rounded-lg transition-all shadow-lg disabled:shadow-none"
                >
                  {!selectedTest 
                    ? "Select a Test" 
                    : !getTestStatus(selectedTest).available
                    ? `${getTestStatus(selectedTest).status === 'locked' ? '🔒 Test Locked' : '⏱️ Deadline Passed'}`
                    : `Start ${selectedTest.name} →`
                  }
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default TestSelection;
