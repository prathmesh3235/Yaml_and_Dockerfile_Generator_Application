import React, { useState, useRef, useEffect } from "react";
import ConfigForm from "./components/ConfigForm";
import { generateDockerfile } from "./generators/dockerfileGenerator";
import { generateGitlabCI } from "./generators/gitlabCIGenerator";
import Modal from "./../src/Modal";

function App() {
  const [generatedFiles, setGeneratedFiles] = useState(null);
  const [copiedDockerfile, setCopiedDockerfile] = useState(false);
  const [copiedGitLabCI, setCopiedGitLabCI] = useState(false);
  const [isDockerModalOpen, setIsDockerModalOpen] = useState(false);
  const [isYMLModalOpen, setIsYMLModalOpen] = useState(false);
  const dockerfileRef = useRef(null);

  const handleDockerInstructions = () => setIsDockerModalOpen(true);
  const handleYMLInstructions = () => setIsYMLModalOpen(true);
  const handleCloseModal = () => {
    setIsDockerModalOpen(false);
    setIsYMLModalOpen(false);
  };

  const handleSubmit = async (config) => {
    try {
      const dockerfile = generateDockerfile(config);
      const gitlabCI = generateGitlabCI(config);
      setGeneratedFiles({ dockerfile, gitlabCI });
    } catch (error) {
      console.error("Error generating files:", error);
      alert("An error occurred while generating the files. Please try again.");
    }
  };

  useEffect(() => {
    if (generatedFiles) {
      dockerfileRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [generatedFiles]);

  const downloadFile = (content, filename) => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const copyToClipboard = (text, setCopied) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ConfigForm onSubmit={handleSubmit} />
      {generatedFiles && (
        <div className="mt-8" ref={dockerfileRef}>
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
              <h2 className="text-xl font-bold mt-3 sm:mb-0">Dockerfile:</h2>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() =>
                    copyToClipboard(
                      generatedFiles.dockerfile,
                      setCopiedDockerfile
                    )
                  }
                  className="px-2 py-1 text-white bg-blue-500 rounded hover:bg-blue-700 text-sm"
                >
                  {copiedDockerfile ? "Copied!" : "Copy To Clipboard"}
                </button>
                <button
                  onClick={() =>
                    downloadFile(generatedFiles.dockerfile, "Dockerfile")
                  }
                  className="px-2 py-1 text-white bg-green-500 rounded hover:bg-green-700 text-sm"
                >
                  Download File
                </button>
                <button
                  onClick={handleDockerInstructions}
                  className="px-2 py-1 text-white bg-gray-500 rounded hover:bg-gray-700 text-sm"
                >
                  Instructions
                </button>
              </div>
            </div>
            <pre className="bg-gray-200 p-4 rounded overflow-x-auto text-sm">
              {generatedFiles.dockerfile}
            </pre>
          </div>
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
              <h2 className="text-xl font-bold mb-2 sm:mb-0">
                .gitlab-ci.yml:
              </h2>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() =>
                    copyToClipboard(generatedFiles.gitlabCI, setCopiedGitLabCI)
                  }
                  className="px-2 py-1 text-white bg-blue-500 rounded hover:bg-blue-700 text-sm"
                >
                  {copiedGitLabCI ? "Copied!" : "Copy To Clipboard"}
                </button>
                <button
                  onClick={() =>
                    downloadFile(generatedFiles.gitlabCI, "..gitlab-ci.yml")
                  }
                  className="px-2 py-1 text-white bg-green-500 rounded hover:bg-green-700 text-sm"
                >
                  Download File
                </button>
                <button
                  onClick={handleYMLInstructions}
                  className="px-2 py-1 text-white bg-gray-500 rounded hover:bg-gray-700 text-sm"
                >
                  Instructions
                </button>
              </div>
            </div>
            <pre className="bg-gray-200 p-4 rounded overflow-x-auto text-sm">
              {generatedFiles.gitlabCI}
            </pre>
          </div>
        </div>
      )}
      <Modal
        isOpen={isDockerModalOpen}
        onClose={handleCloseModal}
        title="Dockerfile Instructions"
      >
        <p className="text-sm">
          Place this Dockerfile to your GitLab Repository
        </p>
      </Modal>
      <Modal
        isOpen={isYMLModalOpen}
        onClose={handleCloseModal}
        title=".gitlab-ci.yml Instructions"
      >
        <p className="text-sm">
          1. Place this file in the root of your GitLab Repository.
          <br />
          2. GitLab CI/CD will automatically detect this file and use it to
          configure the CI/CD pipeline.
        </p>
      </Modal>
    </div>
  );
}

export default App;
