import { useState } from "react";
import axios from "axios";

import {
  FaCheckCircle,
  FaTimesCircle,
  FaLightbulb,
  FaExclamationTriangle,
} from "react-icons/fa";

function App() {

  const [selectedFile, setSelectedFile] = useState(null);

  const [loading, setLoading] = useState(false);

  const [analysis, setAnalysis] = useState(null);

  // File Selection
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Upload Resume
  const handleUpload = async () => {

    if (!selectedFile) {
      alert("Please select a PDF");
      return;
    }

    try {

      setLoading(true);

      const formData = new FormData();

      formData.append("resume", selectedFile);

      const response = await axios.post(
        "http://localhost:5000/api/resume/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setAnalysis(response.data.analysis);

    } catch (error) {

      console.log(error);

      alert("Error analyzing resume");

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-5 border-b border-slate-800 backdrop-blur-lg">

        <h1 className="text-3xl font-bold text-cyan-400">
          ResumeIQ AI
        </h1>

        <button className="bg-cyan-500 hover:bg-cyan-600 px-5 py-2 rounded-xl font-semibold transition">
          AI Resume Analyzer
        </button>

      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">

        <div className="text-center">

          <h1 className="text-6xl font-extrabold leading-tight">
            Analyze Your Resume
            <span className="text-cyan-400"> Using AI</span>
          </h1>

          <p className="text-slate-400 mt-6 text-xl max-w-3xl mx-auto">
            Upload your resume and get instant ATS score,
            strengths, weaknesses, missing skills,
            and AI-powered improvement suggestions.
          </p>

        </div>

        {/* Upload Card */}
        <div className="max-w-3xl mx-auto mt-14 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl">

          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="w-full bg-slate-800 p-4 rounded-xl border border-slate-700"
          />

          <button
            onClick={handleUpload}
            className="w-full mt-6 bg-cyan-500 hover:bg-cyan-600 py-4 rounded-xl text-lg font-bold transition duration-300"
          >
            {
              loading
                ? "Analyzing Resume..."
                : "Analyze Resume"
            }
          </button>

        </div>

        {/* Loading Animation */}
        {
          loading && (
            <div className="flex flex-col items-center mt-16">

              <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>

              <p className="mt-5 text-slate-400 text-lg">
                AI is analyzing your resume...
              </p>

            </div>
          )
        }

        {/* Results */}
        {
          analysis && !loading && (

            <div className="mt-20 space-y-10">

              {/* ATS SCORE */}
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-10 text-center shadow-xl">

                <h2 className="text-3xl font-bold text-cyan-400">
                  ATS Score
                </h2>

                <div className="flex justify-center mt-8">

                  <div className="w-44 h-44 rounded-full border-[10px] border-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/20">

                    <span className="text-5xl font-extrabold">
                      {analysis.atsScore}
                    </span>

                  </div>

                </div>

              </div>

              {/* GRID */}
              <div className="grid md:grid-cols-2 gap-8">

                {/* Strengths */}
                <div className="bg-green-500/10 border border-green-500/20 p-8 rounded-3xl">

                  <h2 className="text-2xl font-bold text-green-400 flex items-center gap-3 mb-6">
                    <FaCheckCircle />
                    Strengths
                  </h2>

                  <ul className="space-y-4">

                    {
                      analysis.strengths.map((item, index) => (
                        <li
                          key={index}
                          className="text-slate-300"
                        >
                          {item}
                        </li>
                      ))
                    }

                  </ul>

                </div>

                {/* Weaknesses */}
                <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-3xl">

                  <h2 className="text-2xl font-bold text-red-400 flex items-center gap-3 mb-6">
                    <FaTimesCircle />
                    Weaknesses
                  </h2>

                  <ul className="space-y-4">

                    {
                      analysis.weaknesses.map((item, index) => (
                        <li
                          key={index}
                          className="text-slate-300"
                        >
                          {item}
                        </li>
                      ))
                    }

                  </ul>

                </div>

              </div>

              {/* Missing Skills */}
              <div className="bg-yellow-500/10 border border-yellow-500/20 p-8 rounded-3xl">

                <h2 className="text-2xl font-bold text-yellow-400 flex items-center gap-3 mb-6">
                  <FaExclamationTriangle />
                  Missing Skills
                </h2>

                <div className="flex flex-wrap gap-4">

                  {
                    analysis.missingSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-yellow-500/20 border border-yellow-500/30 px-5 py-3 rounded-full font-medium"
                      >
                        {skill}
                      </span>
                    ))
                  }

                </div>

              </div>

              {/* Suggestions */}
              <div className="bg-cyan-500/10 border border-cyan-500/20 p-8 rounded-3xl">

                <h2 className="text-2xl font-bold text-cyan-400 flex items-center gap-3 mb-6">
                  <FaLightbulb />
                  Suggestions
                </h2>

                <ul className="space-y-5">

                  {
                    analysis.suggestions.map((item, index) => (
                      <li
                        key={index}
                        className="text-slate-300"
                      >
                        {item}
                      </li>
                    ))
                  }

                </ul>

              </div>

            </div>
          )
        }

      </div>

    </div>
  );
}

export default App;