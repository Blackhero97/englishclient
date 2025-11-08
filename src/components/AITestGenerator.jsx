import { useState } from "react";
import { FaRobot, FaSpinner, FaCheckCircle, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function AITestGenerator({ onQuestionsGenerated }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("intermediate");
  const [questionCount, setQuestionCount] = useState(5);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch(`${API_URL}/ai/generate-test`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic,
          difficulty: difficulty,
          questionCount: questionCount,
        }),
      });

      const data = await response.json();

      if (response.ok && data.questions) {
        setGeneratedQuestions(data.questions);
        toast.success(`✨ Generated ${data.questions.length} questions!`);
      } else {
        toast.error(data.error || "Failed to generate questions");
      }
    } catch (error) {
      console.error("AI Generation Error:", error);
      toast.error("Failed to generate questions: " + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddQuestions = () => {
    if (generatedQuestions.length > 0) {
      onQuestionsGenerated(generatedQuestions);
      setGeneratedQuestions([]);
      setTopic("");
      toast.success("Questions added to test!");
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg p-6 border-2 border-purple-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
          <FaRobot className="text-white text-2xl" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">
            AI Test Generator
          </h3>
          <p className="text-purple-600 text-sm font-medium">
            Powered by Google Gemini
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Topic Input */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Topic / Subject
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Present Perfect Tense, Vocabulary, Reading Comprehension"
            className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none transition-colors"
            disabled={isGenerating}
          />
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Difficulty Level
          </label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none transition-colors"
            disabled={isGenerating}
          >
            <option value="beginner">Beginner (A1-A2)</option>
            <option value="intermediate">Intermediate (B1-B2)</option>
            <option value="advanced">Advanced (C1-C2)</option>
          </select>
        </div>

        {/* Question Count */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Number of Questions
          </label>
          <input
            type="number"
            value={questionCount}
            onChange={(e) =>
              setQuestionCount(
                Math.max(1, Math.min(25, parseInt(e.target.value) || 5))
              )
            }
            min="1"
            max="25"
            className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-500 focus:outline-none transition-colors"
            disabled={isGenerating}
          />
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !topic.trim()}
          className={`w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-3 ${
            isGenerating || !topic.trim()
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:shadow-lg hover:scale-105"
          }`}
        >
          {isGenerating ? (
            <>
              <FaSpinner className="animate-spin text-xl" />
              Generating Questions...
            </>
          ) : (
            <>
              <FaRobot className="text-xl" />
              Generate with AI
            </>
          )}
        </button>
      </div>

      {/* Generated Questions Preview */}
      {generatedQuestions.length > 0 && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <FaCheckCircle className="text-green-500" />
              Generated Questions ({generatedQuestions.length})
            </h4>
            <button
              onClick={handleAddQuestions}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
            >
              <FaPlus />
              Add to Test
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto space-y-3">
            {generatedQuestions.map((q, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-4 border-2 border-purple-100"
              >
                <p className="font-semibold text-gray-900 mb-2">
                  {idx + 1}. {q.question}
                </p>
                <div className="space-y-1">
                  {q.options.map((opt, optIdx) => (
                    <div
                      key={optIdx}
                      className={`px-3 py-2 rounded-lg text-sm ${
                        optIdx === q.answer
                          ? "bg-green-100 text-green-800 font-semibold"
                          : "bg-gray-50 text-gray-700"
                      }`}
                    >
                      {String.fromCharCode(65 + optIdx)}. {opt}
                      {optIdx === q.answer && " ✓"}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AITestGenerator;
