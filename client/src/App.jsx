import { useState } from "react";
import axios from "axios";

function App() {

  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [analysis, setAnalysis] = useState(null);

  // File selection
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
    <div className="min-h-screen bg-slate-900 text-white">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-5 border-b border-slate-700">

        <h1 className="text-2xl font-bold text-cyan-400">
          ResumeIQ AI
        </h1>

      </nav>

      {/* Main */}
      <div className="max-w-5xl mx-auto px-4 py-16">

        <h1 className="text-5xl font-bold text-center">
          AI Resume Analyzer
        </h1>

        <p className="text-center text-slate-300 mt-4">
          Upload your resume and get ATS insights instantly.
        </p>

        {/* Upload Card */}
        <div className="bg-slate-800 p-10 rounded-2xl mt-12 shadow-lg">

          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="w-full bg-slate-700 p-4 rounded-lg"
          />

          <button
            onClick={handleUpload}
            className="w-full mt-6 bg-cyan-500 hover:bg-cyan-600 py-4 rounded-lg text-lg font-semibold transition"
          >
            {
              loading
                ? "Analyzing Resume..."
                : "Analyze Resume"
            }
          </button>

        </div>

        {/* Results */}
        {
          analysis && (

            <div className="mt-12 space-y-8">

              {/* ATS Score */}
              <div className="bg-slate-800 p-8 rounded-2xl">

                <h2 className="text-3xl font-bold text-cyan-400">
                  ATS Score
                </h2>

                <p className="text-6xl font-bold mt-4">
                  {analysis.atsScore}/100
                </p>

              </div>

              {/* Strengths */}
              <div className="bg-slate-800 p-8 rounded-2xl">

                <h2 className="text-2xl font-bold text-green-400 mb-4">
                  Strengths
                </h2>

                <ul className="space-y-2">
                  {
                    analysis.strengths.map((item, index) => (
                      <li key={index}>
                        {item}
                      </li>
                    ))
                  }
                </ul>

              </div>

              {/* Weaknesses */}
              <div className="bg-slate-800 p-8 rounded-2xl">

                <h2 className="text-2xl font-bold text-red-400 mb-4">
                  Weaknesses
                </h2>

                <ul className="space-y-2">
                  {
                    analysis.weaknesses.map((item, index) => (
                      <li key={index}>
                        {item}
                      </li>
                    ))
                  }
                </ul>

              </div>

              {/* Missing Skills */}
              <div className="bg-slate-800 p-8 rounded-2xl">

                <h2 className="text-2xl font-bold text-yellow-400 mb-4">
                  Missing Skills
                </h2>

                <div className="flex flex-wrap gap-3">

                  {
                    analysis.missingSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-yellow-500/20 border border-yellow-500 px-4 py-2 rounded-full"
                      >
                        {skill}
                      </span>
                    ))
                  }

                </div>

              </div>

              {/* Suggestions */}
              <div className="bg-slate-800 p-8 rounded-2xl">

                <h2 className="text-2xl font-bold text-cyan-400 mb-4">
                  Suggestions
                </h2>

                <ul className="space-y-3">
                  {
                    analysis.suggestions.map((item, index) => (
                      <li key={index}>
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