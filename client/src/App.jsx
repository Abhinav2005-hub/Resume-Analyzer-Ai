import { useState } from "react";
import axios from "axios";

import { motion } from "framer-motion";

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
        `${import.meta.env.VITE_API_URL}/api/resume/upload`,
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

      alert(
        error?.response?.data?.message ||
        "Something went wrong"
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">

      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-cyan-500/10 blur-[180px] rounded-full"></div>

      {/* Navbar */}
      <nav className="relative z-10 flex justify-between items-center px-8 py-6 border-b border-slate-800 backdrop-blur-xl">

        <h1 className="text-3xl font-black text-cyan-400 tracking-tight">
          ResumeIQ AI
        </h1>

        <button className="bg-cyan-500/20 border border-cyan-400/30 px-5 py-2 rounded-full text-cyan-300 font-semibold backdrop-blur-lg">
          AI Resume Analyzer
        </button>

      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-32 flex flex-col items-center">

        {/* Hero */}
        <div className="text-center max-w-5xl">

          <div className="inline-block px-5 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-sm font-medium mb-8">
            AI-Powered ATS Resume Analyzer
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight">

            Analyze Your Resume

            <br />

            <span className="text-cyan-400">
              Using AI
            </span>

          </h1>

          <p className="text-slate-400 mt-10 text-xl leading-relaxed max-w-3xl mx-auto">

            Upload your resume and instantly receive ATS score,
            strengths, weaknesses, missing skills,
            and AI-powered improvement suggestions.

          </p>

        </div>

        {/* Upload Card */}
        <div className="w-full max-w-4xl mt-20 bg-slate-900/70 backdrop-blur-2xl border border-cyan-500/20 rounded-[36px] p-12 shadow-[0_0_80px_rgba(6,182,212,0.15)]">

          {/* Upload Area */}
          <label className="block">

            <div className="border-2 border-dashed border-slate-700 hover:border-cyan-400 transition duration-300 rounded-3xl p-14 text-center cursor-pointer bg-slate-800/40">

              <p className="text-3xl font-bold text-slate-200">
                Upload Resume PDF
              </p>

              <p className="text-slate-500 mt-4 text-lg">
                Drag & drop or click to browse
              </p>

              {
                selectedFile && (
                  <p className="mt-6 text-cyan-400 font-semibold text-lg">
                    {selectedFile.name}
                  </p>
                )
              }

              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />

            </div>

          </label>

          {/* Analyze Button */}
          <button
            onClick={handleUpload}
            className="w-full mt-10 bg-cyan-500 hover:bg-cyan-400 py-5 rounded-2xl text-xl font-bold transition duration-300 hover:scale-[1.02] shadow-lg shadow-cyan-500/30"
          >
            {
              loading
                ? "Analyzing Resume..."
                : "Analyze Resume"
            }
          </button>

        </div>

        {/* Loading */}
        {
          loading && (
            <div className="flex flex-col items-center mt-20">

              <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>

              <p className="mt-6 text-slate-400 text-lg">
                AI is analyzing your resume...
              </p>

            </div>
          )
        }

        {/* Results */}
        {
          analysis && !loading && (

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-6xl mt-28 space-y-10"
            >

              {/* Resume Summary */}
              <div className="bg-slate-900/70 backdrop-blur-2xl border border-cyan-500/20 rounded-[36px] p-12 shadow-[0_0_50px_rgba(6,182,212,0.08)]">

                <h2 className="text-3xl font-black text-cyan-400 mb-6">
                  Resume Summary
                </h2>

                <p className="text-slate-300 text-lg leading-relaxed">
                {analysis?.summary || "No summary available"}
                </p>

              </div>

              {/* ATS Score */}
              <div className="bg-slate-900/70 backdrop-blur-2xl border border-cyan-500/20 rounded-[36px] p-14 text-center shadow-[0_0_50px_rgba(6,182,212,0.08)]">

                <h2 className="text-4xl font-black text-cyan-400">
                  ATS Score
                </h2>

                <div className="flex justify-center mt-12">

                  <div className="w-56 h-56 rounded-full border-[12px] border-cyan-400 flex items-center justify-center shadow-[0_0_50px_rgba(6,182,212,0.35)]">

                    <span className="text-7xl font-black">
                      {analysis.atsScore}
                    </span>

                  </div>

                </div>

              </div>

              {/* Strengths + Weaknesses */}
              <div className="grid md:grid-cols-2 gap-8">

                {/* Strengths */}
                <div className="bg-green-500/10 border border-green-500/20 p-10 rounded-[32px] backdrop-blur-xl">

                  <h2 className="text-3xl font-black text-green-400 flex items-center gap-3 mb-8">
                    <FaCheckCircle />
                    Strengths
                  </h2>

                  <ul className="space-y-5">

                    {
                      (analysis?.strengths || []).map((item, index) => (
                        <li
                          key={index}
                          className="text-slate-300 text-lg"
                        >
                          {item}
                        </li>
                      ))
                    }

                  </ul>

                </div>

                {/* Weaknesses */}
                <div className="bg-red-500/10 border border-red-500/20 p-10 rounded-[32px] backdrop-blur-xl">

                  <h2 className="text-3xl font-black text-red-400 flex items-center gap-3 mb-8">
                    <FaTimesCircle />
                    Weaknesses
                  </h2>

                  <ul className="space-y-5">

                    {
                      (analysis?.weaknesses || []).map((item, index) => (
                        <li
                          key={index}
                          className="text-slate-300 text-lg"
                        >
                          {item}
                        </li>
                      ))
                    }

                  </ul>

                </div>

              </div>

              {/* Missing Skills */}
              <div className="bg-yellow-500/10 border border-yellow-500/20 p-10 rounded-[32px] backdrop-blur-xl">

                <h2 className="text-3xl font-black text-yellow-400 flex items-center gap-3 mb-8">
                  <FaExclamationTriangle />
                  Missing Skills
                </h2>

                <div className="flex flex-wrap gap-4">

                  {
                    (analysis?.missingSkills || []).map((skill, index) => (
                      <span
                        key={index}
                        className="bg-yellow-500/20 border border-yellow-500/30 px-6 py-3 rounded-full font-semibold text-lg"
                      >
                        {skill}
                      </span>
                    ))
                  }

                </div>

              </div>

              {/* Recommended Roles */}
              <div className="bg-purple-500/10 border border-purple-500/20 p-10 rounded-[32px] backdrop-blur-xl">

                <h2 className="text-3xl font-black text-purple-400 mb-8">
                  Recommended Roles
                </h2>

                <div className="flex flex-wrap gap-4">

                  {
                    (analysis?.recommendedRoles || []).map((role, index) => (
                      <span
                        key={index}
                        className="bg-purple-500/20 border border-purple-500/30 px-6 py-3 rounded-full font-semibold text-lg"
                      >
                        {role}
                      </span>
                    ))
                  }

                </div>

              </div>

              {/* Suggestions */}
              <div className="bg-cyan-500/10 border border-cyan-500/20 p-10 rounded-[32px] backdrop-blur-xl">

                <h2 className="text-3xl font-black text-cyan-400 flex items-center gap-3 mb-8">
                  <FaLightbulb />
                  Suggestions
                </h2>

                <ul className="space-y-5">

                  {
                    (analysis?.suggestions || []).map((item, index) => (
                      <li
                        key={index}
                        className="text-slate-300 text-lg leading-relaxed"
                      >
                        {item}
                      </li>
                    ))
                  }

                </ul>

              </div>

            </motion.div>
          )
        }

      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center py-10 text-slate-500 border-t border-slate-800">
        Powered by AI • Built with React + Node.js
      </footer>

    </div>
  );
}

export default App;