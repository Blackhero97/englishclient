import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBook,
  FaSearch,
  FaArrowLeft,
  FaSpinner,
  FaPlus,
  FaClock,
  FaGraduationCap,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { defaultLessons } from "../data/defaultLessons";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function LessonsModule({ isAdmin }) {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState(defaultLessons);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const lessonsPerPage = 6;

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      const response = await fetch(`${API_URL}/lessons`);
      if (response.ok) {
        const data = await response.json();
        // Combine default lessons with custom lessons
        setLessons([...defaultLessons, ...data.lessons]);
      } else {
        // If API fails, use default lessons
        setLessons(defaultLessons);
      }
    } catch (error) {
      console.log("Using default lessons");
      setLessons(defaultLessons);
    } finally {
      setLoading(false);
    }
  };

  const filteredLessons = lessons.filter((lesson) => {
    const matchesSearch =
      lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel =
      selectedLevel === "All" || lesson.level === selectedLevel;
    const matchesCategory =
      selectedCategory === "All" || lesson.category === selectedCategory;
    return matchesSearch && matchesLevel && matchesCategory;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredLessons.length / lessonsPerPage);
  const indexOfLastLesson = currentPage * lessonsPerPage;
  const indexOfFirstLesson = indexOfLastLesson - lessonsPerPage;
  const currentLessons = filteredLessons.slice(
    indexOfFirstLesson,
    indexOfLastLesson
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedLevel, selectedCategory]);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const categories = ["All", ...new Set(lessons.map((l) => l.category))];
  const levels = ["All", "Beginner", "Intermediate", "Advanced"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-4 px-4 lg:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-lg transition-all shadow-md border border-gray-200 text-sm sm:text-base mb-3 sm:mb-4"
          >
            <FaArrowLeft className="text-xs sm:text-sm" />
            <span className="hidden sm:inline">Back to Dashboard</span>
            <span className="sm:hidden">Back</span>
          </button>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            📚 English Lessons
          </h1>
          {isAdmin && (
            <button
              onClick={() => navigate("/admin-panel")}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-lg transition-all shadow-md flex items-center gap-2"
            >
              <FaPlus />
              <span>Add</span>
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl border border-gray-200 shadow-lg p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search lessons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 text-xs sm:text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all placeholder-gray-400 shadow-sm hover:border-gray-300"
              />
            </div>

            {/* Level Filter */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-2 sm:px-4 py-2 text-xs sm:text-sm text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all cursor-pointer shadow-sm hover:border-gray-300"
            >
              {levels.map((level) => (
                <option key={level} value={level}>
                  {level === "All" ? "All Levels" : level}
                </option>
              ))}
            </select>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all cursor-pointer shadow-sm hover:border-gray-300"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "All" ? "All Categories" : category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Lessons Grid */}
        {loading ? (
          <div className="text-center py-12">
            <FaSpinner className="animate-spin text-blue-600 text-4xl mx-auto mb-4" />
            <p className="text-gray-600 font-semibold">Loading lessons...</p>
          </div>
        ) : filteredLessons.length === 0 ? (
          <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-lg">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <FaBook className="text-3xl text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No lessons found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filters
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedLevel("All");
                setSelectedCategory("All");
              }}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-lg transition-all shadow-lg"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {currentLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  onClick={() => navigate(`/lessons/${lesson.id}`)}
                  className="group bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl border border-gray-200 hover:border-blue-400 p-4 sm:p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Icon & Badge */}
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all shadow-md">
                      <FaBook className="text-lg sm:text-xl text-white" />
                    </div>
                    <span
                      className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-xs font-bold shadow-sm ${
                        lesson.level === "Beginner"
                          ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
                          : lesson.level === "Intermediate"
                          ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
                          : "bg-gradient-to-r from-red-500 to-pink-600 text-white"
                      }`}
                    >
                      {lesson.level}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {lesson.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 leading-relaxed">
                    {lesson.description}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-gray-100">
                    <span className="flex items-center gap-1 text-xs text-gray-600 font-semibold">
                      <FaGraduationCap className="text-indigo-600 text-xs sm:text-sm" />
                      <span className="truncate">{lesson.category}</span>
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-600 font-semibold whitespace-nowrap">
                      <FaClock className="text-blue-600 text-xs sm:text-sm" />
                      {lesson.duration}
                    </span>
                  </div>

                  {/* Action */}
                  <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-100">
                    <div className="w-full text-center text-xs sm:text-sm font-bold text-blue-600 group-hover:text-indigo-600 transition-colors">
                      Start Lesson →
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                {/* Previous Button */}
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-white text-blue-600 hover:bg-blue-50 border border-blue-300 shadow-md hover:shadow-lg"
                  }`}
                >
                  <FaChevronLeft className="text-sm" />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                {/* Page Numbers */}
                <div className="flex gap-2">
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    // Show first page, last page, current page, and pages around current
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 1 &&
                        pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => paginate(pageNumber)}
                          className={`w-10 h-10 rounded-lg font-bold transition-all flex items-center justify-center ${
                            currentPage === pageNumber
                              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-110"
                              : "bg-white text-gray-700 hover:bg-blue-50 border border-gray-300 shadow-md hover:shadow-lg"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    } else if (
                      pageNumber === currentPage - 2 ||
                      pageNumber === currentPage + 2
                    ) {
                      return (
                        <span
                          key={pageNumber}
                          className="w-10 h-10 flex items-center justify-center text-gray-500"
                        >
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-white text-blue-600 hover:bg-blue-50 border border-blue-300 shadow-md hover:shadow-lg"
                  }`}
                >
                  <span className="hidden sm:inline">Next</span>
                  <FaChevronRight className="text-sm" />
                </button>
              </div>
            )}

            {/* Results Info */}
            <div className="mt-4 text-center text-sm text-gray-600">
              Showing {indexOfFirstLesson + 1} to{" "}
              {Math.min(indexOfLastLesson, filteredLessons.length)} of{" "}
              {filteredLessons.length} lessons
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default LessonsModule;
