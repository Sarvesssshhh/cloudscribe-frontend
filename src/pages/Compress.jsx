import { motion } from "framer-motion";
import { Upload } from "lucide-react";

export default function Compress() {
  return (
    <section className="flex flex-col items-center py-16 px-6 text-center">
      <motion.h1
        className="text-4xl font-bold text-green-600 dark:text-green-400 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Compress PDF Files
      </motion.h1>

      <motion.div
        className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <label className="block border-2 border-dashed border-green-400 rounded-lg p-6 cursor-pointer hover:bg-green-50 dark:hover:bg-gray-700 transition">
          <Upload className="mx-auto mb-2 text-green-500" size={36} />
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Upload PDF to compress
          </span>
          <input type="file" accept="application/pdf" hidden />
        </label>

        <button className="mt-6 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">
          Compress Now
        </button>
      </motion.div>
    </section>
  );
}
