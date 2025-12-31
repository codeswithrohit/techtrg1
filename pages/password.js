"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

const DeletePassword = () => {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  // Fetch Password
  const fetchPassword = async () => {
    try {
      const res = await axios.get("/api/password");
      setPassword(res.data?.password || "No password found");
      setMessage("");
    } catch (error) {
      setMessage("Error fetching password");
    }
  };

  // Create Default Password
  const createPassword = async () => {
    try {
      const res = await axios.post("/api/password", { password: "default123" });
      setPassword("default123");
      setMessage("Default password created!");
    } catch (error) {
      setMessage(error.response?.data?.message || "Error creating password");
    }
  };

  // Update Password
  const updatePassword = async () => {
    await axios.put("/api/password", { newPassword });
    fetchPassword();
    setMessage("Password updated!");
  };

  // Delete Password
  const deletePassword = async () => {
    await axios.delete("/api/password");
    setPassword("");
    setMessage("Password deleted!");
  };

  useEffect(() => {
    fetchPassword();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
      <h2 className="text-xl font-bold text-center text-gray-800 mb-4">Manage Password</h2>
      <p className="text-gray-600 text-center mb-4">
        Current Password: <span className="font-semibold">{password || "No password set"}</span>
      </p>
  
      {password === "" && (
        <button 
          onClick={createPassword} 
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition"
        >
          Create Default Password
        </button>
      )}
  
      {password && (
        <>
          <input
            type="text"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border rounded-lg p-2 mb-3 focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <button 
            onClick={updatePassword} 
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition"
          >
            Update Password
          </button>
          {/* <button onClick={deletePassword} className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition mt-2">
            Delete Password
          </button> */}
        </>
      )}
  
      {message && <p className="text-green-600 text-center mt-4">{message}</p>}
    </div>
  </div>
  
  );
};

export default DeletePassword;
