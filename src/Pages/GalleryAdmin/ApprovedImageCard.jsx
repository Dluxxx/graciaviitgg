import React, { useState } from "react";
import { supabase } from "../../supabase";

export default function ApprovedImageCard({ file, onDone }) {

  const BUCKET = "GambarAman";

  const [editing, setEditing] = useState(false);
  const [desc, setDesc] = useState(file.description);
  const [busy, setBusy] = useState(false);

const saveDesc = async () => {
  setBusy(true);

  // 1) Download file
  const { data: fileBlob, error: dErr } = await supabase.storage
    .from(BUCKET)
    .download(file.name);

  if (dErr) {
    alert("Download error");
    setBusy(false);
    return;
  }

  // 2) Ambil contentType asli
  const contentType = fileBlob.type || "image/jpeg";

  // 3) Upload ulang dengan metadata BARU
  const { error: uErr } = await supabase.storage
    .from(BUCKET)
    .upload(file.name, fileBlob, {
      upsert: true,
      metadata: { description: desc },
      contentType,            // FIX WAJIB
      cacheControl: "0"       // FIX WAJIB
    });

  if (uErr) alert("Failed updating metadata");

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

      <img
        src={file.url}
        className="w-full h-48 object-cover rounded-lg"
      />

      {editing ? (
        <>
          <input
            className="p-2 text-black w-full rounded mt-3"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />

          <button
            onClick={saveDesc}
            className="bg-blue-600 px-3 py-1 rounded mt-3"
          >
            Save
          </button>

          <button
            onClick={() => setEditing(false)}
            className="bg-gray-600 px-3 py-1 rounded mt-3 ml-2"
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <p className="mt-3 text-sm">{file.description}</p>

          <button
            onClick={() => setEditing(true)}
            className="bg-yellow-600 px-3 py-1 rounded mt-3"
          >
            Edit
          </button>

          <button
            onClick={deleteFile}
            className="bg-red-600 px-3 py-1 rounded mt-3 ml-2"
          >
            Delete
          </button>
        </>
      )}

    </div>
  );
}
