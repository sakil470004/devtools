// src/components/tools/Contact/Contact.tsx
import { useState } from "react";
import { FaEnvelope, FaUser, FaCommentAlt, FaPaperPlane } from "react-icons/fa";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission (e.g., send email or store in database)
    alert("Message sent!");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="bg-gray-100 py-10">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-10 text-center text-blue-600">
          Contact Us
        </h2>
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-8">
          <div className="mb-6">
            <label className="block text-lg font-medium mb-2" htmlFor="name">
              <FaUser className="inline-block mr-2" /> Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={form.name}
              onChange={handleChange}
              required
              className="input input-bordered w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your Name"
            />
          </div>
          <div className="mb-6">
            <label className="block text-lg font-medium mb-2" htmlFor="email">
              <FaEnvelope className="inline-block mr-2" /> Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={form.email}
              onChange={handleChange}
              required
              className="input input-bordered w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="your.email@example.com"
            />
          </div>
          <div className="mb-6">
            <label className="block text-lg font-medium mb-2" htmlFor="message">
              <FaCommentAlt className="inline-block mr-2" /> Message
            </label>
            <textarea
              name="message"
              id="message"
              value={form.message}
              onChange={handleChange}
              required
              className="textarea textarea-bordered w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={5}
              placeholder="Your message..."
            ></textarea>
          </div>
          <button
            type="submit"
            className="btn bg-blue-500 text-white w-full p-3 rounded-lg shadow-md hover:bg-blue-600 flex items-center justify-center"
          >
            <FaPaperPlane className="mr-2" /> Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
