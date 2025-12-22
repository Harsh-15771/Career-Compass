import React from "react";
import { Link } from "react-router-dom";
import { assets, footer_data } from "../assets/assets";

const Footer = () => {
  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 bg-primary/3">
      <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-gray-500/30 text-gray-500">
        <div>
          <img src={assets.logo} alt="logo" className="w-48 sm:w-64" />
          <p className="max-w-[410px] mt-6">
            Built by students, for students. Career Compass is a
            community-driven platform dedicated to transparency and shared
            success in the college placement cycle. We believe that the best
            career guidance comes from those who've just been there.
          </p>
        </div>

        <div
          className="grid grid-cols-2
    md:flex md:flex-wrap md:justify-between
    w-full md:w-[45%]
    gap-5"
        >
          {footer_data.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-base text-gray-900 md:mb-5 mb-2">
                {section.title}
              </h3>

              <ul className="text-sm space-y-1">
                {section.links.map((link, i) => (
                  <li key={i}>
                    {link.path ? (
                      <Link
                        to={link.path}
                        className="hover:underline transition"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline transition"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="col-span-2 text-center md:col-span-1 md:text-left">
            <h3 className="font-semibold text-base md:text-xl text-gray-900 mb-2">
              Contact Info
            </h3>
            <p className="text-sm md:text-lg">help.career.compass@gmail.com</p>
          </div>
        </div>
      </div>

      <p className="py-4 text-center text-sm md:text-base text-gray-500/80">
        Copyright 2025 © Career Compass - All Right Reserved.
      </p>
    </div>
  );
};

export default Footer;
