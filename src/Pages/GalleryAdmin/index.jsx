// src/pages/GalleryAdmin/index.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";
import AdminImageCard from "./AdminImageCard";

export default function GalleryAdmin() {
  const navigate = useNavigate();

  // CEK LOGIN ADMIN
  useEffect(() => {
    const isAdmin = localStorage.getItem("admin-auth");
    if (!isAdmin) navigate("/admin");
  }, []);

  const [files, setFiles] = useState([]);
  const [selected, setSelected] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const loadFiles = async () => {
    setLoading(true);

    const { data, error } = await supabase.storage
      .from("images")
      .list("", { includeMetadata: true });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    const mapped = data.map((file) => ({
      name: file.name,
      url: supabase.storage.from("images").getPublicUrl(file.name).data.publicUrl,
      description: file.metadata?.description || "No description provided",
      created_at: file.created_at,
    }));

    mapped.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    setFiles(mapped);
    setLoading(false);
  };

  useEffect(() => loadFiles(), []);

  const upload = async () => {
    if (!selected) return alert("Select a file first!");

    setLoading(true);

    const fileName = `${Date.now()}-${selected.name}`;

    const { error } = await supabase.storage.from("images").upload(fileName, selected, {
      upsert: true,
      metadata: { description: description || "No description provided" }
    });

    if (error) {
      console.error(error);
      alert("Upload failed");
    } else {
      alert("Uploaded!");
    }

    setSelected(null);
    setDescription("");
    await loadFiles();
    setLoading(false);
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Gallery Admin</h1>

      <div className="bg-gray-800 rounded-lg p-5 mb-6">
        <input type="file" onChange={(e) => setSelected(e.target.files[0])} className="mb-3" />

        <input
          type="text"
          placeholder="Description…"
          className="w-full p-2 text-black mb-3 rounded-lg"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button
          onClick={upload}
          className="bg-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-green-700"
          disabled={loading}
        >
          {loading ? "Uploading…" : "Upload"}
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-4">All Photos</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {files.map((file) => (
          <AdminImageCard key={file.name} file={file} onDone={loadFiles} />
        ))}
      </div>
    </div>
  );
}
