import { useState, useRef, useEffect } from "react";
import { FaRobot, FaPaperPlane, FaSpinner, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function AIChatbot({ testContext, isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: testContext
        ? `👋 Hi! I just reviewed your test results (${testContext.testName}: ${testContext.percentage}%). I'm here to help you improve! Ask me about:\n\n• Grammar explanations\n• Vocabulary tips\n• Study strategies\n• Common mistakes\n• Practice exercises\n\nOr ask me anything about English!`
        : `👋 Hi! I'm your AI English teacher. I can help you with:\n\n• Grammar (tenses, articles, prepositions)\n• Vocabulary (idioms, phrasal verbs, synonyms)\n• Writing (essays, emails, reports)\n• Speaking (pronunciation, conversation)\n• Listening & Reading comprehension\n• IELTS, TOEFL, Cambridge exam prep\n\nWhat would you like to learn today?`,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: inputMessage,
          context: testContext,
        }),
      });

      const data = await response.json();

      console.log("✅ AI Response:", data); // Debug log

      if (response.ok && data.reply) {
        const aiMessage = {
          role: "assistant",
          content: data.reply,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        console.error("❌ AI Error Response:", data);
        const errorMsg =
          data.error || data.details || "Failed to get AI response";
        toast.error(errorMsg);
        // Still show error in chat
        const errorMessage = {
          role: "assistant",
          content: `Sorry, I encountered an error: ${errorMsg}`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("AI Chat Error:", error);
      toast.error("Failed to connect to AI");
      // Show error in chat
      const errorMessage = {
        role: "assistant",
        content: "Sorry, I'm having trouble connecting. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 md:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[90vh] md:h-[600px] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-2xl p-4 md:p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <FaRobot className="text-white text-xl" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">
                AI English Teacher
              </h3>
              <p className="text-blue-100 text-xs">
                Ask me anything about English!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Test Context Banner */}
        {testContext && (
          <div className="bg-blue-50 border-b border-blue-200 p-3">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Test:</span>{" "}
              {testContext.testName} •{" "}
              <span className="font-semibold">Score:</span>{" "}
              {testContext.percentage}% ({testContext.score}/
              {testContext.totalQuestions})
            </p>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    msg.role === "user" ? "text-blue-200" : "text-gray-500"
                  }`}
                >
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl px-4 py-3">
                <FaSpinner className="animate-spin text-blue-600" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-3 md:p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about grammar, vocabulary..."
              className="flex-1 px-4 py-3 md:py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-base md:text-base touch-manipulation"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !inputMessage.trim()}
              className={`px-4 md:px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 text-base md:text-base touch-manipulation ${
                isLoading || !inputMessage.trim()
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg"
              }`}
            >
              <FaPaperPlane className="text-base md:text-sm" />
              <span className="hidden md:inline">Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIChatbot;
