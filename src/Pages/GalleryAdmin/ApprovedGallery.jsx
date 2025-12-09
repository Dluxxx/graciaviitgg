// src/Pages/GalleryAdmin/ApprovedGallery.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase/supabase";
import ApprovedImageCard from "./ApprovedImageCard";
import { useNavigate } from "react-router-dom";

export default function ApprovedGallery() {

  const navigate = useNavigate();

  useEffect(() => {
    const admin = localStorage.getItem("admin-auth");
    if (!admin) navigate("/admin");
  }, []);

  const BUCKET = "GambarAman";

  const [files, setFiles] = useState([]);

  const load = async () => {

    const { data, error } = await supabase.storage
      .from(BUCKET)
      .list("", { includeMetadata: true });

    if (error) return console.error(error);

    const mapped = data.map((file) => ({
      name: file.name,
      url: supabase.storage.from(BUCKET).getPublicUrl(file.name).data.publicUrl,
      description: file.metadata?.description || "No description",
      created_at: file.created_at,
    }));

    mapped.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    setFiles(mapped);
  };

  useEffect(() => load(), []);

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Approved Gallery</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {files.map((f) => (
          <ApprovedImageCard key={f.name} file={f} onDone={load}/>
        ))}
      </div>
    </div>
  );
}
