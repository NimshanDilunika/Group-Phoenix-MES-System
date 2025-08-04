import React, { useState, useRef, useContext } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaRedo,
  FaTrash,
} from "react-icons/fa";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { UploadIcon, XIcon } from "lucide-react";
import { ThemeContext } from "../../components/ThemeContext/ThemeContext";

const ImageUpload = () => {
  const [files, setFiles] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(false);
  const [description, setDescription] = useState("");
  const [uploadDate, setUploadDate] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);

  const fileInputRef = useRef(null);
  const { isDarkMode } = useContext(ThemeContext);

  // Prevent duplicates when selecting files
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files).map((file) => ({
      ...file,
      id: `${file.name}-${file.lastModified}`,
      preview: URL.createObjectURL(file),
      progress: 0,
      error: false,
      uploaded: false,
    }));

    setFiles((prev) => {
      const existingIds = prev.map((f) => f.id);
      const newFiles = selectedFiles.filter(
        (file) => !existingIds.includes(file.id)
      );
      return [...prev, ...newFiles];
    });
  };

  // Drag and drop handlers with duplicate prevention
  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files)
      .filter((f) => f.type.startsWith("image/"))
      .map((file) => ({
        ...file,
        id: `${file.name}-${file.lastModified}`,
        preview: URL.createObjectURL(file),
        progress: 0,
        error: false,
        uploaded: false,
      }));

    setFiles((prev) => {
      const existingIds = prev.map((f) => f.id);
      const newFiles = droppedFiles.filter(
        (file) => !existingIds.includes(file.id)
      );
      return [...prev, ...newFiles];
    });
  };

  const removeFile = (id) => {
    setFiles(files.filter((file) => file.id !== id));
  };

  const simulateUpload = () => {
    if (files.length === 0) return;
    setUploading(true);
    setUploadError(false);
    setUploadProgress(0);

    let completedFiles = 0;
    let hasErrors = false;

    files.forEach((file, index) => {
      setTimeout(() => {
        const fileInterval = setInterval(() => {
          setFiles((currentFiles) => {
            const updated = [...currentFiles];
            const fileIndex = updated.findIndex((f) => f.id === file.id);
            if (fileIndex === -1) return currentFiles;

            let newProgress = (updated[fileIndex].progress || 0) + 8;

            // Random error simulation
            if (
              newProgress > 40 &&
              newProgress < 85 &&
              Math.random() < 0.08 &&
              !updated[fileIndex].error
            ) {
              updated[fileIndex].error = true;
              hasErrors = true;
              clearInterval(fileInterval);
              return updated;
            }

            if (newProgress >= 100) {
              newProgress = 100;
              updated[fileIndex].progress = 100;
              updated[fileIndex].uploaded = true;
              completedFiles++;
              clearInterval(fileInterval);

              setUploadedImages((prev) => [
                {
                  id: Date.now() + Math.random(),
                  name: file.name,
                  size: `${(file.size / 1024).toFixed(2)} KB`,
                  date: uploadDate || new Date().toISOString().split("T")[0],
                  description,
                  url: file.preview,
                },
                ...prev,
              ]);

              if (completedFiles === files.length) {
                setUploading(false);
                setUploadError(hasErrors);
                if (!hasErrors) {
                  setTimeout(() => {
                    setShowPopup(false);
                    setFiles([]);
                    setDescription("");
                    setUploadDate("");
                  }, 1000);
                }
              }
            } else {
              updated[fileIndex].progress = newProgress;
            }

            setUploadProgress(
              Math.floor(
                updated.reduce((sum, f) => sum + (f.progress || 0), 0) /
                  updated.length
              )
            );

            return updated;
          });
        }, 200);
      }, index * 300);
    });
  };

  const retryFileUpload = (id) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, error: false, progress: 0 } : f
      )
    );
    simulateUpload();
  };

  const deleteImage = (id) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== id));
  };

  return (
    <div
      className={`${
        uploadedImages.length === 0 ? "min-h-[60vh]" : "min-h-screen"
      } p-6 transition-colors ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Image Gallery</h1>
        <button
          onClick={() => setShowPopup(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-md transition"
        >
          <UploadIcon size={20} /> Upload Images
        </button>
      </div>

      {/* Gallery */}
      <LayoutGroup>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {uploadedImages.map((img) => (
            <motion.div
              key={img.id}
              layout
              className={`rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="relative group">
                <img
                  src={img.url}
                  alt={img.name}
                  className="w-full h-56 object-cover"
                />
                <button
                  onClick={() => deleteImage(img.id)}
                  className="absolute top-3 right-3 p-2 bg-red-600 hover:bg-red-700 rounded-full text-white opacity-0 group-hover:opacity-100 transition"
                >
                  <FaTrash size={14} />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold truncate">{img.name}</h3>
                <p className="text-sm text-gray-400">
                  {img.size} | {img.date}
                </p>
                <p className="mt-2 text-sm line-clamp-2">
                  {img.description || "No description"}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </LayoutGroup>

      {/* Upload Popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`rounded-2xl p-6 w-full max-w-xl shadow-2xl ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Title */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Upload Images</h2>
                <button
                  onClick={() => setShowPopup(false)}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <XIcon size={18} />
                </button>
              </div>

              {/* Drag & Drop */}
              <div
                className={`border-2 border-dashed rounded-xl p-8 mb-4 text-center transition cursor-pointer ${
                  isDragging
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onClick={() => fileInputRef.current.click()}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                <p className="text-gray-500">
                  Drag & drop or <span className="text-blue-600">browse</span>
                </p>
              </div>

              {/* File List */}
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg mb-2"
                >
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="ml-3 flex-1">
                    <p className="text-sm truncate">{file.name}</p>
                    <div className="w-full bg-gray-300 rounded h-2 mt-1">
                      <div
                        className={`h-2 rounded ${
                          file.error ? "bg-red-500" : "bg-blue-600"
                        }`}
                        style={{ width: `${file.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  {file.error && (
                    <button
                      onClick={() => retryFileUpload(file.id)}
                      className="ml-2 text-blue-600"
                    >
                      <FaRedo />
                    </button>
                  )}
                  {!file.uploaded && !uploading && (
                    <button
                      onClick={() => removeFile(file.id)}
                      className="ml-2 text-red-600"
                    >
                      <FaTimesCircle />
                    </button>
                  )}
                  {file.uploaded && (
                    <FaCheckCircle className="ml-2 text-green-600" />
                  )}
                </div>
              ))}

              {/* Description */}
              <textarea
                placeholder="Description"
                className="w-full p-3 border rounded-lg mb-3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>

              {/* Date */}
              <input
                type="date"
                className="w-full p-3 border rounded-lg mb-4"
                value={uploadDate}
                onChange={(e) => setUploadDate(e.target.value)}
              />

              {/* Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowPopup(false)}
                  className="px-5 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={simulateUpload}
                  disabled={!files.length || uploading}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
                >
                  {uploading
                    ? `Uploading (${uploadProgress}%)`
                    : "Upload Files"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageUpload;