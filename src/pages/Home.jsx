import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Home() {
  const tools = [
    { name: "Merge PDF", path: "/merge", color: "from-indigo-500 to-purple-500" },
    { name: "Split PDF", path: "/split", color: "from-pink-500 to-red-500" },
    { name: "Compress PDF", path: "/compress", color: "from-green-500 to-emerald-500" },
    { name: "Convert PDF", path: "/convert", color: "from-blue-500 to-cyan-500" },
    { name: "Image ↔ PDF", path: "/image", color: "from-yellow-500 to-orange-500" },
    { name: "OCR / Extract Text", path: "/ocr", color: "from-teal-500 to-sky-500" },
  ];

  return (
    <section className="text-center py-16 px-6">
      <motion.h1
        className="text-5xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        Smart Cloud PDF Tools
      </motion.h1>

      <motion.p
        className="text-lg text-gray-600 dark:text-gray-300 mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Convert, merge, split, and manage your PDFs easily on the cloud ☁️
      </motion.p>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {tools.map((tool, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link
              to={tool.path}
              className={`block p-8 rounded-2xl shadow-lg bg-gradient-to-br ${tool.color} text-white font-semibold hover:shadow-2xl transition`}
            >
              {tool.name}
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
