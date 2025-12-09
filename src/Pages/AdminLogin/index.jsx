// src/pages/AdminLogin/index.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// GANTI KEY INI SESUAI KEINGINANMU
const ADMIN_KEY = "NightX59belalang6868Elliot201121";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [key, setKey] = useState("");

  const login = () => {
    if (key === ADMIN_KEY) {
      localStorage.setItem("admin-auth", "true");
      navigate("/admin/gallery");
    } else {
      alert("Invalid admin key");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
      <div className="w-[22rem] rounded-2xl bg-white shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Admin Login
        </h2>

        <label className="text-sm font-semibold text-gray-600">
          Admin Key
        </label>
        <input
          type="password"
          placeholder="Enter admin key…"
          className="w-full p-3 border rounded-xl mt-2 mb-5 text-gray-800"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />

        <button
          onClick={login}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl text-lg font-semibold shadow-md hover:opacity-90"
        >
          Login
        </button>
      </div>
    </div>
  );
}
