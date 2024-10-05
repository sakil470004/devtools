// src/components/Footer.jsx
import { FaGithub, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-base-200 mt-10">
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} DevTools. All rights reserved.</p>
        <div className="flex space-x-4 mt-2 md:mt-0">
          <a href="https://github.com/sakil470004" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
            <FaGithub size={24} />
          </a>
          <a href="https://www.linkedin.com/in/mynul-islam-sakil/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
            <FaLinkedin size={24} />
          </a>
          {/* Add more social links as needed */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
