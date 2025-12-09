// src/Pages/GalleryAdmin/ApprovedImageCard.jsx
import React, { useState } from "react";
import { supabase } from "../../supabase";

export default function ApprovedImageCard({ file, onDone }) {

  const BUCKET = "GambarAman";
  const [editing, setEditing] = useState(false);
  const [desc, setDesc] = useState(file.description);
  const [busy, setBusy] = useState(false);

  const saveDesc = async () => {
    setBusy(true);

    // Download file dulu
    const { data: downloaded } = await supabase.storage
      .from(BUCKET)
      .download(file.name);

    // Reupload + metadata baru
    await supabase.storage
      .from(BUCKET)
      .upload(file.name, downloaded, {
        upsert: true,
        metadata: { description: desc },
      });

    setBusy(false);
    setEditing(false);
    onDone();
  };

  const deleteFile = async () => {
    if (!confirm("Delete this approved image?")) return;

    setBusy(true);

    await supabase.storage.from(BUCKET).remove([file.name]);

    setBusy(false);
    onDone();
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg">

      <img src={file.url} className="w-full h-48 object-cover rounded-lg" />

      {editing ? (
        <>
          <input
            className="p-2 w-full rounded mt-3 text-black"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />

          <button
            onClick={saveDesc}
            className="px-3 py-1 bg-blue-600 rounded mt-2"
          >
            Save
          </button>

          <button
            onClick={() => setEditing(false)}
            className="px-3 py-1 bg-gray-600 rounded mt-2 ml-2"
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <p className="mt-3 text-sm">{file.description}</p>

          <button
            onClick={() => setEditing(true)}
            className="px-3 py-1 bg-yellow-600 rounded mt-2"
          >
            Edit
          </button>

          <button
            onClick={deleteFile}
            className="px-3 py-1 bg-red-600 rounded mt-2 ml-2"
            disabled={busy}
          >
            Delete
          </button>
        </>
      )}
    </div>
  );
}
