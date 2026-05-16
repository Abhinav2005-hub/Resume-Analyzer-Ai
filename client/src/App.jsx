import { useState } from "react";
import axios from "axios";

function App() {

  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resumeText, setResumeText] = useState("");

  // Handle file selection
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Upload PDF
  const handleUpload = async () => {

    if (!selectedFile) {
      alert("Please select a PDF file");
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

      setResumeText(response.data.extractedText);

    } catch (error) {
      console.log(error);
      alert("Error uploading resume");
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

      {/* Main Section */}
      <div className="max-w-4xl mx-auto px-4 py-16">

        <h1 className="text-5xl font-bold text-center">
          Upload Your Resume
        </h1>

        <p className="text-center text-slate-300 mt-4">
          Upload PDF and extract resume text instantly.
        </p>

        {/* Upload Box */}
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
                ? "Uploading..."
                : "Upload Resume"
            }
          </button>

        </div>

        {/* Extracted Text */}
        {
          resumeText && (
            <div className="bg-slate-800 p-6 rounded-2xl mt-10">
              
              <h2 className="text-2xl font-bold mb-4 text-cyan-400">
                Extracted Resume Text
              </h2>

              <div className="max-h-[500px] overflow-y-auto whitespace-pre-wrap text-slate-300">
                {resumeText}
              </div>

            </div>
          )
        }

      </div>

    </div>
  );
}

export default App;