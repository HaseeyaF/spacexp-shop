import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { GiRocket } from "react-icons/gi";

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-gray-900 text-blue-700 dark:text-blue-300 shadow-md border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-xl font-bold flex items-center gap-2 hover:text-blue-500 transition-colors"
          >
            <GiRocket
              size={22}
              color="#0a84ff"
              className="-rotate-180" // upward launch
            />
            <span className="tracking-wide">{t("spacexp_shop")}</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="hover:text-blue-500 transition">
              {t("home")}
            </Link>

            <Link to="/products" className="hover:text-blue-500 transition">
              {t("products")}
            </Link>

            <Link to="/cart" className="hover:text-blue-500 transition">
              {t("cart")}
            </Link>

            <ThemeToggle />

            {/* Language Selector */}
            <select
              onChange={handleLanguageChange}
              value={i18n.language}
              className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 p-1 px-2 rounded-md text-sm focus:ring-2 focus:ring-blue-400"
            >
              <option value="en">EN</option>
              <option value="si">සිං</option>
              <option value="ta">தமிழ்</option>
            </select>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            {isOpen ? <X size={22} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          className={`fixed top-10 right-0 h-74 w-64 bg-blue-900 text-white dark:bg-gray-900 shadow-lg transform transition-transform duration-300 z-50 px-4 py-3 space-y-3 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <Link
            to="/products"
            className="block hover:text-blue-500"
            onClick={() => setIsOpen(false)}
          >
            {t("products")}
          </Link>

          <Link
            to="/cart"
            className="block hover:text-blue-500"
            onClick={() => setIsOpen(false)}
          >
            {t("cart")}
          </Link>

          <ThemeToggle />

          <select
            onChange={handleLanguageChange}
            value={i18n.language}
            className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-200 p-2 rounded-md"
          >
            <option value="en">English</option>
            <option value="si">සිංහල</option>
            <option value="ta">தமிழ்</option>
          </select>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
