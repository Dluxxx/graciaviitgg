import React, { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { v4 as uuidv4 } from "uuid";
import Swal from "sweetalert2";

function UploadImage() {
  const [imageUpload, setImageUpload] = useState(null);
  const [imageList, setImageList] = useState([]);

  const maxUploadSizeInBytes = 10 * 1024 * 1024; // 10MB
  const maxUploadsPerDay = 20;

  useEffect(() => {
    listImages();
  }, []);

  // Fetch all images
  const listImages = async () => {
    const { data: files, error } = await supabase.storage
      .from("images")
      .list("");

    if (error) {
      console.error(error);
      return;
    }

    const urls = files.map((file) =>
      supabase.storage.from("images").getPublicUrl(file.name).data.publicUrl
    );

    setImageList(urls);
  };

  const uploadImage = async () => {
    if (!imageUpload) return;

    const uploadedImagesCount =
      parseInt(localStorage.getItem("uploadedImagesCount")) || 0;
    const lastUploadDate = localStorage.getItem("lastUploadDate");

    if (uploadedImagesCount >= maxUploadsPerDay) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "You have reached the maximum uploads for today.",
      });
      return;
    }

    if (
      lastUploadDate &&
      new Date(lastUploadDate).toDateString() !== new Date().toDateString()
    ) {
      localStorage.setItem("uploadedImagesCount", 0);
    }

    if (imageUpload.size > maxUploadSizeInBytes) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "The maximum size for a photo is 10MB",
      });
      return;
    }

    const filename = `${uuidv4()}-${imageUpload.name}`;

    const { data, error } = await supabase.storage
      .from("images")
      .upload(filename, imageUpload);

    if (error) {
      console.error(error);
      return;
    }

    const url = supabase.storage.from("images").getPublicUrl(filename).data.publicUrl;

    setImageList((prev) => [...prev, url]);

    localStorage.setItem("uploadedImagesCount", uploadedImagesCount + 1);
    localStorage.setItem("lastUploadDate", new Date().toISOString());

    Swal.fire({
      icon: "success",
      title: "Success!",
      text: "Your image has been successfully uploaded.",
    });

    setImageUpload(null);
  };

  const handleImageChange = (e) => {
    setImageUpload(e.target.files[0]);
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="text-center mb-4">
        <h1 className="text-1xl md:text-2xl md:px-10 font-bold mb-4 w-full text-white">
          Upload Your Classroom Memories
        </h1>
      </div>

      <div className="mx-auto p-4">
        <form>
          <div className="mb-4">
            <input
              type="file"
              id="imageUpload"
              className="hidden"
              onChange={handleImageChange}
            />
            <label
              htmlFor="imageUpload"
              className="cursor-pointer border-dashed border-2 border-gray-400 rounded-lg p-4 w-56 h-auto flex items-center justify-center"
            >
              {imageUpload ? (
                <div className="w-full h-full overflow-hidden">
                  <img
                    src={URL.createObjectURL(imageUpload)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="text-center px-5 py-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-12 w-12 mx-auto text-gray-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <p className="text-white opacity-60">Click to select an image</p>
                </div>
              )}
            </label>
          </div>
        </form>
      </div>

      <button
        type="button"
        className="py-2.5 w-[60%] mb-0 md:mb-2 text-sm font-medium text-gray-900 bg-white rounded-lg hover:bg-gray-100"
        onClick={uploadImage}
      >
        UPLOAD
      </button>
    </div>
  );
}

export default UploadImage;

