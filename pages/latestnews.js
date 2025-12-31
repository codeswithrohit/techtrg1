"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const LatestNews = () => {
  const [newsList, setNewsList] = useState([]);
  const [form, setForm] = useState({ title: "", startDate: "", endDate: "" });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const { data } = await axios.get("/api/news");
      setNewsList(data.news);
    } catch (error) {
      console.error("Error fetching news", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`/api/news/${editId}`, form);
      } else {
        await axios.post("/api/news", form);
      }
      setForm({ title: "", startDate: "", endDate: "" });
      setEditId(null);
      fetchNews();
    } catch (error) {
      console.error("Error submitting news", error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this news?")) {
      try {
        await axios.delete(`/api/news/${id}`);
        fetchNews();
      } catch (error) {
        console.error("Error deleting news", error);
      }
    }
  };

  const handleEdit = (news) => {
    setForm({ title: news.title, startDate: news.startDate, endDate: news.endDate });
    setEditId(news._id);
  };

  return (
    <div className="mx-auto p-6 bg-gray min-h-screen">
      <h1 className="text-3xl font-bold text-center text-black mb-8">Latest News</h1>

      {/* News Form */}
      <form onSubmit={handleSubmit} className="bg-gray-100 shadow-lg rounded-xl p-6 mb-8">
        <div className="space-y-4">
          <input
            type="text"
            placeholder="News Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full p-3 border border-gray-400 rounded-lg bg-white text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              className="w-full p-3 border border-gray-400 rounded-lg bg-white text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              className="w-full p-3 border border-gray-400 rounded-lg bg-white text-black placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            {editId ? "Update News" : "Add News"}
          </button>
        </div>
      </form>

      {/* News List */}
      <ul className="space-y-6">
        {newsList.map((news) => (
          <li key={news._id} className="bg-gray-100 shadow-md p-6 rounded-xl flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-black">{news.title}</h3>
              <p className="text-sm text-gray-700">
                {new Date(news.startDate).toLocaleDateString()} - {new Date(news.endDate).toLocaleDateString()}
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => handleEdit(news)}
                className="flex items-center text-yellow-500 hover:text-yellow-600 transition duration-300"
              >
                <FiEdit className="mr-1" /> Edit
              </button>
              <button
                onClick={() => handleDelete(news._id)}
                className="flex items-center text-red-500 hover:text-red-600 transition duration-300"
              >
                <FiTrash2 className="mr-1" /> Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LatestNews;