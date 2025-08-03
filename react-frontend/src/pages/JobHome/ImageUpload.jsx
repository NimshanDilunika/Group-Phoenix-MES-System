import React, { useState, useContext } from "react";
import { FaCloudUploadAlt, FaCheckCircle, FaTimesCircle, FaRedo, FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";
import { UploadIcon } from "lucide-react";
import { ThemeContext } from "../../components/ThemeContext/ThemeContext";

const ImageUpload = () => {
  const [files, setFiles] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(false);
  const [description, setDescription] = useState("");
  const [uploadDate, setUploadDate] = useState("");
  const [uploadedImages, setUploadedImages] = useState([
    {
      id: 1,
      name: "sunset.jpg",
      size: "240 KB",
      date: "2025-06-01",
      description: "Beautiful sunset at the beach",
      url: "https://via.placeholder.com/300x200?text=Sunset",
    },
    {
      id: 2,
      name: "forest.jpg",
      size: "180 KB",
      date: "2025-06-02",
      description: "Green forest landscape",
      url: "https://via.placeholder.com/300x200?text=Forest",
    },
    {
      id: 3,
      name: "mountains.jpg",
      size: "300 KB",
      date: "2025-06-03",
      description: "Snowy mountain view",
      url: "https://via.placeholder.com/300x200?text=Mountains",
    },
  ]);

  const { isDarkMode } = useContext(ThemeContext);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFiles([file]);
    }
  };

  const simulateUpload = () => {
    setUploading(true);
    setUploadError(false);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          const newImage = {
            id: Date.now(),
            name: files[0].name,
            size: `${(files[0].size / 1024).toFixed(2)} KB`,
            date: uploadDate || new Date().toISOString().split("T")[0],
            description: description,
            url: URL.createObjectURL(files[0]),
          };
          setUploadedImages([newImage, ...uploadedImages]);
          setShowPopup(false);
          setFiles([]);
          setDescription("");
          setUploadDate("");
          return 100;
        }
        if (prev > 75) {
          clearInterval(interval);
          setUploading(false);
          setUploadError(true);
          return prev;
        }
        return prev + 10;
      });
    }, 300);
  };

  const retryUpload = () => {
    setUploadProgress(0);
    simulateUpload();
  };

  return (
    <div className={`flex flex-col p-6 flex-grow ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Uploaded Images</h1>
        <button
          onClick={() => setShowPopup(true)}
          className="flex items-center px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
        >
          <UploadIcon size={18} className="mr-2" />
          Upload Image
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {uploadedImages.map((img) => (
          <div key={img.id} className="bg-white dark:bg-gray-800 shadow-md rounded-xl overflow-hidden">
            <img src={img.url} alt={img.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1">{img.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{img.size} | {img.date}</p>
              <p className="mt-2 text-sm">{img.description}</p>
            </div>
          </div>
        ))}
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-lg"
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full mb-4 p-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-100 dark:bg-gray-700"
            />

            {files.length > 0 && (
              <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded mb-4 flex items-center justify-between">
                <span className="text-sm">{files[0].name}</span>
                <FaTrash
                  onClick={() => setFiles([])}
                  className="text-red-600 cursor-pointer"
                />
              </div>
            )}

            <textarea
              placeholder="Enter description..."
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded mb-4 bg-gray-100 dark:bg-gray-700"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>

            <input
              type="date"
              className="w-full mb-4 p-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-100 dark:bg-gray-700"
              value={uploadDate}
              onChange={(e) => setUploadDate(e.target.value)}
            />

            {uploading && (
              <div className="mb-4">
                <p className="mb-2">Uploading... {uploadProgress}%</p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {uploadError && (
              <div className="text-red-500 flex items-center gap-2 mb-4">
                <FaTimesCircle /> Error uploading
                <button
                  onClick={retryUpload}
                  className="ml-auto text-blue-600 hover:underline"
                >
                  <FaRedo className="inline mr-1" /> Retry
                </button>
              </div>
            )}

            {!uploading && !uploadError && uploadProgress === 100 && (
              <div className="text-green-600 flex items-center gap-2 mb-4">
                <FaCheckCircle /> Upload successful!
              </div>
            )}

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowPopup(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={simulateUpload}
                disabled={!files.length || uploading}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                Upload
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
