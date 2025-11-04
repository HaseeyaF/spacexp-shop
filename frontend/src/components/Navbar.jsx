import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X } from "lucide-react"; // hamburger + close icons
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <nav className="bg-blue-900 dark:bg-gray-800 text-white dark:text-gray-100 shadow-md border-b border-blue-700 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-xl font-bold flex items-center gap-2 hover:text-blue-300 dark:hover:text-blue-400 transition-colors"
          >
            🚀 {t("spacexp_shop")}
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-4">
            <ul className="flex space-x-6">
              <li>
                <Link to="/" className="hover:text-blue-300 dark:hover:text-blue-400">
                  {t("home")}
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-blue-300 dark:hover:text-blue-400">
                  {t("products")}
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-blue-300 dark:hover:text-blue-400">
                  {t("cart")}
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-blue-300 dark:hover:text-blue-400">
                  {t("wishlist")}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-300 dark:hover:text-blue-400">
                  {t("contact")}
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-blue-300 dark:hover:text-blue-400">
                  {t("about")}
                </Link>
              </li>
              <li>
                <ThemeToggle />
              </li>
            </ul>

            {/* Language Switcher */}
            <select
              onChange={handleLanguageChange}
              value={i18n.language}
              className="bg-gray-200 dark:bg-gray-700 border border-gray-400 dark:border-gray-600 text-gray-900 dark:text-gray-100 p-1 rounded text-sm"
            >
              <option value="en">English</option>
              <option value="si">සිංහල</option>
              <option value="ta">தமிழ்</option>
            </select>
          </div>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded hover:bg-blue-800 dark:hover:bg-gray-700"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 bg-blue-800 dark:bg-gray-900 border-t border-blue-700 dark:border-gray-700">
          <ul className="flex flex-col space-y-2">
            <li>
              <Link to="/" className="block hover:text-blue-300" onClick={() => setIsOpen(false)}>
                {t("home")}
              </Link>
            </li>
            <li>
              <Link to="/products" className="block hover:text-blue-300" onClick={() => setIsOpen(false)}>
                {t("products")}
              </Link>
            </li>
            <li>
              <Link to="/cart" className="block hover:text-blue-300" onClick={() => setIsOpen(false)}>
                {t("cart")}
              </Link>
            </li>
            <li>
              <Link to="/wishlist" className="block hover:text-blue-300" onClick={() => setIsOpen(false)}>
                {t("wishlist")}
              </Link>
            </li>
            <li>
              <Link to="/contact" className="block hover:text-blue-300" onClick={() => setIsOpen(false)}>
                {t("contact")}
              </Link>
            </li>
            <li>
              <Link to="/about" className="block hover:text-blue-300" onClick={() => setIsOpen(false)}>
                {t("about")}
              </Link>
            </li>
            <li>
              <ThemeToggle />
            </li>
            <li>
              <select
                onChange={handleLanguageChange}
                value={i18n.language}
                className="w-full bg-gray-200 dark:bg-gray-700 border border-gray-400 dark:border-gray-600 text-gray-900 dark:text-gray-100 p-1 rounded text-sm"
              >
                <option value="en">English</option>
                <option value="si">සිංහල</option>
                <option value="ta">தமிழ்</option>
              </select>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
