import { Link } from "react-router-dom";
import { AiOutlineInfoCircle, AiOutlineMail } from "react-icons/ai";

const Footer = () => (
  <footer className="bg-gray-200 text-center p-4 text-sm text-gray-800 dark:text-gray-200">
    <div className="flex justify-center gap-6 mb-2">
      <Link
        to="/about"
        className="flex items-center gap-1 cursor-pointer no-underline hover:text-black dark:hover:text-white"
      >
        <AiOutlineInfoCircle size={16} />
        <span>About</span>
      </Link>

      <Link
        to="/contact"
        className="flex items-center gap-1 cursor-pointer no-underline hover:text-black dark:hover:text-white"
      >
        <AiOutlineMail size={16} />
        <span>Contact</span>
      </Link>

      <Link to="/admin" className="hover:text-blue-500 transition">
        Admin
      </Link>
    </div>

    <p>
      © {new Date().getFullYear()} Spacexp Online Shopping Centre. All rights
      reserved.
    </p>
  </footer>
);

export default Footer;
