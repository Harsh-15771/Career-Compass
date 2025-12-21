import { assets } from "../assets/assets";
import Navbar from "../components/Navbar";
import Footer from "./Footer";

const Contact = () => {
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
          Contact <span className="text-primary">Us</span>
        </h1>

        <p className="mb-8">
          Have a question, suggestion, or feedback? We'd love to hear from you.
        </p>

        <div className="space-y-4 text-lg">
          <p>
            📧 <span className="font-medium">Email:</span>{" "}
            <span className="text-primary">help.career.compass@gmail.com</span>
          </p>

          <p>
            📍 <span className="font-medium">Built at:</span> VNIT Nagpur
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
