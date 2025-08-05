import React, { useState, useRef, useContext, useEffect } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaRedo,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { UploadIcon, XIcon } from "lucide-react";
import { ThemeContext } from "../../components/ThemeContext/ThemeContext";
import axios from "axios";

const ImageUpload = ({ jobHomeId }) => {
  const [files, setFiles] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(false);
  const [description, setDescription] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const { isDarkMode } = useContext(ThemeContext);

  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const MAX_FILE_SIZE = 25 * 1024 * 1024;

  const validateFile = (file) => {
    const errors = [];
    
    if (!file.type.startsWith("image/")) {
      errors.push(`${file.name}: Not a valid image file`);
    }
    
    if (file.size > MAX_FILE_SIZE) {
      errors.push(`${file.name}: File size exceeds 25MB limit (${formatFileSize(file.size)})`);
    }
    
    return errors;
  };

  const token = localStorage.getItem('authToken');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`http://127.0.0.1:8000/api/job-homes/${jobHomeId}/images`, { headers });
        console.log("Fetched images:", response.data);
        setUploadedImages(response.data.images || []);
      } catch (error) {
        console.error("Failed to fetch images:", error);
        setError("Failed to load images. Please refresh the page.");
        setUploadedImages([]);
      } finally {
        setLoading(false);
      }
    };
    if (jobHomeId) {
      fetchImages();
    }
  }, [jobHomeId]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    processFiles(selectedFiles);
  };

  const processFiles = (selectedFiles) => {
    const validFiles = [];
    const errors = [];

    selectedFiles.forEach(file => {
      const fileErrors = validateFile(file);
      if (fileErrors.length === 0) {
        validFiles.push({
          file: file,
          id: `${file.name}-${file.lastModified}-${Date.now()}`,
          name: file.name,
          preview: URL.createObjectURL(file),
          progress: 0,
          error: false,
          uploaded: false,
        });
      } else {
        errors.push(...fileErrors);
      }
    });

    if (errors.length > 0) {
      alert("Some files were rejected:\n" + errors.join("\n"));
    }

    if (validFiles.length > 0) {
      setFiles((prev) => {
        const existingNames = prev.map((f) => f.name);
        const newFiles = validFiles.filter((file) => !existingNames.includes(file.name));
        return [...prev, ...newFiles];
      });
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };

  const removeFile = (id) => {
    const fileToRemove = files.find(f => f.id === id);
    if (fileToRemove && fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    setFiles(files.filter((file) => file.id !== id));
  };

  const deleteImage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) {
      return;
    }
    try {
      await axios.delete(`http://127.0.0.1:8000/api/job-homes/${jobHomeId}/images/${id}`, { headers });
      setUploadedImages((prev) => prev.filter((img) => img.id !== id));
    } catch (error) {
      console.error("Failed to delete image:", error);
      alert("Failed to delete image. Please try again.");
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleUpload = async () => {
    if (files.length === 0 || uploading) {
      return;
    }

    const invalidFiles = [];
    files.forEach(file => {
      const errors = validateFile(file.file);
      if (errors.length > 0) {
        invalidFiles.push(...errors);
      }
    });

    if (invalidFiles.length > 0) {
      alert("Cannot upload due to validation errors:\n" + invalidFiles.join("\n"));
      return;
    }

    setUploading(true);
    setUploadError(false);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("description", description || "No description provided");

    files.forEach((file, index) => {
      formData.append(`images[${index}]`, file.file);
    });

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/job-homes/${jobHomeId}/images`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            ...headers
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);

            setFiles(prev => prev.map(file => ({
              ...file,
              progress: percentCompleted
            })));
          },
        }
      );

      console.log("Upload successful:", response.data);

      if (response.data.images && response.data.images.length > 0) {
        setUploadedImages((prev) => [...response.data.images, ...prev]);
      }

      setFiles(prev => prev.map(file => ({
        ...file,
        uploaded: true,
        progress: 100
      })));

      setUploading(false);
      setUploadProgress(100);

      setTimeout(() => {
        setFiles([]);
        setDescription("");
        setShowPopup(false);
        setUploadProgress(0);
      }, 1500);

    } catch (error) {
      console.error("Upload failed:", error.response?.data || error.message);
      setUploading(false);
      setUploadError(true);
      setUploadProgress(0);

      setFiles(prev => prev.map(file => ({
        ...file,
        error: true,
        progress: 0
      })));

      const errorMessage = error.response?.data?.message || "File upload failed. Please try again.";
      alert(errorMessage);
    }
  };

  const retryFileUpload = () => {
    setFiles(prev => prev.map(file => ({
      ...file,
      error: false,
      progress: 0
    })));
    setUploadError(false);
    handleUpload();
  };

  const openImageViewer = (index) => {
    setSelectedImageIndex(index);
  };

  const closeImageViewer = () => {
    setSelectedImageIndex(null);
  };

  const goToPrev = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex === 0 ? uploadedImages.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex === uploadedImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (loading) {
    return (
      <div className={`min-h-[60vh] p-6 flex items-center justify-center ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading images...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${
        uploadedImages.length === 0 ? "min-h-[60vh]" : "min-h-screen"
      } p-6 transition-colors ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Image Gallery</h1>
          <p className="text-gray-500 mt-1">
            {uploadedImages.length} image{uploadedImages.length !== 1 ? 's' : ''} uploaded
          </p>
        </div>
        <button
          onClick={() => setShowPopup(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-md transition"
        >
          <UploadIcon size={20} /> Upload Images
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
          <button
            onClick={() => window.location.reload()}
            className="ml-2 underline hover:no-underline"
          >
            Refresh
          </button>
        </div>
      )}

      <LayoutGroup>
        {uploadedImages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 mb-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <UploadIcon size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No images uploaded yet</h3>
            <p className="text-gray-500 mb-6">Get started by uploading your first images</p>
            <button
              onClick={() => setShowPopup(true)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition"
            >
              Upload Images
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {uploadedImages.map((img, index) => (
              <motion.div
                key={img.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <div className="relative group">
                  <img
                    src={`http://127.0.0.1:8000${img.image_path}`}
                    alt={img.original_name}
                    className="w-full h-56 object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
                    onClick={() => openImageViewer(index)}
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=';
                    }}
                  />
                  <button
                    onClick={() => deleteImage(img.id)}
                    className="absolute top-3 right-3 p-2 bg-red-600 hover:bg-red-700 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    title="Delete image"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold truncate mb-1" title={img.original_name}>
                    {img.original_name}
                  </h3>
                  <p className="text-sm text-gray-400 mb-2">
                    {formatFileSize(img.file_size)} | {new Date(img.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                    {img.description || "No description"}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </LayoutGroup>

      {/* Upload Popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !uploading && setShowPopup(false)}
          >
            <motion.div
              className={`rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Upload Images</h2>
                {!uploading && (
                  <button
                    onClick={() => setShowPopup(false)}
                    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                  >
                    <XIcon size={20} />
                  </button>
                )}
              </div>

              <div
                className={`border-2 border-dashed rounded-xl p-8 mb-6 text-center transition-all cursor-pointer ${
                  isDragging
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                }`}
                onClick={() => !uploading && fileInputRef.current?.click()}
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
                  disabled={uploading}
                />
                <UploadIcon size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500 mb-2">
                  Drag & drop images or <span className="text-blue-600 font-semibold">browse</span>
                </p>
                <p className="text-sm text-gray-400">
                  Supports: All image formats (JPEG, PNG, JPG, GIF, WebP, TIFF, BMP, SVG, etc.)
                  <br />
                  Maximum file size: {formatFileSize(MAX_FILE_SIZE)} per image
                </p>
              </div>

              {files.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Selected Files ({files.length})</h3>
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {files.map((file) => (
                      <div
                        key={file.id}
                        className={`flex items-center p-3 rounded-lg transition ${
                          isDarkMode ? "bg-gray-700" : "bg-gray-50"
                        }`}
                      >
                        <img
                          src={file.preview}
                          alt={file.name}
                          className="w-12 h-12 object-cover rounded flex-shrink-0"
                        />
                        <div className="ml-3 flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{file.name}</p>
                          <p className="text-xs text-gray-500 mb-1">
                            {formatFileSize(file.file.size)} | {file.file.type}
                          </p>
                          <div className="flex items-center">
                            <div className="flex-1 bg-gray-300 dark:bg-gray-600 rounded-full h-2 mr-2">
                              <div
                                className={`h-2 rounded-full transition-all duration-300 ${
                                  file.error
                                    ? "bg-red-500"
                                    : file.uploaded
                                    ? "bg-green-500"
                                    : "bg-blue-600"
                                }`}
                                style={{ width: `${file.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500">{file.progress}%</span>
                          </div>
                        </div>
                        <div className="flex items-center ml-2">
                          {file.error && (
                            <button
                              onClick={retryFileUpload}
                              className="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded"
                              title="Retry upload"
                            >
                              <FaRedo size={16} />
                            </button>
                          )}
                          {!file.uploaded && !uploading && (
                            <button
                              onClick={() => removeFile(file.id)}
                              className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded ml-1"
                              title="Remove file"
                            >
                              <FaTimesCircle size={16} />
                            </button>
                          )}
                          {file.uploaded && (
                            <FaCheckCircle className="text-green-600 ml-1" size={16} />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Description (Optional)</label>
                <textarea
                  placeholder="Add a description for these images..."
                  className={`w-full p-3 border rounded-lg resize-none transition ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  }`}
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={uploading}
                  maxLength={1000}
                />
                <p className="text-xs text-gray-400 mt-1">{description.length}/1000 characters</p>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowPopup(false)}
                  disabled={uploading}
                  className={`px-6 py-2.5 rounded-lg transition ${
                    uploading
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-gray-300 hover:bg-gray-400 text-gray-700"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!files.length || uploading}
                  className={`px-6 py-2.5 rounded-lg shadow transition ${
                    !files.length || uploading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  } text-white`}
                >
                  {uploading
                    ? `Uploading... ${uploadProgress}%`
                    : `Upload ${files.length} File${files.length !== 1 ? 's' : ''}`
                  }
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Viewer Modal */}
      <AnimatePresence>
        {selectedImageIndex !== null && (
          <motion.div
            className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeImageViewer}
          >
            <motion.div
              key={uploadedImages[selectedImageIndex]?.id}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={`http://127.0.0.1:8000${uploadedImages[selectedImageIndex].image_path}`}
                alt={uploadedImages[selectedImageIndex].original_name}
                className="max-h-[80vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
              />

              {/* Close Button */}
              <button
                onClick={closeImageViewer}
                className="absolute top-2 right-2 sm:top-4 sm:right-4 p-2 rounded-full bg-white/30 text-white backdrop-blur-md hover:bg-white/50 transition"
                aria-label="Close"
              >
                <XIcon size={24} />
              </button>

              {/* Navigation Buttons */}
              {uploadedImages.length > 1 && (
                <>
                  <button
                    onClick={goToPrev}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/30 text-blue-500 backdrop-blur-md hover:bg-white/50 transition"
                    aria-label="Previous image"
                  >
                    <FaChevronLeft size={20} />
                  </button>
                  <button
                    onClick={goToNext}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/30 text-blue-500 backdrop-blur-md hover:bg-white/50 transition"
                    aria-label="Next image"
                  >
                    <FaChevronRight size={20} />
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageUpload;