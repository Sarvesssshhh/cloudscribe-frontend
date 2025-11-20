import { useState } from "react";
import { API } from "../config";
import { motion } from "framer-motion";

export default function Merge() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  const handleFiles = (fileList) => {
    setFiles(Array.from(fileList || []));
  };

  // STEP 1: Get presigned URLs
  async function getPresignData(filenames) {
    const res = await fetch(API.PRESIGN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filenames }),
    });

    if (!res.ok) {
      throw new Error("Presign API error: " + (await res.text()));
    }

    return await res.json();
  }

  // STEP 2: Upload file to S3 with PUT
  async function uploadToS3(url, file) {
    const res = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/pdf" },
      body: file,
    });

    if (!res.ok) {
      throw new Error("S3 Upload Failed: " + (await res.text()));
    }
  }

  const handleMerge = async () => {
    if (files.length < 2) {
      alert("Select at least two PDF files.");
      return;
    }

    try {
      setUploading(true);
      setMessage("Requesting presigned URLs...");
      setProgress(5);

      const filenames = files.map((f) => f.name);

      // Step 1: Get presign URLs
      const presignData = await getPresignData(filenames);

      const uploadedKeys = [];

      // Step 2: Upload each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const presignedObj = presignData[file.name];

        if (!presignedObj) throw new Error(`No presign for ${file.name}`);

        const uploadURL =
          presignedObj.upload_url ||
          presignedObj.uploadURL ||
          presignedObj.url;

        const key =
          presignedObj.key ||
          presignedObj.file_key ||
          presignedObj.path;

        if (!uploadURL || !key)
          throw new Error(`Missing upload_url or key for ${file.name}`);

        setMessage(`Uploading ${file.name}...`);
        setProgress(10 + (i / files.length) * 60);

        await uploadToS3(uploadURL, file);
        uploadedKeys.push(key);
      }

      // Step 3: Merge uploaded keys
      setMessage("Requesting merge from backend...");
      setProgress(80);

      const mergeRes = await fetch(API.MERGE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keys: uploadedKeys }),
      });

      if (!mergeRes.ok) {
        throw new Error("Merge API error: " + (await mergeRes.text()));
      }

      const contentType = mergeRes.headers.get("content-type");

      // =============================
      // UPDATED: Handle your backend’s response
      // =============================
      if (contentType.includes("application/pdf")) {
        // backend returned PDF directly
        const blob = await mergeRes.blob();
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "merged.pdf";
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const json = await mergeRes.json();

        // NEW: Your backend returns merged_pdf_url
        if (json.merged_pdf_url) {
          window.open(json.merged_pdf_url, "_blank");
        }
        // NEW: backend also sends merged_filename (S3 key)
        else if (json.merged_filename) {
          const direct = `https://s3.amazonaws.com/cloud-scribe-pdf-data-bucket/${json.merged_filename}`;
          window.open(direct, "_blank");
        }
        // Legacy: still support download_url
        else if (json.download_url) {
          window.open(json.download_url, "_blank");
        }
        // Legacy fallback: key
        else if (json.key) {
          window.open(
            `https://s3.amazonaws.com/cloud-scribe-pdf-data-bucket/${json.key}`,
            "_blank"
          );
        } else {
          alert("Merge succeeded: " + JSON.stringify(json));
        }
      }

      setProgress(100);
      setMessage("PDF merged successfully!");
    } catch (err) {
      alert(err.message);
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="flex flex-col items-center py-16 px-6 text-center">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-6"
      >
        Merge PDF Files
      </motion.h1>

      <div
        className="border-2 border-dashed border-indigo-400 rounded-lg p-8 cursor-pointer hover:bg-indigo-50 dark:hover:bg-gray-700 transition w-full max-w-xl bg-white dark:bg-gray-800 shadow-lg"
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => document.getElementById("merge-input").click()}
      >
        <p className="text-lg font-semibold">Drag & Drop PDF files</p>
        <p className="text-sm text-gray-500">or click to browse files</p>

        <input
          id="merge-input"
          type="file"
          accept="application/pdf"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {files.length > 0 && (
        <div className="mt-5 text-left w-full max-w-xl">
          <h3 className="font-semibold">Selected Files:</h3>
          <ul className="list-disc ml-6 text-gray-700 dark:text-gray-300">
            {files.map((f, i) => (
              <li key={i}>{f.name}</li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={handleMerge}
        disabled={uploading}
        className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-xl shadow hover:bg-indigo-700 transition disabled:opacity-50"
      >
        {uploading ? "Processing..." : "Merge PDFs"}
      </button>

      {uploading && (
        <div className="mt-4 w-full max-w-xl">
          <div className="h-3 bg-gray-300 rounded-full">
            <div
              className="h-3 bg-indigo-500 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm mt-2 text-gray-500">{message}</p>
        </div>
      )}
    </section>
  );
}
