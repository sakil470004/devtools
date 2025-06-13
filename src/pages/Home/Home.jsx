// src/components/HomePage.jsx
import {
  FaCode,
  FaEdit,
  FaExchangeAlt,
  FaFont,
  FaImage,
  FaLink,
  FaMarkdown,
  FaPalette,
} from "react-icons/fa";
import { Si500Px } from "react-icons/si";
import { Link } from "react-router-dom";
import Contact from "../../componets/Contact/Contact";
import Contributors from "../../componets/Contributors/Contributors";
import Footer from "../../componets/Footer/Footer";
import Navbar from "../../componets/Navbar/Navbar";

const HomePage = () => {
  const tools = [
    {
      name: "Markdown to LinkedIn",
      path: "/markdown-to-linkedin",
      icon: <FaMarkdown />,
    },
    { name: "Image Editor", path: "/image-editor", icon: <FaEdit /> },
    { name: "Color Picker", path: "/color-picker", icon: <FaPalette /> },
    { name: "Font Picker", path: "/font-picker", icon: <FaFont /> },
    {
      name: "Image to Base64 And Decode",
      path: "/image-to-base64",
      icon: <FaImage />,
    },
    { name: "JSON Formatter", path: "/json-formatter", icon: <FaCode /> },
    { name: "URL Encoder and Decoder", path: "/url-encoder", icon: <FaLink /> },
    {
      name: "String Converters",
      path: "/string-converters",
      icon: <FaExchangeAlt />,
    },
    { name: "Unit Converters", path: "/unit-converters", icon: <Si500Px /> },

    // Add more tools here with appropriate icons
  ];

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-10 flex-1">
        <div className="mb-16 text-center">
          <div className="inline-block px-8 py-6 rounded-2xl shadow-xl bg-gradient-to-r from-blue-100/80 to-gray-50/80 border border-blue-200/60">
            <h1 className="text-6xl font-extrabold mb-3 text-blue-700 tracking-tight font-mono drop-shadow-lg">
              DevTools
            </h1>
            <p className="text-xl text-gray-600 font-mono opacity-90">
              Your Quick and Easy-to-Use Developer Tools
            </p>
          </div>
        </div>
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-10 text-blue-700 text-left font-mono border-l-4 border-blue-400 pl-4">
            Available Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {tools.map((tool) => (
              <Link
                to={tool.path}
                key={tool.name}
                className="group card bg-white border border-blue-100 shadow-lg hover:shadow-blue-200/60 hover:border-blue-400/60 transform hover:-translate-y-1 hover:scale-[1.03] transition-all duration-300 ease-in-out p-8 text-center rounded-2xl cursor-pointer relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-blue-300 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="text-6xl mb-6 text-blue-500 flex justify-center drop-shadow-lg">
                  {tool.icon}
                </div>
                <h3 className="text-2xl font-mono font-bold text-gray-900 mb-2 tracking-wide">
                  {tool.name}
                </h3>
                <span className="text-xs text-gray-400 font-mono opacity-70">
                  /tools{tool.path}
                </span>
              </Link>
            ))}
          </div>
        </section>
        <div className="my-16 border-t border-blue-200/40" />
        <Contributors />
        <Contact />
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
