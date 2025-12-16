import React from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const Header = () => {
  const { input, setInput } = useAppContext();

  const onSubmitHandler = (e) => {
    e.preventDefault();
  };

  return (
    <div className="mx-8 sm:mx-16 xl:mx-24 relative">
      <div className="text-center mt-20 mb-8">
        <div className="inline-flex items-center justify-center gap-4 px-6 py-1.5 mb-4 border border-primary/40 bg-primary/10 rounded-full text-sm text-primary">
          <p>New: AI feature integrated</p>
          <img src={assets.star} />
        </div>

        <h1 className="text-2xl sm:text-5xl font-semibold text-gray-700">
          Student Success Roadmap:
          <br />
          <span className="text-primary">Internship & Placement Insights.</span>
        </h1>

        <p className="my-6 max-w-2xl mx-auto text-gray-500">
          Your next career step starts with a shared story. Dive into a
          community-driven library of internship and placement journeys.
        </p>

        {/* SEARCH */}
        <form
          onSubmit={onSubmitHandler}
          className="flex max-w-lg mx-auto border border-gray-300 bg-white rounded overflow-hidden"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search by company, role, or name"
            className="w-full pl-4 outline-none"
          />
          <button
            type="submit"
            className="bg-primary text-white px-8 py-2 m-1.5 rounded cursor-pointer"
          >
            Search
          </button>
        </form>
      </div>

      <img
        src={assets.gradientBackground}
        alt=""
        className="absolute -top-50 -z-1 opacity-50"
      />
    </div>
  );
};

export default Header;
