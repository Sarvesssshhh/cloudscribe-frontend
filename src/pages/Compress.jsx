import { useState } from "react";
import { motion } from "framer-motion";
import { API } from "../config";

export default function Compress() {
  const [file, setFile] = useState(null);

  const handleCompress = async () => {
    if (!file) {
      alert("Please upload a PDF file!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(API.COMPRESS, {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        alert("Error compressing PDF!");
        return;
      }

      const blob = await response.blob();

      // Download compressed file
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "compressed.pdf";
      a.click();
    } catch (error) {
      console.error("Compress Error:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <section className="py-16 px-6 text-center">
      <motion.h1
        className="text-4xl font-bold text-green-600 dark:text-green-400 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Compress PDF
      </motion.h1>

      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full mb-4"
        />

        <button
          onClick={handleCompress}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
        >
          Compress Now
        </button>
      </div>
    </section>
  );
}
