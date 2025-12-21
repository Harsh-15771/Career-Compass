import { assets } from "../assets/assets";
import Navbar from "../components/Navbar";
import Footer from "./Footer";

const FAQs = () => {
  return (
    <div className="relative">
      <img
        src={assets.gradientBackground}
        alt=""
        className="absolute -top-50 -z-1 opacity-50"
      />
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 mt-24 mb-20 text-gray-700">
        <h1 className="text-center text-4xl font-semibold text-gray-800 mb-10">
          Frequently Asked <span className="text-primary">Questions</span>
        </h1>

        <div className="space-y-8">
          <div>
            <h3 className="font-semibold text-lg text-gray-800 mb-2">
              Who can post blogs on Career Compass?
            </h3>
            <p>
              Any verified student can share their internship or placement
              experience after logging in.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg text-gray-800 mb-2">
              Are resumes visible to everyone?
            </h3>
            <p>
              Yes, resumes are shared to help juniors understand real-world CV
              expectations. Personal details should be hidden by the uploader.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg text-gray-800 mb-2">
              Is the information verified?
            </h3>
            <p>
              Blogs are moderated for relevance, but the content reflects the
              personal experiences of students.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg text-gray-800 mb-2">
              Is Career Compass free to use?
            </h3>
            <p>
              Yes, the platform is completely free and built for the student
              community.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FAQs;
