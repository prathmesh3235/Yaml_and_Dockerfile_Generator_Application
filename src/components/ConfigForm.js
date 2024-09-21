import React, { useState } from "react";
import Modal from "../Modal";

const ConfigForm = ({ onSubmit }) => {
  const [config, setConfig] = useState({
    rVersion: "",
    dependencies: [],
    baseImage: "",
    systemPackages: "",
    customCommands: "",
    exposePorts: false,
    ports: "",
    workdir: "/app",
    copyFiles: false,
    entrypoint: "",
  });

  const [errors, setErrors] = useState({
    systemPackages: "",
    customCommands: "",
    ports: "",
    workdir: "",
    entrypoint: "",
  });

  const [isModalOpen, setModalOpen] = useState(false);
  const [isBaseImageModalOpen, setBaseImageModalOpen] = useState(false);

  const validateSystemPackages = (packages) => {
    if (!packages) return "";
    const packageArray = packages.split(" ");
    for (let pkg of packageArray) {
      if (!/^[a-z0-9-]+$/.test(pkg)) {
        return "System packages must contain only lowercase letters, numbers, and hyphens.";
      }
    }
    return "";
  };

  const validateCustomCommands = (commands) => {
    if (!commands) return "";
    const commandLines = commands.split("\n");
    for (let line of commandLines) {
      if (!line.trim().startsWith("RUN ")) {
        return "Each line of custom commands must start with 'RUN '.";
      }
    }
    return "";
  };

  const validatePorts = (ports) => {
    if (!ports) return "";
    const portArray = ports.split(",");
    for (let port of portArray) {
      port = port.trim();
      if (!/^\d+$/.test(port) || parseInt(port) < 1 || parseInt(port) > 65535) {
        return "Ports must be valid numbers between 1 and 65535, separated by commas.";
      }
    }
    return "";
  };

  const validateWorkdir = (workdir) => {
    if (!workdir) return "Working directory cannot be empty.";
    if (!/^\/[a-zA-Z0-9-_/]+$/.test(workdir)) {
      return "Working directory must be a valid Unix path.";
    }
    return "";
  };

  const validateEntrypoint = (entrypoint) => {
    if (!entrypoint) return "";
    if (!/^[a-zA-Z0-9-_./\s]+$/.test(entrypoint)) {
      return "Entrypoint must contain only letters, numbers, spaces, and common symbols.";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === "checkbox" ? checked : value;
    let error = "";

    switch (name) {
      case "systemPackages":
        error = validateSystemPackages(newValue);
        break;
      case "customCommands":
        error = validateCustomCommands(newValue);
        break;
      case "ports":
        error = validatePorts(newValue);
        break;
      case "workdir":
        error = validateWorkdir(newValue);
        break;
      case "entrypoint":
        error = validateEntrypoint(newValue);
        break;
    }

    setConfig((prev) => ({ ...prev, [name]: newValue }));
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleDependencyChange = (dependency) => {
    setConfig((prev) => ({
      ...prev,
      dependencies: prev.dependencies.includes(dependency)
        ? prev.dependencies.filter((dep) => dep !== dependency)
        : [...prev.dependencies, dependency],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields before submission
    const newErrors = {
      systemPackages: validateSystemPackages(config.systemPackages),
      customCommands: validateCustomCommands(config.customCommands),
      ports: validatePorts(config.ports),
      workdir: validateWorkdir(config.workdir),
      entrypoint: validateEntrypoint(config.entrypoint),
    };

    setErrors(newErrors);

    if (!config.rVersion) {
      setModalOpen(true);
      return;
    }
    if (!config.baseImage) {
      setBaseImageModalOpen(true);
      return;
    }

    // Check if there are any errors
    if (Object.values(newErrors).some(error => error !== "")) {
      return;
    }

    onSubmit(config);
  };

  const closeModal = () => {
    setModalOpen(false);
    setBaseImageModalOpen(false);
  };

  const dependenciesOptions = [
    "tidyverse",
    "data.table",
    "shiny",
    "ggplot2",
    "dplyr",
    "knitr",
  ];
  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-6">
        {" "}
        Dockerfile and .gitlab-ci.yml Generator
      </h2>
      <h3 className="text-xl font-semibold mb-3">Input Your Configuration</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="rVersion"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              R Version
            </label>
            <select
              id="rVersion"
              name="rVersion"
              value={config.rVersion}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="">Select R Version</option>
              {["4.2.0", "4.1.3", "4.0.5", "3.6.3"].map((version) => (
                <option key={version} value={version}>
                  {version}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="baseImage"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Base Image
            </label>
            <select
              id="baseImage"
              name="baseImage"
              value={config.baseImage}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="">Select R Base Image</option>
              <option value="rocker/r-ver">rocker/r-ver</option>
              <option value="rocker/tidyverse">rocker/tidyverse</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            R Dependencies
          </label>
          <div className="grid grid-cols-2 gap-2">
            {dependenciesOptions.map((dependency) => (
              <div key={dependency} className="flex items-center">
                <input
                  type="checkbox"
                  id={dependency}
                  checked={config.dependencies.includes(dependency)}
                  onChange={() => handleDependencyChange(dependency)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor={dependency}
                  className="ml-2 text-sm text-gray-900"
                >
                  {dependency}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label
            htmlFor="systemPackages"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            System Packages (space-separated)
          </label>
          <input
            type="text"
            id="systemPackages"
            name="systemPackages"
            value={config.systemPackages}
            onChange={handleChange}
            placeholder="e.g., libcurl4-openssl-dev libssl-dev libxml2-dev"
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
              errors.systemPackages ? "border-red-500" : ""
            }`}
          />
          {errors.systemPackages && (
            <p className="text-red-500 text-sm mt-1">{errors.systemPackages}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="customCommands"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Custom Commands
          </label>
          <textarea
            id="customCommands"
            name="customCommands"
            value={config.customCommands}
            onChange={handleChange}
            rows="3"
            placeholder="RUN command1&#10;RUN command2"
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
              errors.customCommands ? "border-red-500" : ""
            }`}
          ></textarea>
          {errors.customCommands && (
            <p className="text-red-500 text-sm mt-1">{errors.customCommands}</p>
          )}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="exposePorts"
            name="exposePorts"
            checked={config.exposePorts}
            onChange={handleChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label
            htmlFor="exposePorts"
            className="ml-2 block text-sm text-gray-900"
          >
            Expose Ports
          </label>
        </div>

        {config.exposePorts && (
          <div>
            <label
              htmlFor="ports"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Ports (comma-separated)
            </label>
            <input
              type="text"
              id="ports"
              name="ports"
              value={config.ports}
              onChange={handleChange}
              placeholder="e.g., 3838, 8787"
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
                errors.ports ? "border-red-500" : ""
              }`}
            />
            {errors.ports && (
              <p className="text-red-500 text-sm mt-1">{errors.ports }</p>
            )}
          </div>
        )}

<div>
          <label
            htmlFor="workdir"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Working Directory
          </label>
          <input
            type="text"
            id="workdir"
            name="workdir"
            value={config.workdir}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
              errors.workdir ? "border-red-500" : ""
            }`}
          />
          {errors.workdir && (
            <p className="text-red-500 text-sm mt-1">{errors.workdir}</p>
          )}
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="copyFiles"
            name="copyFiles"
            checked={config.copyFiles}
            onChange={handleChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label
            htmlFor="copyFiles"
            className="ml-2 block text-sm text-gray-900"
          >
            Copy Files to Container
          </label>
        </div>

        <div>
          <label
            htmlFor="entrypoint"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Entrypoint
          </label>
          <input
            type="text"
            id="entrypoint"
            name="entrypoint"
            value={config.entrypoint}
            onChange={handleChange}
            placeholder="e.g., Rscript /app/main.R"
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
              errors.entrypoint ? "border-red-500" : ""
            }`}
          />
          {errors.entrypoint && (
            <p className="text-red-500 text-sm mt-1">{errors.entrypoint}</p>
          )}
        </div>

        <div>
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Generate Files
          </button>
        </div>
      </form>

      {/* Modal component */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Missing R Version"
      >
        <p>Please select an R version to proceed.</p>
      </Modal>
      <Modal
        isOpen={isBaseImageModalOpen}
        onClose={closeModal}
        title="Missing Base Image"
      >
        <p>Please select a Base image to proceed.</p>
      </Modal>
    </div>
  );
};

export default ConfigForm;
