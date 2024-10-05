// src/components/Contributors.jsx
import React from 'react';

const contributors = [
  {
    name: 'Mynul Islam',
    github: 'https://github.com/sakil470004',
  },
  {
    name: 'Mahmudul Hasan Nayeem',
    github: 'https://github.com/hasannayeem71',
  },
  // Add more contributors here
];

const Contributors = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6 text-center">Contributors</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {contributors.map((contributor, index) => (
          <div key={index} className="card bg-base-100 shadow-md p-4 text-center">
            <h3 className="text-xl font-semibold">{contributor.name}</h3>
            <a href={contributor.github} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline mt-2 block">
              GitHub Profile
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Contributors;
