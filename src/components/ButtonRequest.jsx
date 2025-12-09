import React, { useEffect, useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { useSpring, animated } from "@react-spring/web";
import CloseIcon from "@mui/icons-material/Close";

import { supabase } from "../supabase";

export default function ButtonRequest() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const fade = useSpring({
    opacity: open ? 1 : 0,
    config: {
      duration: 200,
    },
  });

  const [images, setImages] = useState([]);

  // Fetch images from Supabase Storage
  const fetchImagesFromSupabase = async () => {
    const { data: files, error } = await supabase.storage
      .from("images")
      .list("", { includeMetadata: true });

    if (error) {
      console.error("Error fetching images:", error);
      return;
    }

    // Filter file yang merupakan placeholder folder kosong atau file 0-byte
    const actualFiles = files.filter(file => {
      // Pastikan file memiliki metadata, ukuran > 0, dan bukan nama placeholder umum
      return file.metadata && file.metadata.size > 0 && file.name !== '.emptyFolderPlaceholder';
    });

    const mapped = actualFiles.map((file) => {
      const url = supabase.storage.from("images").getPublicUrl(file.name).data.publicUrl;

      return {
        url,
        timestamp: file.metadata?.created_at || file.created_at || null,
      };
    });

    // Urutkan berdasarkan timestamp ASC
    mapped.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    setImages(mapped);
  };

  useEffect(() => {
    fetchImagesFromSupabase();
  }, []);

  return (
    <div>
      <button
        onClick={handleOpen}
        className="flex items-center space-x-2 text-white px-6 py-4"
        id="SendRequest"
      >
        <img src="/Request.png" alt="Icon" className="w-6 h-6 relative bottom-1 " />
        <span className="text-base lg:text-1xl">Request</span>
      </button>

      <Modal
        aria-labelledby="spring-modal-title"
        aria-describedby="spring-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <animated.div style={fade}>
          <Box className="modal-container">
            <CloseIcon
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                cursor: "pointer",
                color: "grey",
              }}
              onClick={handleClose}
            />

            <Typography id="spring-modal-description" sx={{ mt: 2 }}>
              <h6 className="text-center text-white text-2xl mb-5">Request</h6>

              <div className="h-[22rem] overflow-y-scroll overflow-y-scroll-no-thumb">
                {images
                  .map((img, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center px-5 py-2 mt-2"
                      id="LayoutIsiButtonRequest"
                    >
                      <img 
                        src={img.url} 
                        alt="" 
                        className="h-10 w-10 blur-sm"
                        // Properti Anti-Download
                        style={{ 
                          pointerEvents: 'none', 
                          userSelect: 'none',     
                        }}
                        onContextMenu={(e) => e.preventDefault()} 
                        draggable="false" 
                      />
                      
                      <span className="ml-2 text-white">
                        {img.timestamp
                          ? new Date(img.timestamp).toLocaleString()
                          : "Unknown time"}
                      </span>
                    </div>
                  ))
                  .reverse()}
              </div>

              <div className="text-white text-[0.7rem] mt-5">
                Note : Seluruh gambar yang di request akan di filter dahulu sebelum diupload.
              </div>
            </Typography>
          </Box>
        </animated.div>
      </Modal>
    </div>
  );
}



