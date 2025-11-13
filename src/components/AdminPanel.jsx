import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaBook,
  FaPlus,
  FaEdit,
  FaTrash,
  FaCheck,
  FaSignOutAlt,
  FaClock,
  FaQuestionCircle,
  FaSave,
  FaTimes,
  FaListOl,
  FaCheckCircle,
  FaRobot,
  FaEye,
  FaCertificate,
  FaMedal,
  FaDownload,
  FaAward,
} from "react-icons/fa";
import AITestGenerator from "./AITestGenerator";
import CreateLesson from "./CreateLesson";
import jsPDF from "jspdf";

function AdminPanel({ testSets, onSave, onLogout, apiUrl }) {
  const navigate = useNavigate();
  const [tests, setTests] = useState(testSets);

  // Sync with parent state
  useEffect(() => {
    setTests(testSets);
  }, [testSets]);
  const [editingTest, setEditingTest] = useState(null);
  const [showNewTestForm, setShowNewTestForm] = useState(false);

  // New test form
  const [newTestName, setNewTestName] = useState("");
  const [newTestDesc, setNewTestDesc] = useState("");
  const [newTestDuration, setNewTestDuration] = useState(45);

  // Question form
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [showAIGenerator, setShowAIGenerator] = useState(false);

  // Mobile state - collapsible sections
  const [showTestList, setShowTestList] = useState(true);
  const [showQuestionForm, setShowQuestionForm] = useState(true);

  // Mobile tab state
  const [adminTab, setAdminTab] = useState("tests"); // tests, questions, ai, lessons, certificate

  // Lessons state
  const [lessons, setLessons] = useState([]);
  const [showCreateLesson, setShowCreateLesson] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);

  // Certificate state
  const [studentName, setStudentName] = useState("");
  const [courseName, setCourseName] = useState("English Language Course");
  const [completionDate, setCompletionDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [grade, setGrade] = useState("Excellent");
  const [showCertificatePreview, setShowCertificatePreview] = useState(false);

  // Pagination for lessons
  const [currentLessonPage, setCurrentLessonPage] = useState(1);
  const lessonsPerPage = 6; // 3x2 grid on desktop

  // Fetch lessons on mount
  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      const response = await fetch(`${apiUrl}/lessons`);
      if (response.ok) {
        const data = await response.json();
        setLessons(data.lessons || []);
      }
    } catch (error) {
      console.log("No lessons found");
    }
  };

  const handleSaveLesson = async (savedLesson) => {
    if (editingLesson) {
      // Update existing lesson in the list
      setLessons(
        lessons.map((l) => (l.id === savedLesson.id ? savedLesson : l))
      );
      toast.success("Lesson updated successfully!");
    } else {
      // Add new lesson to the list
      setLessons([...lessons, savedLesson]);
      toast.success("Lesson created successfully!");
      // Reset to first page when adding new lesson
      setCurrentLessonPage(1);
    }
    setShowCreateLesson(false);
    setEditingLesson(null);

    // Refresh lessons from server to ensure sync
    await fetchLessons();
  };

  const handleEditLesson = (lesson) => {
    setEditingLesson(lesson);
    setShowCreateLesson(true);
    setAdminTab("lessons"); // Ensure we're on lessons tab when editing
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;

    try {
      const response = await fetch(`${apiUrl}/lessons/${lessonId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const updatedLessons = lessons.filter((l) => l.id !== lessonId);
        setLessons(updatedLessons);
        toast.success("Lesson deleted successfully!");

        // Adjust page if current page becomes empty
        const newTotalPages = Math.ceil(updatedLessons.length / lessonsPerPage);
        if (currentLessonPage > newTotalPages && newTotalPages > 0) {
          setCurrentLessonPage(newTotalPages);
        }
      } else {
        toast.error("Failed to delete lesson");
      }
    } catch (error) {
      toast.error("Error deleting lesson");
    }
  };

  // Pagination for lessons
  const indexOfLastLesson = currentLessonPage * lessonsPerPage;
  const indexOfFirstLesson = indexOfLastLesson - lessonsPerPage;
  const currentLessons = lessons.slice(indexOfFirstLesson, indexOfLastLesson);
  const totalLessonPages = Math.ceil(lessons.length / lessonsPerPage);

  const handleLessonPageChange = (pageNumber) => {
    setCurrentLessonPage(pageNumber);
  };

  // Certificate PDF Generator with Modern Design
  const generateCertificatePDF = () => {
    if (!studentName.trim()) {
      toast.error("Please enter student name!");
      return;
    }

    try {
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Use Helvetica font which is closest to Space Grotesk in jsPDF built-in fonts
      // Set as default font for entire document
      doc.setFont("helvetica", "normal");
      
      // Modern gradient-style background (simulated with rectangles)
      doc.setFillColor(249, 250, 251);
      doc.rect(0, 0, pageWidth, pageHeight, "F");

      // Decorative border - Modern style
      doc.setDrawColor(59, 130, 246); // Blue
      doc.setLineWidth(3);
      doc.rect(8, 8, pageWidth - 16, pageHeight - 16);

      doc.setDrawColor(147, 51, 234); // Purple
      doc.setLineWidth(1);
      doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

      // Top decorative elements
      doc.setFillColor(59, 130, 246);
      doc.circle(pageWidth / 2 - 60, 25, 3, "F");
      doc.circle(pageWidth / 2 + 60, 25, 3, "F");

      // Certificate of Achievement Title
      doc.setFontSize(18);
      doc.setTextColor(107, 114, 128);
      doc.setFont("helvetica", "normal");
      // Add letter spacing effect by adding spaces
      const certText = "C E R T I F I C A T E";
      doc.text(certText, pageWidth / 2, 35, { align: "center" });

      doc.setFontSize(54);
      doc.setTextColor(37, 99, 235);
      doc.setFont("helvetica", "bold");
      doc.text("of Excellence", pageWidth / 2, 52, { align: "center" });

      // Decorative line
      doc.setDrawColor(59, 130, 246);
      doc.setLineWidth(0.5);
      doc.line(70, 60, pageWidth - 70, 60);

      // Awarded to
      doc.setFontSize(14);
      doc.setTextColor(75, 85, 99);
      doc.setFont("helvetica", "normal");
      doc.text("This certificate is proudly presented to", pageWidth / 2, 75, {
        align: "center",
      });

      // Student Name with underline
      doc.setFontSize(38);
      doc.setTextColor(30, 58, 138);
      doc.setFont("helvetica", "bold");
      doc.text(studentName, pageWidth / 2, 92, { align: "center" });

      // Underline for name
      const nameWidth = doc.getTextWidth(studentName);
      doc.setDrawColor(59, 130, 246);
      doc.setLineWidth(0.8);
      doc.line(
        pageWidth / 2 - nameWidth / 2 - 5,
        95,
        pageWidth / 2 + nameWidth / 2 + 5,
        95
      );

      // Achievement text
      doc.setFontSize(13);
      doc.setTextColor(75, 85, 99);
      doc.setFont("helvetica", "normal");
      doc.text(
        "for successfully completing the comprehensive",
        pageWidth / 2,
        108,
        { align: "center" }
      );

      // Course name
      doc.setFontSize(24);
      doc.setTextColor(147, 51, 234);
      doc.setFont("helvetica", "bold");
      doc.text(courseName, pageWidth / 2, 122, { align: "center" });

      // Performance badge
      doc.setFontSize(13);
      doc.setTextColor(75, 85, 99);
      doc.setFont("helvetica", "normal");
      doc.text(
        `demonstrating ${grade} performance throughout the course`,
        pageWidth / 2,
        135,
        { align: "center" }
      );

      // Date
      doc.setFontSize(12);
      doc.setTextColor(107, 114, 128);
      doc.setFont("helvetica", "normal");
      const dateStr = new Date(completionDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      doc.text(`Date of Completion: ${dateStr}`, pageWidth / 2, 148, {
        align: "center",
      });

      // Signature section
      const signatureY = 168;

      // Left signature (Teacher)
      doc.setDrawColor(107, 114, 128);
      doc.line(40, signatureY, 95, signatureY);
      doc.setFontSize(12);
      doc.setTextColor(75, 85, 99);
      doc.setFont("helvetica", "bold");
      doc.text("Miss Nora", 67.5, signatureY - 8, { align: "center" });
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("English Teacher", 67.5, signatureY + 6, { align: "center" });

      // Center seal
      doc.setDrawColor(234, 179, 8);
      doc.setFillColor(254, 249, 195);
      doc.setLineWidth(2);
      doc.circle(pageWidth / 2, signatureY, 18, "FD");

      doc.setDrawColor(234, 179, 8);
      doc.setLineWidth(1);
      doc.circle(pageWidth / 2, signatureY, 14, "D");

      doc.setFontSize(11);
      doc.setTextColor(161, 98, 7);
      doc.setFont("helvetica", "bold");
      doc.text("VERIFIED", pageWidth / 2, signatureY - 2, { align: "center" });
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text("CERTIFICATE", pageWidth / 2, signatureY + 4, {
        align: "center",
      });

      // Right signature (Director)
      doc.setDrawColor(107, 114, 128);
      doc.line(pageWidth - 95, signatureY, pageWidth - 40, signatureY);
      doc.setFontSize(12);
      doc.setTextColor(75, 85, 99);
      doc.setFont("helvetica", "bold");
      doc.text("N. Hasanboy", pageWidth - 67.5, signatureY - 8, {
        align: "center",
      });
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Program Director", pageWidth - 67.5, signatureY + 6, {
        align: "center",
      });

      // Footer
      doc.setFontSize(10);
      doc.setTextColor(156, 163, 175);
      doc.setFont("helvetica", "normal");
      doc.text(
        "English Learning Platform - Empowering Language Excellence Since 2024",
        pageWidth / 2,
        pageHeight - 12,
        { align: "center" }
      );

      // Bottom decorative elements
      doc.setFillColor(147, 51, 234);
      doc.circle(pageWidth / 2 - 60, pageHeight - 18, 2, "F");
      doc.circle(pageWidth / 2 + 60, pageHeight - 18, 2, "F");

      // Save PDF
      const fileName = `${studentName.replace(/\s+/g, "_")}_Certificate.pdf`;
      doc.save(fileName);
      toast.success("🎉 Certificate generated successfully!");
    } catch (error) {
      console.error("PDF Generation Error:", error);
      toast.error("Failed to generate certificate: " + error.message);
    }
  };

  // Save test helper function
  const handleSaveTest = async (testToSave) => {
    try {
      const response = await fetch(`${apiUrl}/tests/${testToSave.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testToSave),
      });

      if (!response.ok) throw new Error("Failed to save test");

      const savedTest = await response.json();
      const updatedTests = tests.map((t) =>
        t.id === savedTest.id ? savedTest : t
      );

      setTests(updatedTests);
      onSave(updatedTests);
      setEditingTest(savedTest);
      toast.success("Test saved successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save test");
    }
  };

  const handleAIQuestionsGenerated = (aiQuestions) => {
    // Add unique IDs to AI generated questions
    const questionsWithIds = aiQuestions.map((q) => ({
      ...q,
      id: `q-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }));

    // If no test is being edited, add questions to the current editing test
    if (!editingTest || !editingTest.id) {
      toast.info("Please create a test first, then add AI questions");
      setShowAIGenerator(false);
      return;
    }

    // Update test with new questions
    const updatedTest = {
      ...editingTest,
      questions: [...(editingTest.questions || []), ...questionsWithIds],
    };

    handleSaveTest(updatedTest);
    setShowAIGenerator(false);
  };

  const handleCreateTest = async () => {
    if (!newTestName.trim()) return;

    const newTest = {
      id: `test-${Date.now()}`,
      name: newTestName,
      description: newTestDesc,
      duration: newTestDuration,
      questions: [],
    };

    try {
      const response = await fetch(`${apiUrl}/tests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTest),
      });

      if (!response.ok) throw new Error("Failed to create test");

      const savedTest = await response.json();
      const updatedTests = [...tests, savedTest];
      setTests(updatedTests);
      onSave(updatedTests);
      toast.success("Test created successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create test");
      return;
    }

    setShowNewTestForm(false);
    setNewTestName("");
    setNewTestDesc("");
    setNewTestDuration(45);
  };

  const handleDeleteTest = async (testId) => {
    if (!window.confirm("Are you sure you want to delete this test?")) return;

    try {
      const response = await fetch(`${apiUrl}/tests/${testId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete test");

      const updatedTests = tests.filter((t) => t.id !== testId);
      setTests(updatedTests);
      onSave(updatedTests);
      if (editingTest?.id === testId) {
        setEditingTest(null);
      }
      toast.success("Test deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete test");
    }
  };

  const handleAddQuestion = async () => {
    if (!questionText.trim() || options.some((opt) => !opt.trim())) {
      toast.error("Please fill all fields!");
      return;
    }

    const newQuestion = {
      id: Date.now(),
      question: questionText,
      options: options,
      answer: correctAnswer,
    };

    const updatedTest = {
      id: editingTest.id,
      name: editingTest.name,
      description: editingTest.description,
      duration: editingTest.duration,
      questions: [...(editingTest.questions || []), newQuestion],
    };

    try {
      const response = await fetch(`${apiUrl}/tests/${editingTest.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTest),
      });

      if (!response.ok) throw new Error("Failed to add question");

      const savedTest = await response.json();
      const updatedTests = tests.map((t) =>
        t.id === savedTest.id ? savedTest : t
      );
      setTests(updatedTests);
      onSave(updatedTests);
      setEditingTest(savedTest);
      toast.success("Question added successfully!");

      // Reset form
      setQuestionText("");
      setOptions(["", "", "", ""]);
      setCorrectAnswer(0);
    } catch (error) {
      console.error(error);
      toast.error("Failed to add question");
    }
  };

  const handleUpdateQuestion = async () => {
    if (!questionText.trim() || options.some((opt) => !opt.trim())) {
      toast.error("Please fill all fields!");
      return;
    }

    const updatedTest = {
      id: editingTest.id,
      name: editingTest.name,
      description: editingTest.description,
      duration: editingTest.duration,
      questions: editingTest.questions.map((q) =>
        q.id === editingQuestion.id
          ? { ...q, question: questionText, options, answer: correctAnswer }
          : q
      ),
    };

    try {
      const response = await fetch(`${apiUrl}/tests/${editingTest.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTest),
      });

      if (!response.ok) throw new Error("Failed to update question");

      const savedTest = await response.json();
      const updatedTests = tests.map((t) =>
        t.id === savedTest.id ? savedTest : t
      );

      setTests(updatedTests);
      onSave(updatedTests);
      setEditingTest(savedTest);
      setEditingQuestion(null);
      setQuestionText("");
      setOptions(["", "", "", ""]);
      setCorrectAnswer(0);
      toast.success("Question updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update question");
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm("Are you sure you want to delete this question?"))
      return;

    const updatedTest = {
      id: editingTest.id,
      name: editingTest.name,
      description: editingTest.description,
      duration: editingTest.duration,
      questions: editingTest.questions.filter((q) => q.id !== questionId),
    };

    try {
      const response = await fetch(`${apiUrl}/tests/${editingTest.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTest),
      });

      if (!response.ok) throw new Error("Failed to delete question");

      const savedTest = await response.json();
      const updatedTests = tests.map((t) =>
        t.id === savedTest.id ? savedTest : t
      );
      setTests(updatedTests);
      onSave(updatedTests);
      setEditingTest(savedTest);
      toast.success("Question deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete question");
    }
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setQuestionText(question.question);
    setOptions([...question.options]);
    setCorrectAnswer(question.answer);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-3 md:p-6">
        {/* Header - Professional & Compact */}
        <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 rounded-xl md:rounded-2xl shadow-2xl p-4 md:p-6 mb-4 md:mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                <FaBook className="text-white text-lg md:text-xl" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">
                  Admin Panel
                </h1>
                <p className="text-blue-100 text-xs md:text-sm font-medium">
                  Manage tests, lessons & questions
                </p>
              </div>
            </div>

            {/* Desktop Tabs */}
            <div className="hidden lg:flex gap-2 bg-white/10 backdrop-blur-sm rounded-xl p-1.5">
              <button
                onClick={() => setAdminTab("tests")}
                className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                  adminTab === "tests"
                    ? "bg-white text-indigo-600 shadow-md"
                    : "text-white/80 hover:bg-white/10"
                }`}
              >
                📚 Tests
              </button>
              <button
                onClick={() => {
                  setAdminTab("lessons");
                  setEditingTest(null);
                  fetchLessons(); // Refresh lessons when tab is clicked
                }}
                className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                  adminTab === "lessons"
                    ? "bg-white text-indigo-600 shadow-md"
                    : "text-white/80 hover:bg-white/10"
                }`}
              >
                📖 Lessons
              </button>
              <button
                onClick={() => {
                  setAdminTab("certificate");
                  setEditingTest(null);
                }}
                className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                  adminTab === "certificate"
                    ? "bg-white text-indigo-600 shadow-md"
                    : "text-white/80 hover:bg-white/10"
                }`}
              >
                🎓 Certificate
              </button>
            </div>

            <div className="flex gap-2 w-full sm:w-auto lg:w-auto">
              <button
                onClick={() => (window.location.href = "/admin-results")}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white/95 hover:bg-white text-indigo-600 px-4 md:px-5 py-2 md:py-2.5 rounded-lg md:rounded-xl font-bold transition-all hover:shadow-xl text-sm"
              >
                <FaCheckCircle className="text-base" />
                <span>Results</span>
              </button>
              <button
                onClick={onLogout}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white/95 hover:bg-white text-indigo-600 px-4 md:px-5 py-2 md:py-2.5 rounded-lg md:rounded-xl font-bold transition-all hover:shadow-xl text-sm"
              >
                <FaSignOutAlt className="text-base" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Mobile Tabs */}
          <div className="lg:hidden mt-4 flex gap-2 bg-white/10 backdrop-blur-sm rounded-xl p-1.5">
            <button
              onClick={() => setAdminTab("tests")}
              className={`flex-1 py-2.5 rounded-lg font-semibold text-xs transition-all ${
                adminTab === "tests"
                  ? "bg-white text-indigo-600 shadow-md"
                  : "text-white/80 hover:bg-white/10"
              }`}
            >
              📚 Tests
            </button>
            <button
              onClick={() => {
                setAdminTab("lessons");
                setEditingTest(null); // Clear editing test when switching to lessons
                fetchLessons(); // Refresh lessons when tab is clicked
              }}
              className={`flex-1 py-2.5 rounded-lg font-semibold text-xs transition-all ${
                adminTab === "lessons"
                  ? "bg-white text-indigo-600 shadow-md"
                  : "text-white/80 hover:bg-white/10"
              }`}
            >
              📖 Lessons
            </button>
            <button
              onClick={() => setAdminTab("questions")}
              className={`flex-1 py-2.5 rounded-lg font-semibold text-xs transition-all ${
                adminTab === "questions"
                  ? "bg-white text-indigo-600 shadow-md"
                  : "text-white/80 hover:bg-white/10"
              }`}
              disabled={!editingTest}
            >
              ❓ Questions
            </button>
            <button
              onClick={() => setAdminTab("ai")}
              className={`flex-1 py-2.5 rounded-lg font-semibold text-xs transition-all ${
                adminTab === "ai"
                  ? "bg-white text-indigo-600 shadow-md"
                  : "text-white/80 hover:bg-white/10"
              }`}
              disabled={!editingTest}
            >
              🤖 AI
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5">
          {/* Left: Test List - Only show when Tests tab is active */}
          {adminTab === "tests" && (
            <div className="lg:col-span-4 bg-white rounded-xl shadow-lg border border-gray-100">
              {/* Header */}
              <div
                className="flex justify-between items-center p-4 border-b border-gray-200 cursor-pointer lg:cursor-default"
                onClick={() => setShowTestList(!showTestList)}
              >
                <h2 className="text-base md:text-lg font-bold text-gray-900 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                    <FaBook className="text-white text-sm" />
                  </div>
                  <span>Tests ({tests.length})</span>
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowNewTestForm(true);
                      setShowTestList(true);
                    }}
                    className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-3 py-2 rounded-lg font-semibold transition-all text-xs shadow-md hover:shadow-lg"
                  >
                    <FaPlus className="text-xs" />
                    <span className="hidden sm:inline">New</span>
                  </button>
                  <div className="lg:hidden">{showTestList ? "▼" : "▶"}</div>
                </div>
              </div>

              {/* Collapsible Content */}
              <div
                className={`${
                  showTestList ? "block" : "hidden lg:block"
                } p-3 md:p-4`}
              >
                {showNewTestForm && (
                  <div className="mb-4 p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg border border-indigo-200 shadow-sm">
                    <h3 className="text-gray-900 font-bold text-sm mb-3 flex items-center gap-2">
                      <div className="w-6 h-6 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <FaPlus className="text-white text-xs" />
                      </div>
                      Create New Test
                    </h3>
                    <div className="space-y-2.5">
                      <div>
                        <label className="block text-gray-700 font-semibold mb-1.5 text-xs">
                          Test Name *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., Intermediate Level"
                          value={newTestName}
                          onChange={(e) => setNewTestName(e.target.value)}
                          className="w-full px-3 py-2 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-gray-900 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-1.5 text-xs">
                          Description
                        </label>
                        <input
                          type="text"
                          placeholder="Brief description"
                          value={newTestDesc}
                          onChange={(e) => setNewTestDesc(e.target.value)}
                          className="w-full px-3 py-2 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-gray-900 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-1.5 text-xs">
                          Duration (minutes) *
                        </label>
                        <input
                          type="number"
                          placeholder="45"
                          value={newTestDuration}
                          onChange={(e) =>
                            setNewTestDuration(parseInt(e.target.value))
                          }
                          className="w-full px-3 py-2 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-gray-900 text-sm"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={handleCreateTest}
                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white py-2.5 rounded-lg font-semibold transition-all hover:shadow-lg text-sm"
                      >
                        <FaCheck className="text-xs" />
                        Create
                      </button>
                      <button
                        onClick={() => setShowNewTestForm(false)}
                        className="px-4 flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 py-2.5 rounded-lg font-semibold transition-all text-sm border-2 border-gray-300"
                      >
                        <FaTimes className="text-xs" />
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-2 max-h-[calc(100vh-400px)] overflow-y-auto pr-1">
                  {tests.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <FaBook className="text-3xl mx-auto mb-2 opacity-50" />
                      <p className="text-xs">No tests yet</p>
                      <p className="text-[10px] mt-1">Click "New" to create</p>
                    </div>
                  )}
                  {tests.map((test) => (
                    <div
                      key={test.id}
                      className={`group p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                        editingTest?.id === test.id
                          ? "bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-400 shadow-sm"
                          : "bg-white border-gray-200 hover:border-indigo-300"
                      }`}
                      onClick={() => setEditingTest(test)}
                    >
                      <div className="flex justify-between items-start mb-1.5">
                        <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2 flex-1">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              editingTest?.id === test.id
                                ? "bg-indigo-600"
                                : "bg-gray-300"
                            }`}
                          ></div>
                          <span className="line-clamp-1">{test.name}</span>
                        </h3>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTest(test.id);
                          }}
                          className="p-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-all opacity-0 group-hover:opacity-100"
                          title="Delete"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      </div>
                      {test.description && (
                        <p className="text-xs text-gray-500 mb-1.5 line-clamp-1">
                          {test.description}
                        </p>
                      )}
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="flex items-center gap-1 bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-200">
                          <FaQuestionCircle className="text-[10px]" />
                          <span className="font-semibold">
                            {test.questions.length}
                          </span>
                        </span>
                        <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                          <FaClock className="text-[10px]" />
                          <span className="font-semibold">
                            {test.duration}m
                          </span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Right: Questions and Form Combined */}
          {editingTest && adminTab === "tests" && (
            <div
              className={`lg:col-span-8 bg-white rounded-xl shadow-lg border border-gray-100 ${
                adminTab === "tests" ? "hidden lg:block" : ""
              }`}
            >
              <div className="flex justify-between items-start p-4 md:p-5 border-b border-gray-200">
                <div className="flex-1 min-w-0">
                  <h2 className="text-base md:text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                    <div className="w-7 h-7 md:w-9 md:h-9 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
                      <FaQuestionCircle className="text-white text-xs md:text-sm" />
                    </div>
                    <span className="truncate text-sm md:text-base">
                      {editingTest.name}
                    </span>
                  </h2>
                  <p className="text-xs text-gray-500 ml-9 md:ml-11">
                    {editingTest.questions.length} questions •{" "}
                    {editingTest.duration} min
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {editingTest.questions.length}
                  </div>
                  <div className="text-xs text-gray-500">Total Questions</div>
                </div>
              </div>

              {/* Test Questions Section - Only show when editing test */}
              {editingTest && (
                <>
                  {/* AI Test Generator - Full Width When Open */}
                  {showAIGenerator && (
                    <div className="mb-5">
                      <AITestGenerator
                        onQuestionsGenerated={handleAIQuestionsGenerated}
                      />
                    </div>
                  )}

                  <div className="grid lg:grid-cols-2 gap-5">
                    {/* Questions List */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <button
                          onClick={() => setShowAIGenerator(!showAIGenerator)}
                          className="px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold text-sm transition-all hover:shadow-lg flex items-center gap-2"
                        >
                          <FaRobot />
                          {showAIGenerator
                            ? "Hide AI Generator"
                            : "Generate with AI"}
                        </button>
                        <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                          <FaListOl className="text-purple-600 text-sm" />
                          Questions List
                        </h3>
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-semibold">
                          {editingTest.questions.length} total
                        </span>
                      </div>
                    <div className="space-y-2 max-h-[calc(100vh-350px)] overflow-y-auto pr-2">
                      {editingTest.questions.length === 0 && (
                        <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                          <FaQuestionCircle className="text-3xl mx-auto mb-2 opacity-50" />
                          <p className="text-xs">No questions added yet</p>
                        </div>
                      )}
                      {editingTest.questions.map((q, index) => (
                        <div
                          key={q.id}
                          className="group p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-sm transition-all"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="flex items-center gap-1.5 font-bold text-purple-600 text-xs">
                              <span className="w-5 h-5 bg-purple-100 rounded flex items-center justify-center">
                                {index + 1}
                              </span>
                            </span>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleEditQuestion(q)}
                                className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-all"
                                title="Edit Question"
                              >
                                <FaEdit className="text-xs" />
                              </button>
                              <button
                                onClick={() => handleDeleteQuestion(q.id)}
                                className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-all"
                                title="Delete Question"
                              >
                                <FaTrash className="text-xs" />
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-gray-900 font-medium mb-2 line-clamp-2">
                            {q.question}
                          </p>
                          <div className="space-y-1">
                            {q.options.map((opt, i) => (
                              <div
                                key={i}
                                className={`text-xs px-2 py-1 rounded flex items-center gap-1.5 ${
                                  i === q.answer
                                    ? "bg-green-50 text-green-700 font-semibold border border-green-300"
                                    : "bg-white text-gray-500 border border-gray-200"
                                }`}
                              >
                                {i === q.answer && (
                                  <FaCheckCircle className="text-green-600 flex-shrink-0" />
                                )}
                                <span className="font-bold mr-1">
                                  {String.fromCharCode(65 + i)})
                                </span>
                                <span className="flex-1">{opt}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Add/Edit Question Form - Collapsible on Mobile */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <div
                      className="flex justify-between items-center p-4 cursor-pointer md:cursor-default"
                      onClick={() => setShowQuestionForm(!showQuestionForm)}
                    >
                      <h3 className="text-sm md:text-base font-bold text-gray-800 flex items-center gap-2">
                        {editingQuestion ? (
                          <>
                            <div className="w-6 h-6 md:w-7 md:h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                              <FaEdit className="text-white text-xs" />
                            </div>
                            <span className="text-xs md:text-sm">
                              Edit Question
                            </span>
                          </>
                        ) : (
                          <>
                            <div className="w-6 h-6 md:w-7 md:h-7 bg-green-600 rounded-lg flex items-center justify-center">
                              <FaPlus className="text-white text-xs" />
                            </div>
                            <span className="text-xs md:text-sm">
                              Add Question
                            </span>
                          </>
                        )}
                      </h3>
                      <div className="md:hidden">
                        {showQuestionForm ? "▼" : "▶"}
                      </div>
                    </div>

                    <div
                      className={`${
                        showQuestionForm ? "block" : "hidden md:block"
                      } p-4 pt-0 md:pt-4`}
                    >
                      <div className="space-y-3">
                        <div>
                          <label className="flex items-center gap-1.5 text-gray-700 font-semibold mb-2 text-sm md:text-xs">
                            <FaQuestionCircle className="text-blue-600 text-sm md:text-xs" />
                            Question Text *
                          </label>
                          <textarea
                            value={questionText}
                            onChange={(e) => setQuestionText(e.target.value)}
                            className="w-full px-4 py-3 md:px-3 md:py-2 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none text-gray-900 text-base md:text-sm transition-all touch-manipulation"
                            rows="4"
                            placeholder="Type your question here..."
                          />
                        </div>

                        <div>
                          <label className="flex items-center gap-1.5 text-gray-700 font-semibold mb-3 text-sm md:text-xs">
                            <FaListOl className="text-purple-600 text-sm md:text-xs" />
                            Answer Options *
                          </label>
                          {options.map((opt, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-3 mb-3"
                            >
                              <input
                                type="radio"
                                name="correct"
                                checked={correctAnswer === index}
                                onChange={() => setCorrectAnswer(index)}
                                className="w-5 h-5 md:w-4 md:h-4 cursor-pointer accent-green-600 flex-shrink-0 touch-manipulation"
                                title="Mark as correct answer"
                              />
                              <div className="flex-1 relative">
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-7 h-7 md:w-6 md:h-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded flex items-center justify-center shadow-sm z-10">
                                  <span className="font-bold text-blue-700 text-sm md:text-xs">
                                    {String.fromCharCode(65 + index)}
                                  </span>
                                </div>
                                <input
                                  type="text"
                                  value={opt}
                                  onChange={(e) => {
                                    const newOpts = [...options];
                                    newOpts[index] = e.target.value;
                                    setOptions(newOpts);
                                  }}
                                  className={`w-full pl-12 md:pl-10 pr-4 py-3 md:py-2 bg-white border-2 rounded-lg focus:outline-none focus:ring-2 transition-all text-gray-900 text-base md:text-sm touch-manipulation ${
                                    correctAnswer === index
                                      ? "border-green-400 focus:border-green-500 focus:ring-green-100 bg-green-50 font-semibold"
                                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
                                  }`}
                                  placeholder={`Enter option ${String.fromCharCode(
                                    65 + index
                                  )}`}
                                />
                              </div>
                            </div>
                          ))}
                          <div className="bg-green-50 border border-green-200 rounded-lg p-2 mt-2 flex items-center gap-2">
                            <FaCheckCircle className="text-green-600 text-xs" />
                            <p className="text-green-700 text-xs font-medium">
                              Click radio button to mark the correct answer
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4 pt-3 border-t border-blue-200">
                          {editingQuestion ? (
                            <>
                              <button
                                onClick={handleUpdateQuestion}
                                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 md:py-2.5 rounded-lg font-semibold transition-all hover:shadow-lg hover:scale-105 text-base md:text-sm touch-manipulation"
                              >
                                <FaSave className="text-sm md:text-xs" />
                                Save Changes
                              </button>
                              <button
                                onClick={() => {
                                  setEditingQuestion(null);
                                  setQuestionText("");
                                  setOptions(["", "", "", ""]);
                                  setCorrectAnswer(0);
                                }}
                                className="px-4 flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 py-3 md:py-2.5 rounded-lg font-semibold transition-all text-base md:text-sm border-2 border-gray-300 hover:border-gray-400 touch-manipulation"
                              >
                                <FaTimes className="text-sm md:text-xs" />
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={handleAddQuestion}
                              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 md:py-2.5 rounded-lg font-semibold transition-all hover:shadow-lg hover:scale-105 text-base md:text-sm touch-manipulation"
                            >
                              <FaPlus className="text-sm md:text-xs" />
                              Add Question
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                </>
              )}
            </div>
          )}

          {/* Mobile Lessons Section */}
          {adminTab === "lessons" && (
            <div className="lg:hidden bg-white rounded-xl shadow-lg border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  Manage Lessons
                  {lessons.length > 0 && (
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      ({lessons.length})
                    </span>
                  )}
                </h3>
                <button
                  onClick={() => setShowCreateLesson(true)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg flex items-center gap-2"
                >
                  <FaPlus />
                  New Lesson
                </button>
              </div>
              <div className="space-y-3 mb-4">
                {lessons.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No lessons yet. Create your first lesson!
                  </p>
                ) : (
                  currentLessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900">
                            {lesson.title}
                          </h4>
                          <p className="text-sm text-gray-600 line-clamp-1">
                            {lesson.description}
                          </p>
                          <div className="flex items-center gap-3 mt-2 text-xs">
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">
                              {lesson.level}
                            </span>
                            <span className="text-gray-600">
                              {lesson.category}
                            </span>
                            <span className="text-gray-500">
                              {lesson.duration}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/lessons/${lesson.id}`)}
                            className="p-2 bg-green-100 hover:bg-green-200 text-green-600 rounded-lg"
                            title="View Lesson"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => handleEditLesson(lesson)}
                            className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg"
                            title="Edit Lesson"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteLesson(lesson.id)}
                            className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg"
                            title="Delete Lesson"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Mobile Pagination */}
              {lessons.length > lessonsPerPage && (
                <div className="flex justify-center items-center gap-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() =>
                      handleLessonPageChange(currentLessonPage - 1)
                    }
                    disabled={currentLessonPage === 1}
                    className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                      currentLessonPage === 1
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-purple-600 text-white hover:bg-purple-700"
                    }`}
                  >
                    Prev
                  </button>

                  <span className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg font-semibold text-sm">
                    {currentLessonPage} / {totalLessonPages}
                  </span>

                  <button
                    onClick={() =>
                      handleLessonPageChange(currentLessonPage + 1)
                    }
                    disabled={currentLessonPage === totalLessonPages}
                    className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                      currentLessonPage === totalLessonPages
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-purple-600 text-white hover:bg-purple-700"
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Desktop Lessons Section */}
          {adminTab === "lessons" && (
            <div className="hidden lg:block lg:col-span-12 bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <FaBook className="text-purple-600" />
                  Manage Lessons
                  {lessons.length > 0 && (
                    <span className="text-sm font-normal text-gray-500">
                      ({lessons.length} total)
                    </span>
                  )}
                </h3>
                <button
                  onClick={() => {
                    setEditingLesson(null);
                    setShowCreateLesson(true);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-lg flex items-center gap-2 transition-all"
                >
                  <FaPlus />
                  New Lesson
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {lessons.length === 0 ? (
                  <div className="col-span-2 text-gray-500 text-center py-12 bg-gray-50 rounded-lg">
                    <FaBook className="text-4xl mx-auto mb-3 text-gray-400" />
                    <p>No lessons yet. Create your first lesson!</p>
                  </div>
                ) : (
                  currentLessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-4 border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 mb-1">
                            {lesson.title}
                          </h4>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                            {lesson.description}
                          </p>
                          <div className="flex items-center gap-2 flex-wrap text-xs">
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded font-semibold">
                              {lesson.level}
                            </span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                              {lesson.category}
                            </span>
                            <span className="text-gray-500 flex items-center gap-1">
                              <FaClock className="text-xs" />
                              {lesson.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
                        <button
                          onClick={() => navigate(`/lessons/${lesson.id}`)}
                          className="flex-1 p-2 bg-green-100 hover:bg-green-200 text-green-600 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all"
                          title="View Lesson"
                        >
                          <FaEye />
                          View
                        </button>
                        <button
                          onClick={() => handleEditLesson(lesson)}
                          className="flex-1 p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all"
                          title="Edit Lesson"
                        >
                          <FaEdit />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteLesson(lesson.id)}
                          className="flex-1 p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all"
                          title="Delete Lesson"
                        >
                          <FaTrash />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Pagination for Lessons */}
              {lessons.length > lessonsPerPage && (
                <div className="flex justify-center items-center gap-2 mt-4">
                  <button
                    onClick={() =>
                      handleLessonPageChange(currentLessonPage - 1)
                    }
                    disabled={currentLessonPage === 1}
                    className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                      currentLessonPage === 1
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-purple-600 text-white hover:bg-purple-700"
                    }`}
                  >
                    Previous
                  </button>

                  <div className="flex gap-1">
                    {Array.from(
                      { length: totalLessonPages },
                      (_, i) => i + 1
                    ).map((page) => (
                      <button
                        key={page}
                        onClick={() => handleLessonPageChange(page)}
                        className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                          currentLessonPage === page
                            ? "bg-purple-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() =>
                      handleLessonPageChange(currentLessonPage + 1)
                    }
                    disabled={currentLessonPage === totalLessonPages}
                    className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                      currentLessonPage === totalLessonPages
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-purple-600 text-white hover:bg-purple-700"
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Certificate Generator Section */}
          {adminTab === "certificate" && (
            <div className="lg:col-span-12 bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Form Section */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <FaCertificate className="text-yellow-500" />
                    Certificate Generator
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Student Name *
                      </label>
                      <input
                        type="text"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="Enter student full name"
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-gray-900"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Course Name
                      </label>
                      <input
                        type="text"
                        value={courseName}
                        onChange={(e) => setCourseName(e.target.value)}
                        placeholder="Enter course name"
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-gray-900"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Performance Level
                      </label>
                      <select
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-gray-900"
                      >
                        <option value="Outstanding">Outstanding ⭐⭐⭐⭐⭐</option>
                        <option value="Excellent">Excellent ⭐⭐⭐⭐</option>
                        <option value="Very Good">Very Good ⭐⭐⭐</option>
                        <option value="Good">Good ⭐⭐</option>
                        <option value="Satisfactory">Satisfactory ⭐</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Completion Date
                      </label>
                      <input
                        type="date"
                        value={completionDate}
                        onChange={(e) => setCompletionDate(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-gray-900"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => setShowCertificatePreview(!showCertificatePreview)}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg"
                      >
                        <FaAward />
                        {showCertificatePreview ? "Hide" : "Show"} Preview
                      </button>
                      <button
                        onClick={generateCertificatePDF}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg"
                      >
                        <FaDownload />
                        Download PDF
                      </button>
                    </div>
                  </div>
                </div>

                {/* Preview Section */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <FaMedal className="text-yellow-500" />
                    Live Preview
                  </h2>

                  {showCertificatePreview && studentName ? (
                    <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-4 border-blue-500 rounded-lg shadow-2xl p-8 relative min-h-[500px]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {/* Decorative corners */}
                      <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-purple-500"></div>
                      <div className="absolute top-0 right-0 w-20 h-20 border-t-4 border-r-4 border-purple-500"></div>
                      <div className="absolute bottom-0 left-0 w-20 h-20 border-b-4 border-l-4 border-purple-500"></div>
                      <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-purple-500"></div>

                      {/* Content */}
                      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center space-y-4">
                        <p className="text-sm text-gray-500 uppercase tracking-widest font-medium">Certificate</p>
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                          of Excellence
                        </h1>

                        <div className="w-40 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent my-2"></div>

                        <p className="text-sm text-gray-600 italic mt-4 font-light">Presented to</p>

                        <h2 className="text-4xl font-bold text-blue-900 px-4 py-2 tracking-wide">
                          {studentName}
                        </h2>

                        <p className="text-sm text-gray-600 mt-3 font-light">
                          for successfully completing the
                        </p>

                        <h3 className="text-2xl font-bold text-purple-600 py-2 tracking-wide">
                          {courseName}
                        </h3>

                        <p className="text-sm text-gray-600 mt-3 font-light">
                          with <span className="font-semibold text-gray-800">{grade}</span> performance
                        </p>

                        <div className="w-40 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent my-3"></div>

                        <p className="text-sm text-gray-500 mt-4 mb-6 font-medium">
                          {new Date(completionDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>

                        <div className="flex justify-between w-full pt-6 px-8 mt-6">
                          <div className="text-center">
                            <div className="w-28 h-0.5 bg-gray-400 mb-2"></div>
                            <p className="text-xs font-semibold text-gray-700 tracking-wide">Miss Nora</p>
                            <p className="text-[10px] text-gray-500 font-light">Teacher</p>
                          </div>
                          <div className="flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full border-3 border-yellow-500 bg-yellow-50 flex items-center justify-center shadow-lg">
                              <FaAward className="text-yellow-600 text-2xl" />
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="w-28 h-0.5 bg-gray-400 mb-2"></div>
                            <p className="text-xs font-semibold text-gray-700 tracking-wide">N. Hasanboy</p>
                            <p className="text-[10px] text-gray-500 font-light">Director</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center min-h-[500px]">
                      <div className="text-center text-gray-400">
                        <FaCertificate className="text-6xl mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">
                          {studentName
                            ? "Click 'Show Preview'"
                            : "Enter student name to see preview"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lessons Modal - Desktop & Mobile */}
      {showCreateLesson && (
        <div className="hidden lg:flex fixed inset-0 bg-black bg-opacity-50 z-50 items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <CreateLesson
              lesson={editingLesson}
              onSave={handleSaveLesson}
              onCancel={() => {
                setShowCreateLesson(false);
                setEditingLesson(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
