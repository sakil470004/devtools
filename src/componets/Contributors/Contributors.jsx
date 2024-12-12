// src/components/tools/Contributors/Contributors.jsx
import { FaGithub } from "react-icons/fa";

const contributors = [
  {
    name: "Mynul Islam",
    github: "https://github.com/sakil470004",
  },
  {
    name: "Mahmudul Hasan Nayeem",
    github: "https://github.com/mahmudulnayeem",
  },
  // Add more contributors here
];

const Contributors = () => {
  return (
    <div className="bg-gray-100 py-10">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-10 text-center text-blue-600">
          Contributors
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {contributors.map((contributor, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg p-6 text-center transform hover:scale-105 transition-transform duration-300 ease-in-out"
            >
              <h3 className="text-2xl font-semibold mb-4">
                {contributor.name}
              </h3>
              <a
                href={contributor.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-500 hover:underline"
              >
                <FaGithub className="mr-2" /> GitHub Profile
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contributors;
