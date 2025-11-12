import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaBook,
  FaClock,
  FaGraduationCap,
  FaRobot,
  FaPrint,
  FaBookmark,
  FaRegBookmark,
  FaSpinner,
  FaFilePdf,
  FaDownload,
} from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import AIChatbot from "./AIChatbot";
import { defaultLessons } from "../data/defaultLessons";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function LessonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showAIChatbot, setShowAIChatbot] = useState(false);

  useEffect(() => {
    fetchLesson();
    checkBookmark();
  }, [id]);

  const fetchLesson = async () => {
    try {
      // First try to get from API
      const response = await fetch(`${API_URL}/lessons/${id}`);
      if (response.ok) {
        const data = await response.json();
        setLesson(data.lesson);
      } else {
        // If not found in API, check default lessons
        const defaultLesson = defaultLessons.find((l) => l.id === id);
        if (defaultLesson) {
          setLesson(defaultLesson);
        } else {
          toast.error("Lesson not found");
          navigate("/lessons");
        }
      }
    } catch (error) {
      // On error, try default lessons
      const defaultLesson = defaultLessons.find((l) => l.id === id);
      if (defaultLesson) {
        setLesson(defaultLesson);
      } else {
        toast.error("Failed to load lesson");
        navigate("/lessons");
      }
    } finally {
      setLoading(false);
    }
  };

  const checkBookmark = () => {
    const bookmarks = JSON.parse(
      localStorage.getItem("bookmarkedLessons") || "[]"
    );
    setIsBookmarked(bookmarks.includes(id));
  };

  const toggleBookmark = () => {
    const bookmarks = JSON.parse(
      localStorage.getItem("bookmarkedLessons") || "[]"
    );
    if (isBookmarked) {
      const updated = bookmarks.filter((lessonId) => lessonId !== id);
      localStorage.setItem("bookmarkedLessons", JSON.stringify(updated));
      setIsBookmarked(false);
      toast.info("Removed from bookmarks");
    } else {
      bookmarks.push(id);
      localStorage.setItem("bookmarkedLessons", JSON.stringify(bookmarks));
      setIsBookmarked(true);
      toast.success("Added to bookmarks");
    }
  };

  const exportLessonToPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(24);
      doc.setTextColor(147, 51, 234); // Purple color
      doc.text(lesson.title, 20, 20);
      
      // Add metadata
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128);
      doc.text(`Level: ${lesson.level} | Category: ${lesson.category}`, 20, 30);
      doc.text(`Duration: ${lesson.duration}`, 20, 36);
      
      // Add line separator
      doc.setDrawColor(147, 51, 234);
      doc.setLineWidth(0.5);
      doc.line(20, 40, 190, 40);
      
      // Add description
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text("Description:", 20, 50);
      
      doc.setFontSize(11);
      doc.setTextColor(64, 64, 64);
      const descLines = doc.splitTextToSize(lesson.description, 170);
      doc.text(descLines, 20, 58);
      
      let yPosition = 58 + (descLines.length * 6) + 10;
      
      // Add content
      if (lesson.content) {
        // Check if we need a new page
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text("Lesson Content:", 20, yPosition);
        yPosition += 8;
        
        // Convert markdown to plain text (simple version)
        const plainContent = lesson.content
          .replace(/[#*_`]/g, '')
          .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
          .trim();
        
        doc.setFontSize(10);
        doc.setTextColor(64, 64, 64);
        
        const contentLines = doc.splitTextToSize(plainContent, 170);
        
        // Handle pagination
        contentLines.forEach((line) => {
          if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
          }
          doc.text(line, 20, yPosition);
          yPosition += 6;
        });
      }
      
      // Add footer on all pages
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text(
          `Page ${i} of ${pageCount} - Downloaded from English Learning Platform`,
          105,
          285,
          { align: "center" }
        );
      }
      
      // Save PDF
      const fileName = `${lesson.title.replace(/\s+/g, '_')}_Lesson.pdf`;
      doc.save(fileName);
      toast.success("Lesson downloaded as PDF!");
    } catch (error) {
      console.error("PDF Export Error:", error);
      toast.error("Failed to generate PDF: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-purple-600 text-6xl mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 py-6 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate("/lessons")}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              <FaArrowLeft className="text-sm" />
              <span>Back to Lessons</span>
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={exportLessonToPDF}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                title="Download as PDF"
              >
                <FaFilePdf className="text-lg" />
                <span className="hidden sm:inline">Download PDF</span>
              </button>
              <button
                onClick={toggleBookmark}
                className={`p-3 rounded-lg transition-all shadow-sm hover:shadow-md ${
                  isBookmarked
                    ? "bg-yellow-100 hover:bg-yellow-200"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
              >
                {isBookmarked ? (
                  <FaBookmark className="text-yellow-500 text-xl" />
                ) : (
                  <FaRegBookmark className="text-gray-500 text-xl" />
                )}
              </button>
              <button
                onClick={() => window.print()}
                className="p-3 bg-gray-100 hover:bg-blue-100 rounded-lg transition-all shadow-sm hover:shadow-md"
                title="Print lesson"
              >
                <FaPrint className="text-gray-600 text-xl" />
              </button>
            </div>
          </div>

          {/* Lesson Info */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {lesson.title}
                </h1>
                <p className="text-gray-600 mb-4">{lesson.description}</p>
                <div className="flex flex-wrap items-center gap-4">
                  <span
                    className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                      lesson.level === "Beginner"
                        ? "bg-green-100 text-green-700"
                        : lesson.level === "Intermediate"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {lesson.level}
                  </span>
                  <span className="flex items-center gap-2 text-purple-600 font-semibold">
                    <FaGraduationCap />
                    {lesson.category}
                  </span>
                  <span className="flex items-center gap-2 text-gray-600">
                    <FaClock />
                    {lesson.duration}
                  </span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                  <FaBook className="text-4xl text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lesson Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold text-gray-900 mb-4 mt-6">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-bold text-gray-800 mb-3 mt-5">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-bold text-gray-700 mb-2 mt-4">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside mb-4 space-y-2">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside mb-4 space-y-2">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-gray-700">{children}</li>
                ),
                strong: ({ children }) => (
                  <strong className="font-bold text-purple-600">
                    {children}
                  </strong>
                ),
                code: ({ children }) => (
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-purple-600">
                    {children}
                  </code>
                ),
              }}
            >
              {lesson.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* AI Assistant Section */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
              <FaRobot className="text-3xl" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-1">Need Help?</h3>
              <p className="text-purple-100 text-sm">
                Ask our AI English Teacher about this lesson
              </p>
            </div>
            <button
              onClick={() => setShowAIChatbot(true)}
              className="px-6 py-3 bg-white text-purple-600 font-bold rounded-lg hover:bg-purple-50 transition-all"
            >
              Ask AI
            </button>
          </div>
        </div>
      </div>

      {/* AI Chatbot */}
      <AIChatbot
        isOpen={showAIChatbot}
        onClose={() => setShowAIChatbot(false)}
        testContext={{
          lessonTitle: lesson.title,
          lessonCategory: lesson.category,
          lessonLevel: lesson.level,
        }}
      />
    </div>
  );
}

export default LessonDetail;
