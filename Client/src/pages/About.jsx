import { assets } from "../assets/assets";
import Navbar from "../components/Navbar";
import Footer from "./Footer";

const About = () => {
  return (
    <div className="relative">
      <img
        src={assets.gradientBackground}
        alt=""
        className="absolute -top-50 -z-1 opacity-50"
      />
      <Navbar />

      <div className="flex flex-col items-center max-w-4xl mx-auto px-6 mt-24 mb-20 text-gray-700">
        <h1 className="text-4xl font-semibold text-gray-800 mb-6">
          About <span className="text-primary">Career Compass</span>
        </h1>

        <p className="mb-6 leading-relaxed">
          Career Compass is a student-driven platform built to bring
          transparency and clarity to the college placement process. We believe
          that the most reliable guidance comes from students who have recently
          gone through the same journey.
        </p>

        <p className="mb-6 leading-relaxed">
          From internship experiences to full-time placement stories, our goal
          is to create a trusted knowledge base that helps juniors prepare
          smarter, avoid common mistakes, and stay motivated.
        </p>

        <p className="leading-relaxed">
          This platform is built by students, for students — with honesty,
          community support, and growth at its core.
        </p>
      </div>

      <Footer />
    </div>
  );
};

export default About;
