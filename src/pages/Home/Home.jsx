// src/components/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaPalette,
  FaFont,
  FaImage,
  FaCode,
  FaLink,
  FaExchangeAlt,
  FaCog,
  FaCompress,
  FaMagic,
  FaSortAlphaDown,
  FaMarkdown,
  // Add more icons as needed
} from 'react-icons/fa';
import Contributors from '../../componets/Contributors/Contributors';
import Navbar from '../../componets/Navbar/Navbar';
import Contact from '../../componets/Contact/Contact';
import Footer from '../../componets/Footer/Footer';

const HomePage = () => {
  const tools = [
    { name: 'Markdown to LinkedIn', path: '/markdown-to-linkedin', icon: <FaMarkdown /> },
 
    { name: 'Color Picker', path: '/color-picker', icon: <FaPalette /> },
    { name: 'Font Picker', path: '/font-picker', icon: <FaFont /> },
    { name: 'Image to Base64', path: '/image-to-base64', icon: <FaImage /> },
    { name: 'JSON Formatter', path: '/json-formatter', icon: <FaCode /> },
    { name: 'URL Encoder', path: '/url-encoder', icon: <FaLink /> },
    { name: 'URL Decoder', path: '/url-decoder', icon: <FaLink /> },
    { name: 'String Converters', path: '/string-converters', icon: <FaExchangeAlt /> },
    { name: 'String Trim', path: '/string-trim', icon: <FaCompress /> },
    { name: 'String Shuffle', path: '/string-shuffle', icon: <FaMagic /> },
    { name: 'String Sort', path: '/string-sort', icon: <FaSortAlphaDown /> },
    // Add more tools here with appropriate icons
  ];

  return (
    <div>
      <Navbar />

      <div className="container mx-auto px-4 py-10">

        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold mb-4">DevTools</h1>
          <p className="text-lg text-gray-600">
            Your Quick and Easy-to-Use Developer Tools
          </p>
        </header>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Available Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <Link to={tool.path} key={tool.name} className="card bg-base-200 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out p-6 text-center">
                <div className="text-5xl mb-4 text-primary">{tool.icon}</div>
                <h3 className="text-xl font-semibold">{tool.name}</h3>
              </Link>
            ))}
          </div>
        </section>

        <Contributors />
        <Contact />
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
