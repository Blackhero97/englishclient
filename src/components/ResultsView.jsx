import { useState, useEffect } from "react";
import {
  FaArrowLeft,
  FaTrash,
  FaCheckCircle,
  FaTimesCircle,
  FaClipboardList,
  FaChartBar,
  FaTimes,
  FaFileExcel,
  FaDownload,
  FaFilePdf,
  FaSearch,
} from "react-icons/fa";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function ResultsView({ onBack }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedResult, setExpandedResult] = useState(null);
  const [detailedAnalysis, setDetailedAnalysis] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/results`);
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error("Failed to fetch results:", error);
      toast.error("Failed to load results");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this result?")) return;

    try {
      const response = await fetch(`${API_URL}/results/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Result deleted successfully");
        fetchResults();
      } else {
        toast.error("Failed to delete result");
      }
    } catch (error) {
      console.error("Error deleting result:", error);
      toast.error("Error deleting result");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleViewAnalysis = (result) => {
    console.log('🔍 Opening detailed analysis for result:', result);
    console.log('📊 Result answers:', result?.answers);
    console.log('📝 Answers type:', typeof result?.answers);
    console.log('📏 Answers length:', result?.answers?.length);
    if (result?.answers && result.answers.length > 0) {
      console.log('🎯 First answer type:', typeof result.answers[0]);
      console.log('🎯 First answer:', result.answers[0]);
    }
    setDetailedAnalysis(result);
  };

  const closeAnalysis = () => {
    setDetailedAnalysis(null);
  };

  const exportToExcel = () => {
    if (results.length === 0) {
      toast.warning("No results to export");
      return;
    }

    // Prepare data for Excel
    const excelData = results.map((result, index) => ({
      "#": index + 1,
      Date: formatDate(result.createdAt),
      "First Name": result.firstName,
      "Last Name": result.lastName,
      "Test Name": result.testName,
      "Total Questions": result.totalQuestions,
      "Correct Answers": result.correctAnswers,
      "Wrong Answers": result.wrongAnswers,
      "Percentage": result.percentage + "%",
      Status:
        result.percentage >= 80
          ? "Excellent"
          : result.percentage >= 60
          ? "Good"
          : "Needs Improvement",
    }));

    // Create workbook and worksheet
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Test Results");

    // Set column widths
    const colWidths = [
      { wch: 5 },  // #
      { wch: 20 }, // Date
      { wch: 15 }, // First Name
      { wch: 15 }, // Last Name
      { wch: 25 }, // Test Name
      { wch: 15 }, // Total Questions
      { wch: 15 }, // Correct Answers
      { wch: 15 }, // Wrong Answers
      { wch: 12 }, // Percentage
      { wch: 18 }, // Status
    ];
    ws["!cols"] = colWidths;

    // Generate file name with current date
    const fileName = `test_results_${
      new Date().toISOString().split("T")[0]
    }.xlsx`;

    // Save file
    XLSX.writeFile(wb, fileName);
    toast.success(`Exported ${results.length} results to Excel!`);
  };

  const exportResultToPDF = (result) => {
    try {
      const doc = new jsPDF();
      
      // Title with background
      doc.setFillColor(37, 99, 235);
      doc.rect(0, 0, 210, 30, 'F');
      
      doc.setFontSize(22);
      doc.setTextColor(255, 255, 255);
      doc.text("Test Result Certificate", 105, 20, { align: "center" });
      
      // Student Information Section
      doc.setFontSize(14);
      doc.setTextColor(37, 99, 235);
      doc.text("Student Information", 20, 45);
      
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.text(`Name: ${result.firstName} ${result.lastName}`, 20, 55);
      doc.text(`Test: ${result.testName}`, 20, 62);
      doc.text(`Date: ${formatDate(result.createdAt)}`, 20, 69);
      
      // Results Section
      doc.setFontSize(14);
      doc.setTextColor(37, 99, 235);
      doc.text("Test Results", 20, 85);
      
      // Results Box
      doc.setFillColor(239, 246, 255);
      doc.roundedRect(20, 90, 170, 50, 3, 3, 'F');
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Total Questions: ${result.totalQuestions}`, 30, 100);
      doc.text(`Correct Answers: ${result.correctAnswers}`, 30, 110);
      doc.text(`Wrong Answers: ${result.wrongAnswers}`, 30, 120);
      doc.text(`Score: ${result.percentage}%`, 30, 130);
      
      // Status Badge
      const status = result.percentage >= 80 ? "Excellent ⭐" : 
                     result.percentage >= 60 ? "Good ✓" : 
                     "Needs Improvement";
      const statusBgColor = result.percentage >= 80 ? [34, 197, 94] : 
                            result.percentage >= 60 ? [234, 179, 8] : 
                            [239, 68, 68];
      
      doc.setFillColor(...statusBgColor);
      doc.roundedRect(65, 145, 80, 15, 3, 3, 'F');
      
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.text(status, 105, 155, { align: "center" });
      
      // Detailed Answers Section
      if (result.answers && Array.isArray(result.answers) && result.answers.length > 0) {
        doc.setFontSize(14);
        doc.setTextColor(37, 99, 235);
        doc.text("Question-by-Question Analysis", 20, 175);
        
        // Create table data
        const tableData = result.answers.map((answer, index) => {
          let isCorrect = false;
          if (typeof answer === 'boolean') {
            isCorrect = answer;
          } else if (typeof answer === 'number') {
            isCorrect = answer === 1;
          } else if (typeof answer === 'object' && answer !== null) {
            isCorrect = answer.isCorrect || answer.correct;
          }
          
          return [
            `Question ${index + 1}`,
            isCorrect ? "✓ Correct" : "✗ Wrong"
          ];
        });
        
        // Add table using autoTable
        autoTable(doc, {
          startY: 180,
          head: [['Question', 'Result']],
          body: tableData,
          theme: 'grid',
          headStyles: { 
            fillColor: [37, 99, 235],
            fontSize: 11,
            fontStyle: 'bold'
          },
          bodyStyles: {
            fontSize: 10
          },
          alternateRowStyles: { 
            fillColor: [245, 247, 250] 
          },
          margin: { left: 20, right: 20 }
        });
      }
      
      // Footer
      const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : 200;
      doc.setDrawColor(200, 200, 200);
      doc.line(20, finalY, 190, finalY);
      
      doc.setFontSize(9);
      doc.setTextColor(128, 128, 128);
      doc.text(`Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 105, finalY + 7, { align: "center" });
      doc.text("English Learning Platform - Test Results", 105, finalY + 12, { align: "center" });
      
      // Save PDF
      const fileName = `${result.firstName}_${result.lastName}_${result.testName.replace(/\s+/g, '_')}_Result.pdf`;
      doc.save(fileName);
      toast.success("✅ PDF downloaded successfully!");
    } catch (error) {
      console.error("PDF Export Error:", error);
      toast.error("❌ Failed to generate PDF: " + error.message);
    }
  };

  // Filter results based on search query
  const filteredResults = results.filter((result) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      result.firstName.toLowerCase().includes(searchLower) ||
      result.lastName.toLowerCase().includes(searchLower) ||
      result.testName.toLowerCase().includes(searchLower) ||
      formatDate(result.createdAt).toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-4 md:py-8 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header - Compact on mobile */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-5 md:p-6 mb-5 md:mb-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
              <button
                onClick={onBack}
                className="p-2.5 md:p-3 bg-gray-100 hover:bg-gray-200 rounded-lg md:rounded-xl transition-colors flex-shrink-0"
              >
                <FaArrowLeft className="text-gray-700 text-base md:text-lg" />
              </button>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                  Results
                </h1>
                <p className="text-gray-500 text-sm md:text-base mt-1 hidden sm:block">
                  View all test results
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Export to Excel Button */}
              {results.length > 0 && (
                <button
                  onClick={exportToExcel}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg md:rounded-xl font-semibold transition-all hover:shadow-lg text-sm md:text-base"
                  title="Export to Excel"
                >
                  <FaFileExcel className="text-lg" />
                  <span className="hidden sm:inline">Export Excel</span>
                  <span className="sm:hidden">Excel</span>
                </button>
              )}
              <div className="text-right flex-shrink-0">
                <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-blue-600">
                  {results.length}
                </div>
                <div className="text-xs md:text-sm text-gray-500">Total</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        {results.length > 0 && (
          <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 mb-5">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="Search by name, test name, or date..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-gray-900 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              )}
            </div>
            {searchQuery && (
              <p className="mt-2 text-sm text-gray-600">
                Found {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        )}

        {/* Results Table */}
        {filteredResults.length === 0 ? (
          <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-8 md:p-12 text-center">
            <FaClipboardList className="text-5xl md:text-6xl text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl md:text-2xl font-bold text-gray-700 mb-2">
              {searchQuery ? "No Results Found" : "No Results Yet"}
            </h2>
            <p className="text-sm md:text-base text-gray-500">
              {searchQuery ? "Try a different search term" : "Student test results will appear here"}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block bg-white rounded-xl md:rounded-2xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Test
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold">
                        %
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold">
                        Correct
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold">
                        Wrong
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredResults.map((result) => (
                      <tr
                        key={result._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatDate(result.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">
                            {result.firstName} {result.lastName}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {result.testName}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                              result.percentage >= 80
                                ? "bg-green-100 text-green-800"
                                : result.percentage >= 60
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {result.percentage}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <FaCheckCircle className="text-green-500" />
                            <span className="font-semibold text-gray-900">
                              {result.correctAnswers}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <FaTimesCircle className="text-red-500" />
                            <span className="font-semibold text-gray-900">
                              {result.wrongAnswers}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => exportResultToPDF(result)}
                              className="p-2 bg-green-100 hover:bg-green-200 text-green-600 rounded-lg transition-colors"
                              title="Download PDF"
                            >
                              <FaFilePdf />
                            </button>
                            <button
                              onClick={() => handleViewAnalysis(result)}
                              className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-colors"
                              title="View detailed analysis"
                            >
                              <FaChartBar />
                            </button>
                            <button
                              onClick={() => handleDelete(result._id)}
                              className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
                              title="Delete result"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card Layout */}
            <div className="md:hidden space-y-4">
              {filteredResults.map((result) => (
                <div
                  key={result._id}
                  className="bg-white rounded-xl shadow-lg p-4 border border-gray-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-1">
                        {result.firstName} {result.lastName}
                      </h3>
                      <p className="text-sm text-gray-600 mb-1">
                        {result.testName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(result.createdAt)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(result._id)}
                      className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors flex-shrink-0"
                      title="Delete result"
                    >
                      <FaTrash className="text-sm" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    <div className="bg-gray-50 rounded-lg p-2 sm:p-3 text-center">
                      <div
                        className={`text-lg sm:text-xl md:text-2xl font-bold mb-0.5 sm:mb-1 ${
                          result.percentage >= 80
                            ? "text-green-600"
                            : result.percentage >= 60
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {result.percentage}%
                      </div>
                      <div className="text-[10px] sm:text-xs text-gray-500">Score</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-2 sm:p-3 text-center">
                      <div className="flex items-center justify-center gap-0.5 sm:gap-1 mb-0.5 sm:mb-1">
                        <FaCheckCircle className="text-green-600 text-xs sm:text-sm" />
                        <span className="text-base sm:text-lg md:text-xl font-bold text-green-700">
                          {result.correctAnswers}
                        </span>
                      </div>
                      <div className="text-[10px] sm:text-xs text-gray-500">Correct</div>
                    </div>
                    <div className="bg-red-50 rounded-lg p-2 sm:p-3 text-center">
                      <div className="flex items-center justify-center gap-0.5 sm:gap-1 mb-0.5 sm:mb-1">
                        <FaTimesCircle className="text-red-600 text-xs sm:text-sm" />
                        <span className="text-base sm:text-lg md:text-xl font-bold text-red-700">
                          {result.wrongAnswers}
                        </span>
                      </div>
                      <div className="text-[10px] sm:text-xs text-gray-500">Wrong</div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => exportResultToPDF(result)}
                      className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-semibold text-sm"
                    >
                      <FaFilePdf />
                      PDF
                    </button>
                    <button
                      onClick={() => handleViewAnalysis(result)}
                      className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-semibold text-sm"
                    >
                      <FaChartBar />
                      Details
                    </button>
                    <button
                      onClick={() => handleDelete(result._id)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-semibold text-sm"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Detailed Analysis Modal */}
      {detailedAnalysis && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 sm:p-5 md:p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0 mr-2">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 truncate">
                    Detailed Analysis
                  </h2>
                  <p className="text-blue-100 text-xs sm:text-sm truncate">
                    {detailedAnalysis?.firstName} {detailedAnalysis?.lastName} - {detailedAnalysis?.testName}
                  </p>
                </div>
                <button
                  onClick={closeAnalysis}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <FaTimes className="text-2xl" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Summary Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 sm:p-4 text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">
                    {detailedAnalysis?.percentage || 0}%
                  </div>
                  <div className="text-sm text-gray-600">Final Score</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    {detailedAnalysis?.correctAnswers || 0}
                  </div>
                  <div className="text-sm text-gray-600">Correct Answers</div>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-red-600 mb-1">
                    {detailedAnalysis?.wrongAnswers || 0}
                  </div>
                  <div className="text-sm text-gray-600">Wrong Answers</div>
                </div>
              </div>

              {/* Questions Review */}
              <div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-1.5 sm:gap-2">
                  <FaClipboardList className="text-blue-600 text-sm sm:text-base" />
                  Question by Question Review
                </h3>
                {!detailedAnalysis?.answers || detailedAnalysis.answers.length === 0 || typeof detailedAnalysis.answers?.[0] === 'number' ? (
                  <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 text-center">
                    <div className="text-5xl mb-3">⚠️</div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">
                      Detailed Analysis Not Available
                    </h4>
                    <p className="text-gray-600 text-sm">
                      This result was saved before the detailed analysis feature was added.
                      <br />
                      Only new test results will have question-by-question review.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {detailedAnalysis.answers.map((answer, index) => {
                      const isCorrect = answer.selectedAnswer === answer.correctAnswer;
                      return (
                        <div
                          key={index}
                          className={`border-2 rounded-xl p-4 ${
                            isCorrect
                              ? "border-green-200 bg-green-50"
                              : "border-red-200 bg-red-50"
                          }`}
                        >
                          <div className="flex items-start gap-3 mb-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                isCorrect
                                  ? "bg-green-500 text-white"
                                  : "bg-red-500 text-white"
                              }`}
                            >
                              {isCorrect ? (
                                <FaCheckCircle className="text-sm" />
                              ) : (
                                <FaTimesCircle className="text-sm" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900 mb-2">
                                Question {index + 1}: {answer.question}
                              </p>
                              <div className="space-y-2">
                                {answer.options && answer.options.map((option, optIndex) => {
                                  const isSelected = optIndex === answer.selectedAnswer;
                                  const isCorrectOption = optIndex === answer.correctAnswer;
                                  return (
                                    <div
                                      key={optIndex}
                                      className={`px-3 py-2 rounded-lg text-sm ${
                                        isCorrectOption
                                          ? "bg-green-200 text-green-900 font-semibold"
                                          : isSelected
                                          ? "bg-red-200 text-red-900 font-semibold"
                                          : "bg-white text-gray-700"
                                      }`}
                                    >
                                      {String.fromCharCode(65 + optIndex)}. {option}
                                      {isCorrectOption && " ✓ (Correct)"}
                                      {isSelected && !isCorrectOption && " ✗ (Your answer)"}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Close Button */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={closeAnalysis}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-lg transition-all"
                >
                  Close Analysis
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResultsView;
