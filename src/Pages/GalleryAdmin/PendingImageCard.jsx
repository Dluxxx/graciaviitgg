import React, { useState } from "react";
import { supabase } from "../../supabase";

export default function PendingImageCard({ file, onDone }) {

  const BUCKET_PENDING = "Images";
  const BUCKET_APPROVED = "GambarAman";

  const [busy, setBusy] = useState(false);

  const approve = async () => {
    if (!confirm("Approve this image?")) return;

    setBusy(true);

    // 1) Download file dari Images
    const { data: downloaded } = await supabase.storage
      .from(BUCKET_PENDING)
      .download(file.name);

    // 2) Upload ke GambarAman
    await supabase.storage
      .from(BUCKET_APPROVED)
      .upload(file.name, downloaded, {
        upsert: true,
        metadata: { description: file.description },
      });

    // 3) Hapus dari Images
    await supabase.storage.from(BUCKET_PENDING).remove([file.name]);

    setBusy(false);
    onDone();
  };

  const reject = async () => {
    if (!confirm("Delete this image?")) return;

    setBusy(true);
    await supabase.storage.from(BUCKET_PENDING).remove([file.name]);
    setBusy(false);
    onDone();
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg">

      <img
        src={file.url}
        className="w-full h-48 object-cover rounded-lg"
      />

      <p className="text-sm mt-3">{file.description}</p>

      <button
        onClick={approve}
        disabled={busy}
        className="bg-green-600 px-3 py-1 rounded mt-3"
      >
        Approve
      </button>

      <button
        onClick={reject}
        disabled={busy}
        className="bg-red-600 px-3 py-1 rounded mt-3 ml-2"
      >
        Reject
      </button>
    </div>
  );
}
