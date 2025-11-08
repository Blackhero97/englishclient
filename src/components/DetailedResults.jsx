import React, { useState } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaTrophy,
  FaClock,
  FaDownload,
  FaChartBar,
  FaArrowLeft,
  FaShare,
} from "react-icons/fa";
import { toast } from "react-toastify";

function DetailedResults({ result, onBack }) {
  const [showDetails, setShowDetails] = useState(false);

  // Calculate statistics
  const totalQuestions = result.answers?.length || 0;
  const correctAnswers = result.score || 0;
  const wrongAnswers = totalQuestions - correctAnswers;
  const percentage = totalQuestions > 0 ? ((correctAnswers / totalQuestions) * 100).toFixed(1) : 0;

  // Performance level
  const getPerformanceLevel = (percentage) => {
    if (percentage >= 90) return { level: "Excellent", color: "text-green-600", bgColor: "bg-green-50", borderColor: "border-green-200" };
    if (percentage >= 75) return { level: "Good", color: "text-blue-600", bgColor: "bg-blue-50", borderColor: "border-blue-200" };
    if (percentage >= 60) return { level: "Fair", color: "text-yellow-600", bgColor: "bg-yellow-50", borderColor: "border-yellow-200" };
    return { level: "Needs Improvement", color: "text-red-600", bgColor: "bg-red-50", borderColor: "border-red-200" };
  };

  const performance = getPerformanceLevel(percentage);

  // Generate PDF
  const generatePDF = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/results/${result._id}/pdf`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${result.firstName}_${result.lastName}_Test_Results.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast.success("PDF downloaded successfully!");
      } else {
        toast.error("Failed to generate PDF");
      }
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Error generating PDF");
    }
  };

  // Share results
  const shareResults = () => {
    const text = `I scored ${percentage}% (${correctAnswers}/${totalQuestions}) on ${result.testName}! 🎓`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Test Results',
        text: text,
      }).catch(() => {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(text);
        toast.success("Results copied to clipboard!");
      });
    } else {
      navigator.clipboard.writeText(text);
      toast.success("Results copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold mb-4 transition-colors"
          >
            <FaArrowLeft /> Back to Tests
          </button>
          
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaTrophy className="text-4xl text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Test Complete!
              </h1>
              <p className="text-gray-600">
                {result.firstName} {result.lastName}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(result.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>

            {/* Score Display */}
            <div className={`${performance.bgColor} ${performance.borderColor} border-2 rounded-xl p-6 mb-6`}>
              <div className="text-center">
                <p className="text-gray-600 mb-2">Your Score</p>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className={`text-6xl font-bold ${performance.color}`}>
                    {percentage}%
                  </span>
                </div>
                <p className={`text-lg font-semibold ${performance.color} mb-3`}>
                  {performance.level}
                </p>
                <div className="flex items-center justify-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5">
                    <FaCheckCircle className="text-green-600" />
                    <span className="font-semibold">{correctAnswers} Correct</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FaTimesCircle className="text-red-600" />
                    <span className="font-semibold">{wrongAnswers} Wrong</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FaClock className="text-blue-600" />
                    <span className="font-semibold">{result.timeTaken || result.testDuration} min</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={generatePDF}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 rounded-lg transition-all duration-300 hover:shadow-xl"
              >
                <FaDownload />
                Download PDF
              </button>
              <button
                onClick={shareResults}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-lg transition-all duration-300 hover:shadow-xl"
              >
                <FaShare />
                Share Results
              </button>
            </div>

            {/* Toggle Details */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg transition-all"
            >
              <FaChartBar />
              {showDetails ? "Hide" : "Show"} Detailed Analysis
            </button>
          </div>
        </div>

        {/* Detailed Analysis */}
        {showDetails && (
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FaChartBar className="text-blue-600" />
              Question-by-Question Analysis
            </h2>

            <div className="space-y-4">
              {result.answers?.map((answer, index) => {
                const question = result.questions?.[index];
                const isCorrect = answer.selectedAnswer === answer.correctAnswer;

                return (
                  <div
                    key={index}
                    className={`border-2 rounded-lg p-4 ${
                      isCorrect
                        ? "border-green-200 bg-green-50"
                        : "border-red-200 bg-red-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isCorrect ? "bg-green-600" : "bg-red-600"
                      }`}>
                        {isCorrect ? (
                          <FaCheckCircle className="text-white text-sm" />
                        ) : (
                          <FaTimesCircle className="text-white text-sm" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 mb-2">
                          Question {index + 1}
                        </p>
                        <p className="text-gray-700 mb-3">
                          {question?.question || answer.question}
                        </p>
                        
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <span className="text-xs font-semibold text-gray-600 min-w-[80px]">
                              Your Answer:
                            </span>
                            <span className={`text-sm ${isCorrect ? "text-green-700" : "text-red-700"} font-medium`}>
                              {answer.selectedAnswer}
                            </span>
                          </div>
                          
                          {!isCorrect && (
                            <div className="flex items-start gap-2">
                              <span className="text-xs font-semibold text-gray-600 min-w-[80px]">
                                Correct Answer:
                              </span>
                              <span className="text-sm text-green-700 font-medium">
                                {answer.correctAnswer}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Performance Tips */}
        <div className="mt-6 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            💡 Tips for Improvement
          </h3>
          <ul className="space-y-2 text-gray-700">
            {percentage < 60 && (
              <>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Review grammar rules and practice regularly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Focus on vocabulary building exercises</span>
                </li>
              </>
            )}
            {percentage >= 60 && percentage < 90 && (
              <>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>You're doing well! Keep practicing to reach excellence</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Focus on areas where you made mistakes</span>
                </li>
              </>
            )}
            {percentage >= 90 && (
              <>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Excellent work! Challenge yourself with harder tests</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Consider helping others improve their English</span>
                </li>
              </>
            )}
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Take another test to track your progress</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DetailedResults;
