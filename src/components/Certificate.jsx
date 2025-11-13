import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaDownload,
  FaCertificate,
  FaMedal,
  FaStar,
  FaAward,
} from "react-icons/fa";
import { toast } from "react-toastify";
import jsPDF from "jspdf";

function Certificate() {
  const navigate = useNavigate();
  const certificateRef = useRef(null);
  const [studentName, setStudentName] = useState("");
  const [courseName, setCourseName] = useState("English Language Course");
  const [completionDate, setCompletionDate] = useState(
    new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  );
  const [grade, setGrade] = useState("Excellent");
  const [showPreview, setShowPreview] = useState(false);

  const downloadCertificatePDF = () => {
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

      // Decorative border
      doc.setDrawColor(184, 134, 11); // Gold color
      doc.setLineWidth(2);
      doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

      doc.setLineWidth(0.5);
      doc.rect(15, 15, pageWidth - 30, pageHeight - 30);

      // Certificate title
      doc.setFontSize(48);
      doc.setTextColor(184, 134, 11);
      doc.setFont(undefined, "bold");
      doc.text("CERTIFICATE", pageWidth / 2, 40, { align: "center" });

      doc.setFontSize(16);
      doc.setTextColor(100, 100, 100);
      doc.text("OF ACHIEVEMENT", pageWidth / 2, 52, { align: "center" });

      // Decorative line
      doc.setDrawColor(184, 134, 11);
      doc.setLineWidth(0.5);
      doc.line(60, 58, pageWidth - 60, 58);

      // Main text
      doc.setFontSize(14);
      doc.setTextColor(60, 60, 60);
      doc.setFont(undefined, "normal");
      doc.text("This is to certify that", pageWidth / 2, 75, {
        align: "center",
      });

      // Student name
      doc.setFontSize(32);
      doc.setTextColor(37, 99, 235);
      doc.setFont(undefined, "bold");
      doc.text(studentName, pageWidth / 2, 95, { align: "center" });

      // Achievement text
      doc.setFontSize(14);
      doc.setTextColor(60, 60, 60);
      doc.setFont(undefined, "normal");
      doc.text(
        "has successfully completed the",
        pageWidth / 2,
        110,
        { align: "center" }
      );

      // Course name
      doc.setFontSize(20);
      doc.setTextColor(37, 99, 235);
      doc.setFont(undefined, "bold");
      doc.text(courseName, pageWidth / 2, 125, { align: "center" });

      // Grade/Performance
      doc.setFontSize(14);
      doc.setTextColor(60, 60, 60);
      doc.setFont(undefined, "normal");
      doc.text(
        `with ${grade} performance`,
        pageWidth / 2,
        138,
        { align: "center" }
      );

      // Date
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Issued on ${completionDate}`,
        pageWidth / 2,
        155,
        { align: "center" }
      );

      // Signature section
      const signatureY = 175;

      // Left signature (Instructor)
      doc.setDrawColor(100, 100, 100);
      doc.line(40, signatureY, 90, signatureY);
      doc.setFontSize(11);
      doc.setTextColor(60, 60, 60);
      doc.text("Instructor Signature", 65, signatureY + 7, { align: "center" });

      // Right signature (Director)
      doc.line(pageWidth - 90, signatureY, pageWidth - 40, signatureY);
      doc.text("Director Signature", pageWidth - 65, signatureY + 7, {
        align: "center",
      });

      // Certificate seal/stamp (decorative circle)
      doc.setDrawColor(184, 134, 11);
      doc.setFillColor(255, 250, 230);
      doc.circle(pageWidth / 2, signatureY + 5, 15, "FD");

      doc.setFontSize(10);
      doc.setTextColor(184, 134, 11);
      doc.setFont(undefined, "bold");
      doc.text("CERTIFIED", pageWidth / 2, signatureY + 3, { align: "center" });
      doc.text("ENGLISH", pageWidth / 2, signatureY + 8, { align: "center" });

      // Footer
      doc.setFontSize(9);
      doc.setTextColor(150, 150, 150);
      doc.setFont(undefined, "italic");
      doc.text(
        "English Learning Platform - Empowering Language Excellence",
        pageWidth / 2,
        pageHeight - 15,
        { align: "center" }
      );

      // Save PDF
      const fileName = `${studentName.replace(/\s+/g, "_")}_Certificate.pdf`;
      doc.save(fileName);
      toast.success("🎉 Certificate downloaded successfully!");
    } catch (error) {
      console.error("PDF Generation Error:", error);
      toast.error("Failed to generate certificate: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg"
            >
              <FaArrowLeft />
              Back
            </button>
            <div className="flex items-center gap-3">
              <FaCertificate className="text-yellow-500 text-4xl" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Certificate Generator
                </h1>
                <p className="text-gray-500 text-sm">
                  Create and download certificates
                </p>
              </div>
            </div>
            <FaMedal className="text-yellow-500 text-4xl" />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Form Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FaStar className="text-yellow-500" />
              Certificate Details
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Student Name *
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Enter student full name"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-gray-900 transition-all"
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
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-gray-900 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Grade/Performance
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-gray-900 transition-all"
                >
                  <option value="Outstanding">Outstanding</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Very Good">Very Good</option>
                  <option value="Good">Good</option>
                  <option value="Satisfactory">Satisfactory</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Completion Date
                </label>
                <input
                  type="date"
                  value={
                    completionDate
                      ? new Date(completionDate).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    setCompletionDate(
                      new Date(e.target.value).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    )
                  }
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-gray-900 transition-all"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg"
                >
                  <FaAward />
                  {showPreview ? "Hide Preview" : "Show Preview"}
                </button>
                <button
                  onClick={downloadCertificatePDF}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg"
                >
                  <FaDownload />
                  Download PDF
                </button>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FaCertificate className="text-yellow-500" />
              Certificate Preview
            </h2>

            {showPreview && studentName ? (
              <div
                ref={certificateRef}
                className="aspect-[1.414/1] bg-gradient-to-br from-amber-50 to-yellow-50 border-8 border-yellow-600 rounded-lg shadow-2xl p-8 relative overflow-hidden"
              >
                {/* Decorative corners */}
                <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-yellow-600"></div>
                <div className="absolute top-0 right-0 w-20 h-20 border-t-4 border-r-4 border-yellow-600"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 border-b-4 border-l-4 border-yellow-600"></div>
                <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-yellow-600"></div>

                {/* Content */}
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="flex items-center gap-3">
                    <FaMedal className="text-yellow-600 text-5xl" />
                    <h1 className="text-5xl font-bold text-yellow-600">
                      CERTIFICATE
                    </h1>
                    <FaMedal className="text-yellow-600 text-5xl" />
                  </div>

                  <p className="text-lg text-gray-600 font-medium">
                    OF ACHIEVEMENT
                  </p>

                  <div className="w-48 h-0.5 bg-gradient-to-r from-transparent via-yellow-600 to-transparent"></div>

                  <p className="text-gray-700 text-base">
                    This is to certify that
                  </p>

                  <h2 className="text-4xl font-bold text-blue-600 px-4">
                    {studentName}
                  </h2>

                  <p className="text-gray-700 text-base">
                    has successfully completed the
                  </p>

                  <h3 className="text-2xl font-bold text-blue-600">
                    {courseName}
                  </h3>

                  <p className="text-gray-600 text-sm">
                    with <span className="font-semibold">{grade}</span>{" "}
                    performance
                  </p>

                  <div className="w-48 h-0.5 bg-gradient-to-r from-transparent via-yellow-600 to-transparent"></div>

                  <p className="text-gray-500 text-sm italic">
                    Issued on {completionDate}
                  </p>

                  <div className="flex justify-between w-full pt-6 px-8">
                    <div className="text-center">
                      <div className="w-32 h-0.5 bg-gray-400 mb-1"></div>
                      <p className="text-xs text-gray-600">
                        Instructor Signature
                      </p>
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full border-4 border-yellow-600 flex items-center justify-center bg-yellow-50">
                        <FaAward className="text-yellow-600 text-3xl" />
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="w-32 h-0.5 bg-gray-400 mb-1"></div>
                      <p className="text-xs text-gray-600">
                        Director Signature
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="aspect-[1.414/1] bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <FaCertificate className="text-6xl mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">
                    {studentName
                      ? "Click 'Show Preview' to see certificate"
                      : "Enter student name to preview"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Certificate;
