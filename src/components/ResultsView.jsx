import { useState, useEffect } from "react";
import {
  FaArrowLeft,
  FaTrash,
  FaCheckCircle,
  FaTimesCircle,
  FaClipboardList,
} from "react-icons/fa";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function ResultsView({ onBack }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedResult, setExpandedResult] = useState(null);

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
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Results
                </h1>
                <p className="text-gray-500 text-sm md:text-base mt-1 hidden sm:block">
                  View all test results
                </p>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-2xl md:text-3xl font-bold text-blue-600">
                {results.length}
              </div>
              <div className="text-xs md:text-sm text-gray-500">Total</div>
            </div>
          </div>
        </div>

        {/* Results Table */}
        {results.length === 0 ? (
          <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-8 md:p-12 text-center">
            <FaClipboardList className="text-5xl md:text-6xl text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl md:text-2xl font-bold text-gray-700 mb-2">
              No Results Yet
            </h2>
            <p className="text-sm md:text-base text-gray-500">
              Student test results will appear here
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
                      <th className="px-6 py-4 text-center text-sm font-semibold"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {results.map((result) => (
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
                          <button
                            onClick={() => handleDelete(result._id)}
                            className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
                            title="Delete result"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card Layout */}
            <div className="md:hidden space-y-4">
              {results.map((result) => (
                <div
                  key={result._id}
                  className="bg-white rounded-xl shadow-lg p-4 border border-gray-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-gray-900 mb-1">
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

                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <div
                        className={`text-2xl font-bold mb-1 ${
                          result.percentage >= 80
                            ? "text-green-600"
                            : result.percentage >= 60
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {result.percentage}%
                      </div>
                      <div className="text-xs text-gray-500">Score</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <FaCheckCircle className="text-green-600 text-sm" />
                        <span className="text-xl font-bold text-green-700">
                          {result.correctAnswers}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">Correct</div>
                    </div>
                    <div className="bg-red-50 rounded-lg p-3 text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <FaTimesCircle className="text-red-600 text-sm" />
                        <span className="text-xl font-bold text-red-700">
                          {result.wrongAnswers}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">Wrong</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ResultsView;
