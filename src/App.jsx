import { useState, useEffect, useCallback } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import TestSelection from "./components/TestSelection";
import AdminLogin from "./components/AdminLogin";
import AdminPanel from "./components/AdminPanel";
import ResultsView from "./components/ResultsView";
import AIChatbot from "./components/AIChatbot";
import DetailedResults from "./components/DetailedResults";
import Dashboard from "./components/Dashboard";
import LessonsModule from "./components/LessonsModule";
import LessonDetail from "./components/LessonDetail";
import Certificate from "./components/Certificate";
import {
  FaClock,
  FaBookmark,
  FaRegBookmark,
  FaCheckCircle,
  FaTimesCircle,
  FaClipboardList,
  FaRedo,
  FaPrint,
  FaListAlt,
  FaBars,
  FaTimes,
  FaGraduationCap,
  FaUserTie,
  FaRobot,
} from "react-icons/fa";

// Admin password from environment variable (can be changed in Netlify settings)
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "admin123";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getScore(answers, questions) {
  let score = 0;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i] === questions[i]?.answer) {
      score += 4;
    }
  }
  return score;
}

function App() {
  const navigate = useNavigate();
  const [name, setName] = useState(() => {
    return sessionStorage.getItem("studentName") || "";
  });
  const [surname, setSurname] = useState(() => {
    return sessionStorage.getItem("studentSurname") || "";
  });
  const [testSets, setTestSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTestSet, setSelectedTestSet] = useState(() => {
    const saved = sessionStorage.getItem("selectedTestSet");
    return saved ? JSON.parse(saved) : null;
  });
  const [isAdmin, setIsAdmin] = useState(() => {
    return sessionStorage.getItem("isAdmin") === "true";
  });

  const questions = selectedTestSet?.questions || [];
  const [current, setCurrent] = useState(() => {
    return parseInt(sessionStorage.getItem("currentQuestion") || "0");
  });
  const [answers, setAnswers] = useState(() => {
    const saved = sessionStorage.getItem("testAnswers");
    return saved ? JSON.parse(saved) : [];
  });
  const [bookmarked, setBookmarked] = useState(() => {
    const saved = sessionStorage.getItem("bookmarkedQuestions");
    return saved ? JSON.parse(saved) : [];
  });
  const [timeLeft, setTimeLeft] = useState(() => {
    const saved = sessionStorage.getItem("timeLeft");
    return saved ? parseInt(saved) : (selectedTestSet?.duration || 30) * 60; // default 30 minutes
  });
  const [showReview, setShowReview] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [resultSaved, setResultSaved] = useState(() => {
    return sessionStorage.getItem("resultSaved") === "true";
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAIChatbot, setShowAIChatbot] = useState(false);

  // Result page tab state - mobile optimization
  const [resultTab, setResultTab] = useState("summary"); // summary, answers, chat

  // Store test results for AI chatbot context
  const [testResults, setTestResults] = useState(() => {
    const saved = sessionStorage.getItem("testResults");
    return saved ? JSON.parse(saved) : null;
  });

  // Store result ID for detailed results view
  const [resultId, setResultId] = useState(() => {
    return sessionStorage.getItem("resultId") || null;
  });

  // User state for Google OAuth
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const handleUserLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleUserLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.info("Logged out successfully");
  };

  const score = getScore(answers, questions);
  const maxScore = 100;
  const percent = Math.round((score / maxScore) * 100);

  // Fetch tests from API on mount
  useEffect(() => {
    const fetchTests = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/tests`);
        const data = await response.json();
        setTestSets(data.testSets || []);
      } catch (error) {
        console.error("Failed to fetch tests:", error);
        toast.error("Failed to load tests. Please check your connection.");
        setTestSets([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, []);

  // Save to sessionStorage when states change
  useEffect(() => {
    if (name) sessionStorage.setItem("studentName", name);
    if (surname) sessionStorage.setItem("studentSurname", surname);
  }, [name, surname]);

  useEffect(() => {
    if (selectedTestSet) {
      sessionStorage.setItem(
        "selectedTestSet",
        JSON.stringify(selectedTestSet)
      );
    }
  }, [selectedTestSet]);

  useEffect(() => {
    sessionStorage.setItem("currentQuestion", current.toString());
  }, [current]);

  useEffect(() => {
    if (answers.length > 0) {
      sessionStorage.setItem("testAnswers", JSON.stringify(answers));
    }
  }, [answers]);

  useEffect(() => {
    if (bookmarked.length >= 0) {
      sessionStorage.setItem("bookmarkedQuestions", JSON.stringify(bookmarked));
    }
  }, [bookmarked]);

  useEffect(() => {
    sessionStorage.setItem("timeLeft", timeLeft.toString());
  }, [timeLeft]);

  useEffect(() => {
    sessionStorage.setItem("resultSaved", resultSaved.toString());
  }, [resultSaved]);

  // Timer countdown
  useEffect(() => {
    if (selectedTestSet && timeLeft > 0 && !showReview) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            toast.warning("Time's up! Test will be submitted automatically.", {
              position: "top-center",
              autoClose: 3000,
            });
            setTimeout(() => navigate("/result"), 3000);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [selectedTestSet, timeLeft, showReview, navigate]);

  // Save isAdmin to sessionStorage when it changes
  useEffect(() => {
    sessionStorage.setItem("isAdmin", isAdmin.toString());
  }, [isAdmin]);

  // Prevent leaving test page before completion
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (
        selectedTestSet &&
        !showReview &&
        window.location.pathname === "/test"
      ) {
        e.preventDefault();
        e.returnValue =
          "Test davom etmoqda! Chiqsangiz barcha ma'lumotlar o'chib ketadi!";
        return e.returnValue;
      }
    };

    const preventNavigation = (e) => {
      if (
        selectedTestSet &&
        !showReview &&
        window.location.pathname === "/test"
      ) {
        const confirmExit = window.confirm(
          "Test hali tugallanmagan! Rostdan ham chiqmoqchimisiz? Barcha javoblaringiz o'chib ketadi!"
        );
        if (!confirmExit) {
          e.preventDefault();
          window.history.pushState(null, "", window.location.pathname);
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", preventNavigation);

    // Push initial state to prevent back button
    if (selectedTestSet && window.location.pathname === "/test") {
      window.history.pushState(null, "", window.location.pathname);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", preventNavigation);
    };
  }, [selectedTestSet, showReview]);

  const handleAdminLogin = (password) => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      sessionStorage.setItem("isAdmin", "true");
      toast.success("Successfully logged in!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      navigate("/admin-panel");
      return true;
    }
    toast.error("Wrong password! Please try again.", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    return false;
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    sessionStorage.setItem("isAdmin", "false");
    toast.info("Logged out successfully", {
      position: "top-right",
      autoClose: 2000,
    });
    navigate("/");
  };

  const handleSaveTests = async (updatedTests) => {
    setTestSets(updatedTests);
    // Tests are saved via API in AdminPanel component
  };

  const handleSelectTest = (testSet, firstName, lastName) => {
    setName(firstName);
    setSurname(lastName);
    setSelectedTestSet(testSet);
    setAnswers(new Array(testSet.questions.length).fill(null));
    setBookmarked([]);
    setCurrent(0);
    setTimeLeft((testSet.duration || 30) * 60);
    setShowReview(false);
    setResultSaved(false); // Reset result saved flag when starting new test
    navigate("/test");
  };

  const toggleBookmark = useCallback((index) => {
    setBookmarked((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      }
      return [...prev, index];
    });
  }, []);

  const handleAnswer = useCallback(
    (optionIndex) => {
      const newAnswers = [...answers];
      newAnswers[current] = optionIndex;
      setAnswers(newAnswers);
    },
    [answers, current]
  );

  const handleNext = useCallback(() => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    }
  }, [current, questions.length]);

  const handlePrev = useCallback(() => {
    if (current > 0) {
      setCurrent(current - 1);
    }
  }, [current]);

  const handleFinish = () => {
    const unanswered = answers.filter((a) => a === null).length;
    if (unanswered > 0) {
      toast.warning(`You have ${unanswered} unanswered questions!`, {
        position: "top-center",
        autoClose: 3000,
      });
    }
    setShowReview(true);
  };

  const handleSubmitTest = async () => {
    if (isSubmitting || resultSaved) {
      console.log("⚠️ Already submitting or saved");
      return;
    }

    console.log("🎯 Submit Test clicked!");
    setIsSubmitting(true);

    try {
      // Save result before navigating
      await saveResultToDatabase();
      navigate("/result");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetakeTest = () => {
    // Clear sessionStorage
    sessionStorage.clear();
    // Reset all states
    setName("");
    setSurname("");
    setSelectedTestSet(null);
    setCurrent(0);
    setAnswers([]);
    setBookmarked([]);
    setShowReview(false);
    setResultSaved(false);
    setResultId(null);
    setIsSubmitting(false);
    navigate("/");
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!selectedTestSet || showReview) return;

      // Number keys 1-4 for answers
      if (e.key >= "1" && e.key <= "4") {
        const index = parseInt(e.key) - 1;
        if (index < questions[current]?.options.length) {
          handleAnswer(index);
        }
      }
      // Arrow keys for navigation
      else if (e.key === "ArrowRight" && current < questions.length - 1) {
        handleNext();
      } else if (e.key === "ArrowLeft" && current > 0) {
        handlePrev();
      }
      // B for bookmark
      else if (e.key === "b" || e.key === "B") {
        toggleBookmark(current);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [
    current,
    selectedTestSet,
    showReview,
    questions,
    handleAnswer,
    handleNext,
    handlePrev,
    toggleBookmark,
  ]);

  const correct = answers.filter(
    (answer, index) => answer === questions[index]?.answer
  ).length;

  // Save result to database when test is completed
  const saveResultToDatabase = useCallback(async () => {
    if (!selectedTestSet || !name || !surname || resultSaved) {
      console.log("⚠️ Skipping save:", {
        selectedTestSet: !!selectedTestSet,
        name,
        surname,
        resultSaved,
      });
      return;
    }

    try {
      console.log("💾 Saving result to database...");
      
      // Build detailed answers array with question info
      const detailedAnswers = questions.map((question, index) => ({
        question: question.question,
        options: question.options,
        correctAnswer: question.answer,
        selectedAnswer: answers[index]
      }));
      
      const resultData = {
        firstName: name,
        lastName: surname,
        testId: selectedTestSet.id,
        testName: selectedTestSet.name,
        score: score,
        percentage: percent,
        totalQuestions: questions.length,
        correctAnswers: correct,
        wrongAnswers: questions.length - correct,
        answers: detailedAnswers,
      };

      console.log("📤 Sending data:", resultData);

      const response = await fetch(`${API_URL}/results`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resultData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("✅ Result saved successfully:", data);
        setResultSaved(true);

        // Save result ID for detailed results
        if (data.result?._id) {
          setResultId(data.result._id);
          sessionStorage.setItem("resultId", data.result._id);
        }

        // Save test results for AI chatbot context
        const results = {
          testName: selectedTestSet.name,
          score: score,
          percentage: percent,
          totalQuestions: questions.length,
          correctAnswers: correct,
          wrongAnswers: questions.length - correct,
        };
        setTestResults(results);
        sessionStorage.setItem("testResults", JSON.stringify(results));

        toast.success("Your result has been saved!");
      } else {
        console.error("❌ Failed to save result:", data);
        toast.error("Failed to save result");
      }
    } catch (error) {
      console.error("❌ Error saving result:", error);
      toast.error("Error saving result: " + error.message);
    }
  }, [
    selectedTestSet,
    answers,
    name,
    surname,
    score,
    percent,
    questions.length,
    correct,
    resultSaved,
  ]);

  // Backup: Call save function when result page loads (if not already saved)
  // This is a fallback in case Submit button didn't trigger save
  useEffect(() => {
    const currentPath = window.location.pathname;
    if (currentPath === "/result" && !resultSaved && !isSubmitting) {
      console.log("📍 Backup: Result page loaded without save, saving now...");
      saveResultToDatabase();
    }
  }, [saveResultToDatabase, resultSaved, isSubmitting]);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Dashboard
              onAdminClick={() => navigate("/admin")}
              user={user}
              onUserLogin={handleUserLogin}
            />
          }
        />

        <Route
          path="/test-selection"
          element={
            <TestSelection
              testSets={testSets}
              loading={loading}
              onSelectTest={handleSelectTest}
              user={user}
              onUserLogin={handleUserLogin}
              onAdminClick={() => navigate("/admin")}
            />
          }
        />

        <Route
          path="/lessons"
          element={
            <LessonsModule isAdmin={isAdmin} />
          }
        />

        <Route
          path="/lessons/:id"
          element={
            <LessonDetail />
          }
        />

        <Route
          path="/certificate"
          element={
            <Certificate />
          }
        />

        <Route
          path="/admin"
          element={
            <AdminLogin
              onLogin={handleAdminLogin}
              onBack={() => navigate("/")}
            />
          }
        />

        <Route
          path="/admin-panel"
          element={
            isAdmin ? (
              <AdminPanel
                testSets={testSets}
                onSave={handleSaveTests}
                onLogout={handleAdminLogout}
                apiUrl={API_URL}
              />
            ) : (
              <TestSelection
                testSets={testSets}
                loading={loading}
                onSelectTest={handleSelectTest}
                onAdminClick={() => navigate("/admin")}
              />
            )
          }
        />

        <Route
          path="/admin-results"
          element={
            isAdmin ? (
              <ResultsView onBack={() => navigate("/admin-panel")} />
            ) : (
              <TestSelection
                testSets={testSets}
                loading={loading}
                onSelectTest={handleSelectTest}
                onAdminClick={() => navigate("/admin")}
              />
            )
          }
        />

        <Route
          path="/test"
          element={
            selectedTestSet && !showReview ? (
              <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
                {/* Warning Banner */}
                <div className="bg-red-600 text-white px-4 py-3 flex items-center justify-center gap-3">
                  <span className="text-xl">⚠️</span>
                  <p className="font-semibold text-sm">
                    Test in progress! Do not close this tab or leave this page
                    until the test is complete.
                  </p>
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all"
                >
                  {sidebarOpen ? (
                    <FaTimes className="text-xl" />
                  ) : (
                    <FaBars className="text-xl" />
                  )}
                </button>

                {/* Overlay for mobile */}
                {sidebarOpen && (
                  <div
                    className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
                    onClick={() => setSidebarOpen(false)}
                  ></div>
                )}

                <div className="flex h-[calc(100vh-52px)]">
                  {/* Left Sidebar - Question Navigation */}
                  <div
                    className={`w-80 bg-white border-r border-gray-200 overflow-y-auto transition-transform duration-300 lg:translate-x-0 ${
                      sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } fixed lg:static inset-y-0 left-0 z-40 lg:z-auto top-[52px]`}
                  >
                    {/* Header */}
                    <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className={`px-3 py-1 rounded-lg font-bold text-sm ${
                            timeLeft < 300
                              ? "bg-red-100 text-red-700 animate-pulse"
                              : timeLeft < 600
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          <FaClock className="inline mr-1" />
                          {formatTime(timeLeft)}
                        </div>
                      </div>
                      <p className="text-gray-700 font-semibold text-sm">
                        {name} {surname}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {selectedTestSet.name}
                      </p>
                    </div>

                    {/* Progress */}
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Progress</span>
                        <span className="font-semibold">
                          {Math.round(((current + 1) / questions.length) * 100)}
                          %
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500"
                          style={{
                            width: `${
                              ((current + 1) / questions.length) * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                      <div className="flex gap-4 mt-3 text-xs">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-green-500 rounded"></div>
                          <span className="text-gray-600">
                            Answered: {answers.filter((a) => a !== null).length}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 bg-gray-300 rounded"></div>
                          <span className="text-gray-600">
                            Unanswered:{" "}
                            {answers.filter((a) => a === null).length}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Question Grid */}
                    <div className="p-4">
                      <p className="text-gray-600 text-xs font-semibold mb-3 uppercase tracking-wide">
                        Questions
                      </p>
                      <div className="grid grid-cols-4 md:grid-cols-5 gap-2.5 md:gap-2">
                        {questions.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setCurrent(index);
                              setSidebarOpen(false);
                            }}
                            className={`relative w-full aspect-square rounded-lg font-bold text-base md:text-sm transition-all touch-manipulation ${
                              index === current
                                ? "bg-blue-600 text-white shadow-md ring-2 ring-blue-300"
                                : answers[index] !== null
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            {index + 1}
                            {bookmarked.includes(index) && (
                              <FaBookmark className="absolute -top-1 -right-1 text-yellow-500 text-sm md:text-xs" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Keyboard Shortcuts */}
                    <div className="p-4 border-t border-gray-200 bg-gray-50">
                      <p className="text-xs font-semibold text-gray-700 mb-2">
                        Keyboard Shortcuts
                      </p>
                      <div className="space-y-1 text-xs text-gray-600">
                        <div className="flex items-center gap-2">
                          <kbd className="px-2 py-0.5 bg-white rounded border border-gray-300">
                            1-4
                          </kbd>
                          <span>Select answer</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <kbd className="px-2 py-0.5 bg-white rounded border border-gray-300">
                            ← →
                          </kbd>
                          <span>Navigate</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <kbd className="px-2 py-0.5 bg-white rounded border border-gray-300">
                            B
                          </kbd>
                          <span>Bookmark</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-4xl mx-auto">
                      {/* Question Card */}
                      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-6">
                        <div className="p-4 md:p-6 border-b border-gray-100">
                          <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 md:w-10 md:h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-bold text-lg md:text-base">
                                  {current + 1}
                                </span>
                              </div>
                              <div>
                                <h3 className="text-base md:text-sm font-semibold text-gray-500">
                                  Question {current + 1} of {questions.length}
                                </h3>
                              </div>
                            </div>
                            <button
                              onClick={() => toggleBookmark(current)}
                              className={`flex items-center gap-2 px-3 py-2 md:px-3 md:py-2 rounded-lg transition-all touch-manipulation ${
                                bookmarked.includes(current)
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                              title="Bookmark this question (Press B)"
                            >
                              {bookmarked.includes(current) ? (
                                <FaBookmark className="text-lg md:text-base" />
                              ) : (
                                <FaRegBookmark className="text-lg md:text-base" />
                              )}
                            </button>
                          </div>
                          <h4 className="text-lg md:text-xl font-bold text-gray-900 leading-relaxed">
                            {questions[current]?.question}
                          </h4>
                        </div>

                        <div className="p-4 md:p-6">
                          <div className="space-y-3 md:space-y-3">
                            {questions[current]?.options.map(
                              (option, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleAnswer(index)}
                                  className={`w-full text-left px-4 py-4 md:px-5 md:py-4 rounded-xl border-2 transition-all duration-200 touch-manipulation ${
                                    answers[current] === index
                                      ? "border-blue-500 bg-blue-50 shadow-md"
                                      : "border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50"
                                  }`}
                                >
                                  <div className="flex items-center gap-3 md:gap-4">
                                    <div
                                      className={`flex-shrink-0 w-10 h-10 md:w-9 md:h-9 rounded-lg flex items-center justify-center font-bold transition-all text-base md:text-sm ${
                                        answers[current] === index
                                          ? "bg-blue-600 text-white"
                                          : "bg-gray-100 text-gray-700"
                                      }`}
                                    >
                                      {String.fromCharCode(65 + index)}
                                    </div>
                                    <span
                                      className={`flex-1 font-medium text-base md:text-base leading-relaxed ${
                                        answers[current] === index
                                          ? "text-gray-900"
                                          : "text-gray-700"
                                      }`}
                                    >
                                      {option}
                                    </span>
                                  </div>
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Navigation Buttons */}
                      <div className="flex flex-col sm:flex-row justify-between gap-3 md:gap-4">
                        <button
                          onClick={handlePrev}
                          disabled={current === 0}
                          className="w-full sm:w-auto px-6 md:px-8 py-4 md:py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2 text-base md:text-base touch-manipulation"
                        >
                          <span className="text-xl md:text-base">←</span>
                          Previous
                        </button>

                        {current === questions.length - 1 ? (
                          <button
                            onClick={handleFinish}
                            className="w-full sm:w-auto px-6 md:px-8 py-4 md:py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-bold transition-all hover:shadow-lg flex items-center justify-center gap-2 text-base md:text-base touch-manipulation"
                          >
                            Review & Submit
                          </button>
                        ) : (
                          <button
                            onClick={handleNext}
                            className="w-full sm:w-auto px-6 md:px-8 py-4 md:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold transition-all hover:shadow-lg flex items-center justify-center gap-2 text-base md:text-base touch-manipulation"
                          >
                            Next
                            <span className="text-xl md:text-base">→</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : showReview && selectedTestSet ? (
              // Review Page - Compact Modern Design
              <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
                <div className="max-w-6xl mx-auto">
                  {/* Compact Header */}
                  <div className="bg-white rounded-xl shadow-md p-6 mb-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">
                          Review Answers
                        </h2>
                        <p className="text-sm text-gray-500">
                          {name} {surname}
                        </p>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
                          <FaClock className="text-blue-600" />
                          <span className="font-bold text-blue-700">
                            {formatTime(timeLeft)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Inline Statistics */}
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
                      <div className="flex flex-wrap justify-center items-center gap-2 bg-green-50 rounded-lg p-3">
                        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                          <FaCheckCircle className="text-white text-sm" />
                        </div>
                        <div>
                          <div className="text-xl font-bold text-green-700">
                            {answers.filter((a) => a !== null).length}
                          </div>
                          <div className="text-xs text-green-600">Answered</div>
                        </div>
                      </div>
                      <div className="flex flex-wrap justify-center items-center gap-2 bg-red-50 rounded-lg p-3">
                        <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                          <FaTimesCircle className="text-white text-sm" />
                        </div>
                        <div>
                          <div className="text-xl font-bold text-red-700">
                            {answers.filter((a) => a === null).length}
                          </div>
                          <div className="text-xs text-red-600">Unanswered</div>
                        </div>
                      </div>
                      <div className="flex flex-wrap justify-center items-center gap-2 bg-yellow-50 rounded-lg p-3">
                        <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                          <FaBookmark className="text-white text-sm" />
                        </div>
                        <div>
                          <div className="text-xl font-bold text-yellow-700">
                            {bookmarked.length}
                          </div>
                          <div className="text-xs text-yellow-600">
                            Bookmarked
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Compact Question Grid */}
                  <div className="bg-white rounded-xl shadow-md p-4 mb-4">
                    <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2 md:gap-2">
                      {questions.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setCurrent(index);
                            setShowReview(false);
                          }}
                          className={`relative aspect-square rounded-md font-bold text-sm md:text-sm transition-all flex items-center justify-center touch-manipulation ${
                            answers[index] !== null
                              ? "bg-green-500 text-white hover:bg-green-600"
                              : "bg-red-500 text-white hover:bg-red-600"
                          }`}
                        >
                          {index + 1}
                          {bookmarked.includes(index) && (
                            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 md:w-2 md:h-2 bg-yellow-400 rounded-full border border-white"></div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Warning & Actions Combined */}
                  <div className="bg-white rounded-xl shadow-md p-6">
                    {answers.filter((a) => a === null).length > 0 && (
                      <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xl font-bold">
                            ⚠️
                          </span>
                        </div>
                        <p className="text-red-800 font-semibold text-sm">
                          You have{" "}
                          <span className="text-lg font-bold">
                            {answers.filter((a) => a === null).length}
                          </span>{" "}
                          unanswered question(s). Click on red numbers to
                          answer.
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => setShowReview(false)}
                        className="flex-1 px-6 py-4 md:py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all flex items-center justify-center gap-2 text-base md:text-base touch-manipulation"
                      >
                        <span className="text-xl md:text-base">←</span> Back to
                        Test
                      </button>
                      <button
                        onClick={handleSubmitTest}
                        disabled={isSubmitting || resultSaved}
                        className={`flex-1 px-6 py-4 md:py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-lg transition-all hover:shadow-lg flex items-center justify-center gap-2 text-base md:text-base touch-manipulation ${
                          isSubmitting || resultSaved
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Submitting...
                          </>
                        ) : (
                          <>
                            Submit Test{" "}
                            <span className="text-xl md:text-base">→</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <TestSelection
                testSets={testSets}
                onSelectTest={handleSelectTest}
                onAdminClick={() => navigate("/admin")}
              />
            )
          }
        />

        <Route
          path="/result"
          element={
            selectedTestSet ? (
              <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-3 md:py-8 px-3 md:px-4">
                <div className="max-w-4xl mx-auto">
                  {/* Header Card - Compact */}
                  <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6 mb-4 md:mb-6 border border-gray-100">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="inline-block bg-blue-50 px-2 md:px-3 py-1 rounded-lg mb-1 md:mb-2">
                          <p className="text-blue-600 text-xs font-semibold truncate">
                            {selectedTestSet?.name}
                          </p>
                        </div>
                        <h1 className="text-lg md:text-2xl font-bold text-gray-900 mb-0.5 md:mb-1 truncate">
                          Results
                        </h1>
                        <p className="text-gray-500 text-xs md:text-sm truncate">
                          {name} {surname}
                        </p>
                      </div>

                      {/* Score Badge - Compact */}
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl md:rounded-2xl flex flex-col items-center justify-center shadow-xl">
                          <div className="text-xl md:text-3xl font-bold text-white">
                            {percent}%
                          </div>
                          <div className="text-[10px] md:text-xs text-blue-100 font-medium">
                            Score
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Tabs */}
                    <div className="lg:hidden flex gap-2 mt-3">
                      <button
                        onClick={() => setResultTab("summary")}
                        className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                          resultTab === "summary"
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-white text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        📊 Summary
                      </button>
                      <button
                        onClick={() => setResultTab("answers")}
                        className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                          resultTab === "answers"
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-white text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        📝 Answers
                      </button>
                      <button
                        onClick={() => setResultTab("chat")}
                        className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                          resultTab === "chat"
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-white text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        💬 AI Help
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-6">
                    {/* Left Column - Stats */}
                    <div
                      className={`lg:col-span-1 space-y-3 md:space-y-4 ${
                        resultTab !== "summary" ? "hidden lg:block" : ""
                      }`}
                    >
                      {/* Performance Card - Compact */}
                      <div className="bg-white rounded-xl shadow-lg p-4 md:p-5 border border-gray-100">
                        <div
                          className={`p-3 md:p-4 rounded-xl text-center mb-3 ${
                            percent >= 80
                              ? "bg-gradient-to-br from-green-500 to-emerald-600"
                              : percent >= 60
                              ? "bg-gradient-to-br from-yellow-500 to-orange-600"
                              : "bg-gradient-to-br from-red-500 to-pink-600"
                          }`}
                        >
                          <div className="text-2xl md:text-4xl mb-1 md:mb-2">
                            {percent >= 80 ? "🏆" : percent >= 60 ? "⭐" : "💪"}
                          </div>
                          <p className="text-white font-bold text-sm md:text-lg">
                            {percent >= 80
                              ? "Excellent!"
                              : percent >= 60
                              ? "Good Job!"
                              : "Keep Practicing!"}
                          </p>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl md:text-3xl font-bold text-gray-900">
                            {Math.round(score)} / 100
                          </div>
                          <p className="text-gray-500 text-xs mt-1">
                            Final Score
                          </p>
                        </div>
                      </div>

                      {/* Stats Grid - Compact */}
                      <div className="grid grid-cols-3 lg:grid-cols-1 gap-2 md:gap-3">
                        <div className="bg-white rounded-lg p-4 border border-gray-200 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                              <FaClipboardList className="text-gray-600" />
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">
                                Total Questions
                              </div>
                              <div className="text-xl font-bold text-gray-900">
                                {questions.length}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg p-4 border border-green-200 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                              <FaCheckCircle className="text-green-600" />
                            </div>
                            <div>
                              <div className="text-xs text-green-600">
                                Correct Answers
                              </div>
                              <div className="text-xl font-bold text-green-600">
                                {correct}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg p-4 border border-red-200 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                              <FaTimesCircle className="text-red-600" />
                            </div>
                            <div>
                              <div className="text-xs text-red-600">
                                Wrong Answers
                              </div>
                              <div className="text-xl font-bold text-red-600">
                                {questions.length - correct}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-3">
                        {resultId && (
                          <button
                            onClick={() => navigate(`/detailed-results/${resultId}`)}
                            className="w-full px-4 py-4 md:py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl transition-all hover:shadow-xl flex items-center justify-center gap-2 text-base md:text-base touch-manipulation"
                          >
                            <FaClipboardList className="text-xl md:text-base" />
                            View Detailed Analysis
                          </button>
                        )}
                        <button
                          onClick={() => setShowAIChatbot(true)}
                          className="w-full px-4 py-4 md:py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all hover:shadow-xl flex items-center justify-center gap-2 text-base md:text-base touch-manipulation"
                        >
                          <FaRobot className="text-xl md:text-base" />
                          Ask AI Teacher
                        </button>
                        <button
                          onClick={handleRetakeTest}
                          className="w-full px-4 py-4 md:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all hover:shadow-xl flex items-center justify-center gap-2 text-base md:text-base touch-manipulation"
                        >
                          <FaRedo className="text-xl md:text-base" />
                          Retake Test
                        </button>
                        <button
                          onClick={() => window.print()}
                          className="w-full px-4 py-4 md:py-3 bg-white border-2 border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-600 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 text-base md:text-base touch-manipulation"
                        >
                          <FaPrint className="text-xl md:text-base" />
                          Print Results
                        </button>
                      </div>
                    </div>

                    {/* Right Column - Answer Review */}
                    <div
                      className={`lg:col-span-2 ${
                        resultTab !== "answers" ? "hidden lg:block" : ""
                      }`}
                    >
                      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-5 py-4 border-b border-gray-200">
                          <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <FaListAlt className="text-blue-600" />
                            Answer Review
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            Review all questions and your answers
                          </p>
                        </div>
                        <div className="p-5 max-h-[600px] overflow-y-auto">
                          <div className="space-y-3">
                            {questions.map((question, index) => {
                              const isCorrect =
                                answers[index] === question.answer;
                              const userAnswer = answers[index];
                              return (
                                <div
                                  key={index}
                                  className={`rounded-xl border-2 overflow-hidden transition-all hover:shadow-md ${
                                    isCorrect
                                      ? "bg-green-50/50 border-green-300"
                                      : "bg-red-50/50 border-red-300"
                                  }`}
                                >
                                  <div className="p-4">
                                    {/* Header */}
                                    <div className="flex items-center gap-2 mb-3">
                                      <div
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                                          isCorrect
                                            ? "bg-green-500 text-white"
                                            : "bg-red-500 text-white"
                                        }`}
                                      >
                                        {index + 1}
                                      </div>
                                      <div className="flex items-center gap-2">
                                        {isCorrect ? (
                                          <FaCheckCircle className="text-green-600" />
                                        ) : (
                                          <FaTimesCircle className="text-red-600" />
                                        )}
                                        <span
                                          className={`font-semibold text-xs ${
                                            isCorrect
                                              ? "text-green-700"
                                              : "text-red-700"
                                          }`}
                                        >
                                          {isCorrect ? "Correct" : "Incorrect"}
                                        </span>
                                      </div>
                                      {bookmarked.includes(index) && (
                                        <FaBookmark className="text-yellow-500 ml-auto" />
                                      )}
                                    </div>

                                    {/* Question */}
                                    <p className="text-gray-900 text-sm font-medium mb-3 leading-relaxed">
                                      {question.question}
                                    </p>

                                    {/* Options */}
                                    <div className="space-y-2">
                                      {question.options.map(
                                        (option, optIndex) => {
                                          const isUserAnswer =
                                            userAnswer === optIndex;
                                          const isCorrectAnswer =
                                            question.answer === optIndex;
                                          return (
                                            <div
                                              key={optIndex}
                                              className={`p-3 rounded-lg border-2 text-sm transition-all ${
                                                isCorrectAnswer
                                                  ? "bg-green-100 border-green-500 font-semibold"
                                                  : isUserAnswer && !isCorrect
                                                  ? "bg-red-100 border-red-500"
                                                  : "bg-white border-gray-200"
                                              }`}
                                            >
                                              <div className="flex items-center gap-2">
                                                <span
                                                  className={`flex-shrink-0 w-5 h-5 rounded flex items-center justify-center font-bold text-xs ${
                                                    isCorrectAnswer
                                                      ? "bg-green-500 text-white"
                                                      : isUserAnswer &&
                                                        !isCorrect
                                                      ? "bg-red-500 text-white"
                                                      : "bg-gray-300 text-gray-600"
                                                  }`}
                                                >
                                                  {String.fromCharCode(
                                                    65 + optIndex
                                                  )}
                                                </span>
                                                <span
                                                  className={`flex-1 ${
                                                    isCorrectAnswer ||
                                                    (isUserAnswer && !isCorrect)
                                                      ? "font-semibold text-gray-900"
                                                      : "text-gray-600"
                                                  }`}
                                                >
                                                  {option}
                                                </span>
                                                {isCorrectAnswer && (
                                                  <FaCheckCircle className="text-green-600 text-xs flex-shrink-0" />
                                                )}
                                                {isUserAnswer && !isCorrect && (
                                                  <FaTimesCircle className="text-red-600 text-xs flex-shrink-0" />
                                                )}
                                              </div>
                                            </div>
                                          );
                                        }
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI Chat Tab - Mobile Only */}
                  {resultTab === "chat" && (
                    <div className="lg:hidden bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                      <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 border-b">
                        <h3 className="font-bold text-white flex items-center gap-2">
                          <FaRobot />
                          AI English Teacher
                        </h3>
                        <p className="text-white/80 text-xs mt-1">
                          Get personalized feedback and tips
                        </p>
                      </div>
                      <div className="p-4">
                        <button
                          onClick={() => setShowAIChatbot(true)}
                          className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all hover:shadow-xl flex items-center justify-center gap-2 touch-manipulation"
                        >
                          <FaRobot className="text-xl" />
                          Open AI Chat
                        </button>
                        <p className="text-center text-gray-500 text-xs mt-3">
                          Ask anything about English grammar, vocabulary, or
                          your test results
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-t border-gray-200 px-6 py-4 mt-6">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                        <FaGraduationCap className="text-white text-sm" />
                      </div>
                      <div className="text-center">
                        <p className="text-gray-700 font-bold text-xs">
                          Miss Nora
                        </p>
                        <p className="text-gray-500 text-xs flex items-center justify-center gap-1.5">
                          <FaUserTie className="text-xs" />
                          Nurmuhammadov Hasanboy
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <TestSelection
                testSets={testSets}
                onSelectTest={handleSelectTest}
                onAdminClick={() => navigate("/admin")}
              />
            )
          }
        />

        <Route
          path="/detailed-results/:id"
          element={
            <DetailedResults onBack={() => navigate("/result")} />
          }
        />
      </Routes>
      <ToastContainer />

      {/* AI Chatbot */}
      <AIChatbot
        isOpen={showAIChatbot}
        onClose={() => setShowAIChatbot(false)}
        testContext={
          testResults ||
          (selectedTestSet && {
            testName: selectedTestSet.name,
            score: score,
            percentage: percent,
            totalQuestions: questions.length,
            correctAnswers: correct,
            wrongAnswers: questions.length - correct,
          })
        }
      />
    </>
  );
}

export default App;
