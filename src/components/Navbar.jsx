import { Link } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar({ darkMode, setDarkMode }) {
  return (
    <motion.nav
      className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md shadow-md sticky top-0 z-50"
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link
          to="/"
          className="text-2xl font-bold text-indigo-600 dark:text-indigo-400"
        >
          CloudScribe PDF
        </Link>

        <div className="flex items-center space-x-6">
          <Link
            to="/"
            className="hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            Home
          </Link>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
