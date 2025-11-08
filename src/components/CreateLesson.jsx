import React, { useState } from "react";
import {
  FaBook,
  FaSave,
  FaTimes,
  FaRobot,
  FaSpinner,
} from "react-icons/fa";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function CreateLesson({ lesson, onSave, onCancel }) {
  const [title, setTitle] = useState(lesson?.title || "");
  const [description, setDescription] = useState(lesson?.description || "");
  const [category, setCategory] = useState(lesson?.category || "Vocabulary");
  const [level, setLevel] = useState(lesson?.level || "Beginner");
  const [duration, setDuration] = useState(lesson?.duration || "15 min");
  const [content, setContent] = useState(lesson?.content || "");
  const [isGenerating, setIsGenerating] = useState(false);

  const categories = ["Vocabulary", "Grammar", "Speaking", "Writing", "Reading", "Listening", "Basics"];
  const levels = ["Beginner", "Intermediate", "Advanced"];

  const handleGenerateWithAI = async () => {
    if (!title.trim()) {
      toast.error("Please enter a lesson title first");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch(`${API_URL}/ai/generate-lesson`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          level,
          category,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setContent(data.content);
        if (!description) {
          setDescription(data.description || "");
        }
        toast.success("AI generated lesson content!");
      } else {
        toast.error(data.error || "Failed to generate content");
      }
    } catch (error) {
      toast.error("Error generating content: " + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    const lessonData = {
      title: title.trim(),
      description: description.trim(),
      category,
      level,
      duration,
      content: content.trim(),
    };

    try {
      const url = lesson
        ? `${API_URL}/lessons/${lesson.id}`
        : `${API_URL}/lessons`;
      const method = lesson ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lessonData),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(lesson ? "Lesson updated!" : "Lesson created!");
        onSave(data.lesson);
      } else {
        toast.error(data.error || "Failed to save lesson");
      }
    } catch (error) {
      toast.error("Error saving lesson: " + error.message);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FaBook className="text-purple-600" />
          {lesson ? "Edit Lesson" : "Create New Lesson"}
        </h2>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-lg transition-all"
        >
          <FaTimes className="text-gray-600" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Lesson Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., The English Alphabet"
            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of the lesson"
            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Category, Level, Duration - Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Level
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {levels.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Duration
            </label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g., 15 min"
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* AI Generate Button */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-800 mb-1">
                Generate with AI
              </p>
              <p className="text-sm text-gray-600">
                Let AI create lesson content based on your title and settings
              </p>
            </div>
            <button
              onClick={handleGenerateWithAI}
              disabled={isGenerating || !title.trim()}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold rounded-lg transition-all flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <FaRobot />
                  <span>Generate</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Content - Markdown Editor */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Lesson Content (Markdown) *
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="# Lesson Title&#10;&#10;## Introduction&#10;Content goes here...&#10;&#10;## Examples&#10;- Example 1&#10;- Example 2"
            rows={15}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
          />
          <p className="text-xs text-gray-500 mt-2">
            Use Markdown formatting: # for headings, ** for bold, - for lists, etc.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={handleSave}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
          >
            <FaSave />
            <span>{lesson ? "Update Lesson" : "Save Lesson"}</span>
          </button>
          <button
            onClick={onCancel}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateLesson;
