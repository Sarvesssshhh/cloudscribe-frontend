import { motion } from "framer-motion";
import { useState } from "react";
import { Upload } from "lucide-react";

export default function Merge() {
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const simulateMerge = () => {
    setProgress(0);
    let val = 0;
    const interval = setInterval(() => {
      val += 10;
      setProgress(val);
      if (val >= 100) clearInterval(interval);
    }, 200);
  };

  return (
    <section className="flex flex-col items-center py-16 px-6 text-center">
      <motion.h1
        className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Merge PDF Files
      </motion.h1>

      <motion.div
        className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <label className="block border-2 border-dashed border-indigo-400 rounded-lg p-6 cursor-pointer hover:bg-indigo-50 dark:hover:bg-gray-700 transition">
          <Upload className="mx-auto mb-2 text-indigo-500" size={36} />
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Click or drag PDF files here
          </span>
          <input type="file" multiple accept="application/pdf" hidden onChange={handleFileChange} />
        </label>

        {files.length > 0 && (
          <div className="mt-4 text-left text-sm text-gray-600 dark:text-gray-300">
            <strong>Selected Files:</strong>
            <ul className="list-disc ml-5 mt-2">
              {files.map((f, i) => (
                <li key={i}>{f.name}</li>
              ))}
            </ul>
          </div>
        )}

        {files.length > 1 && (
          <button
            onClick={simulateMerge}
            className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Merge Now
          </button>
        )}

        {progress > 0 && (
          <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className="bg-indigo-500 h-3 transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </motion.div>
    </section>
  );
}
