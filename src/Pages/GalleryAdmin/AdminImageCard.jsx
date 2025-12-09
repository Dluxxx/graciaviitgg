// src/pages/GalleryAdmin/AdminImageCard.jsx
import React, { useState } from "react";
import { supabase } from "../../supabase";

export default function AdminImageCard({ file, onDone }) {
  const [editing, setEditing] = useState(false);
  const [desc, setDesc] = useState(file.description);
  const [busy, setBusy] = useState(false);

  const deleteFile = async () => {
    if (!confirm("Delete this file?")) return;

    setBusy(true);
    const { error } = await supabase.storage.from("images").remove([file.name]);
    setBusy(false);

    if (error) {
      alert("Delete failed");
    } else {
      onDone();
    }
  };

  const saveDesc = async () => {
    setBusy(true);

    const response = await fetch(file.url);
    const blob = await response.blob();

    const { error } = await supabase.storage
      .from("images")
      .upload(file.name, blob, {
        upsert: true,
        metadata: { description: desc },
      });

    setBusy(false);
    setEditing(false);
    onDone();
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <img src={file.url} className="w-full h-48 object-cover rounded-lg" />

      {editing ? (
        <div className="mt-3">
          <input
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="p-2 w-full rounded text-black mb-2"
          />
          <button onClick={saveDesc} className="px-3 py-1 bg-blue-600 rounded mr-2">Save</button>
          <button onClick={() => setEditing(false)} className="px-3 py-1 bg-gray-600 rounded">Cancel</button>
        </div>
      ) : (
        <div className="mt-3">
          <p className="mb-2 text-sm">{file.description}</p>
          <button onClick={() => setEditing(true)} className="px-3 py-1 bg-yellow-600 rounded mr-2">Edit</button>
          <button onClick={deleteFile} className="px-3 py-1 bg-red-600 rounded" disabled={busy}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
