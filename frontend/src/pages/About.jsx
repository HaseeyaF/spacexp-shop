import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          About Us
        </h1>

        <p className="mb-6 text-gray-800 dark:text-gray-200">
          <strong className="text-gray-900 dark:text-white">
            Spacexp Online Shopping Centre
          </strong>{" "}
          is a modern eCommerce platform designed to provide customers in Sri
          Lanka with a seamless and enjoyable online shopping experience. Our
          goal is to connect people with quality products at affordable prices,
          all in one place.
        </p>

        <p className="mb-6 text-gray-700 dark:text-gray-300">
          We believe in convenience, transparency, and innovation. From clothing
          and electronics to groceries and gifts, our store offers a wide range
          of categories to meet your everyday needs. Our platform is
          multilingual, supporting Sinhala, Tamil, and English to serve diverse
          communities across the country.
        </p>

        <p className="mb-6 text-gray-700 dark:text-gray-300">
          We are committed to delivering fast service, maintaining customer
          satisfaction, and creating a trusted shopping experience. Whether
          you’re shopping on your phone or desktop, Spacexp adapts to your
          screen — giving you a smooth, responsive interface.
        </p>

        <p className="text-gray-700 dark:text-gray-300">
          Thank you for choosing Spacexp. We’re excited to be part of your
          shopping journey!
        </p>
      </div>
    </div>
  );
};

export default About;
