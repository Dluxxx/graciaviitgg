import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ButtonSend from "../components/ButtonSend";
import ButtonRequest from "../components/ButtonRequest";

import { supabase } from "../supabase";

import Modal from "@mui/material/Modal";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useSpring, animated } from "@react-spring/web";

const Carousel = () => {
  const [images, setImages] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const modalFade = useSpring({
    opacity: open ? 1 : 0,
    config: { duration: 300 },
  });

  // 🚀 FETCH GAMBAR + METADATA DARI SUPABASE
  const fetchImagesFromSupabase = async () => {
    const { data: files, error } = await supabase
      .storage
      .from("GambarAman")
      .list("", { limit: 200, includeMetadata: true });

    if (error) {
      console.error("Error fetching files:", error);
      return;
    }

    const result = files.map(file => {
      const url = supabase
        .storage
        .from("GambarAman")
        .getPublicUrl(file.name).data.publicUrl;

      return {
        url,
        filename: file.name,
        description:
          file.metadata?.description || "No description provided",
      };
    });

    setImages(result);
  };

  useEffect(() => {
    fetchImagesFromSupabase();
  }, []);

  const settings = {
    centerMode: true,
    centerPadding: "30px",
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    dots: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          centerMode: true,
          centerPadding: "50px",
          slidesToShow: 1,
          dots: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          arrows: false,
          centerMode: true,
          centerPadding: "70px",
          slidesToShow: 1,
          dots: false,
        },
      },
    ],
  };

  const handleImageClick = (url) => {
    setSelectedImage(url);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedImage(null);
  };

  return (
    <>
      <div
        className="text-white opacity-60 text-base font-semibold mb-4 mx-[10%] mt-10 lg:text-center lg:text-3xl lg:mb-8"
        id="Gallery"
      >
        Class Gallery
      </div>

      <div id="Carousel">
        <Slider {...settings}>
          {images.map((img, index) => (
            <div
              key={index}
              className="relative group"
              onClick={() => handleImageClick(img.url)}
            >
              <img
                src={img.url}
                alt={img.filename}
                className="cursor-pointer"
              />

              {/* Overlay Deskripsi */}
              <div
                className="
                  absolute bottom-0 left-0 right-0 
                  bg-black bg-opacity-60 text-white text-xs p-2
                  opacity-0 group-hover:opacity-100 transition-opacity duration-200
                "
              >
                {img.description}
              </div>
            </div>
          ))}
        </Slider>
      </div>

      <div className="flex justify-center items-center gap-6 text-base mt-5 lg:mt-8">
        <ButtonSend />
        <ButtonRequest />
      </div>

      {/* MODAL ZOOM */}
      <Modal
        open={open}
        onClose={handleCloseModal}
        className="flex justify-center items-center"
      >
        <animated.div
          style={{
            ...modalFade,
            maxWidth: "90vw",
            maxHeight: "auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
          className="p-2 rounded-lg"
        >
          <IconButton
            edge="end"
            onClick={handleCloseModal}
            sx={{
              position: "absolute",
              top: "12px",
              right: "23px",
              backgroundColor: "white",
              borderRadius: "50%",
            }}
          >
            <CloseIcon />
          </IconButton>

          <img
            src={selectedImage}
            alt="Selected"
            style={{ maxWidth: "100%", maxHeight: "100vh" }}
          />
        </animated.div>
      </Modal>
    </>
  );
};

export default Carousel;
