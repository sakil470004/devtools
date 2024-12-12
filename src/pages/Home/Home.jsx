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
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4 text-blue-600">DevTools</h1>
          <p className="text-lg text-gray-700">
            Your Quick and Easy-to-Use Developer Tools
          </p>
        </header>
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-gray-800">
            Available Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool) => (
              <Link
                to={tool.path}
                key={tool.name}
                className="card bg-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out p-8 text-center rounded-lg "
              >
                <div className="text-6xl mb-6 text-blue-500 flex justify-center ">
                  {tool.icon}
                </div>
                <h3 className="text-2xl font-semibold text-gray-900">
                  {tool.name}
                </h3>
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
