import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./Pages/Home";
import Carousel from "./Pages/Gallery";
import FullWidthTabs from "./Pages/Tabs";
import Footer from "./Pages/Footer";
import Chat from "./components/ChatAnonim";

import AdminLogin from "./Pages/AdminLogin";
import GalleryAdmin from "./Pages/GalleryAdmin";
import ApprovedGallery from "./Pages/GalleryAdmin/ApprovedGallery";

import AOS from "aos";
import "aos/dist/aos.css";

function App() {

  useEffect(() => {
    AOS.init();
    AOS.refresh();
  }, []);

  return (
    <Router>
      <Routes>

        {/* PUBLIC */}
        <Route
          path="/"
          element={
            <>
              <Home />
              <Carousel />
              <FullWidthTabs />

              <div id="Mesh1"></div>

              <div
                className="lg:mx-[12%] lg:mt-10 lg:mb-20 hidden lg:block"
                id="ChatAnonim_lg"
                data-aos="fade-up"
                data-aos-duration="1200"
              >
                <Chat />
              </div>

              <Footer />
            </>
          }
        />

        {/* ADMIN */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/gallery" element={<GalleryAdmin />} />
        <Route path="/admin/gallery/approved" element={<ApprovedGallery />} />

      </Routes>
    </Router>
  );
}

export default App;
