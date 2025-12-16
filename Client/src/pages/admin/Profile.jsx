import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";
import Loader from "../../components/Loader";

const Profile = () => {
  const { axios } = useAppContext();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    branch: "",
    year: "",
  });

  /* ---------------- FETCH PROFILE ---------------- */
  const fetchProfile = async () => {
    try {
      const { data } = await axios.get("/api/user/profile");
      setUser(data);
      setFormData({
        name: data.name,
        branch: data.branch,
        year: data.year,
      });
    } catch {
      toast.error("Please login again");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  /* ---------------- UPDATE PROFILE ---------------- */
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const { data } = await axios.put("/api/user/profile", formData);
      setUser(data.user);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Update failed");
    } finally {
      setIsSaving(false);
    }
  };

  /* ---------------- DELETE PROFILE ---------------- */
  const handleDelete = async () => {
    if (!window.confirm("This will permanently delete your account. Continue?"))
      return;

    try {
      await axios.delete("/api/user/profile");
      localStorage.removeItem("token");
      toast.success("Profile deleted");
      navigate("/signup");
    } catch {
      toast.error("Delete failed");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="relative">
      <Navbar />

      {/* -------- PROFILE HEADER -------- */}
      <div className="text-center mt-20 text-gray-600">
        <h1 className="text-3xl sm:text-5xl font-semibold text-gray-800">
          My <span className="text-primary">Profile</span>
        </h1>

        <p className="font-light mt-3 text-lg">Manage your account details</p>
      </div>

      {/* -------- PROFILE BODY -------- */}
      <div className="flex flex-col items-center mx-5 max-w-3xl md:mx-auto my-16">
        {!isEditing ? (
          /* -------- VIEW MODE -------- */
          <div className="space-y-6 text-gray text-lg">
            <p>
              <span className="font-medium text-2xl">Name: {user.name}</span>
            </p>

            <p>
              <span className="font-medium text-2xl">Email: {user.email}</span>
            </p>

            <p>
              <span className="font-medium text-2xl">
                Branch: {user.branch}
              </span>
            </p>

            <p>
              <span className="font-medium text-2xl">Year: {user.year}</span>
            </p>

            <div className="flex gap-4 pt-8">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-primary text-white rounded px-6 py-2 hover:scale-102 transition-all"
              >
                Edit Profile
              </button>

              <button
                onClick={handleDelete}
                className="border border-primary text-primary rounded px-6 py-2 hover:bg-primary/5 transition-all"
              >
                Delete Account
              </button>
            </div>
          </div>
        ) : (
          /* -------- EDIT MODE -------- */
          <form
            onSubmit={handleUpdate}
            className="flex flex-col gap-6 text-gray-600 max-w-md"
          >
            <div className="flex flex-col">
              <label>Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="border-b-2 border-gray-300 p-2 outline-none"
                required
              />
            </div>

            <div className="flex flex-col">
              <label>Branch</label>
              <select
                value={formData.branch}
                onChange={(e) =>
                  setFormData({ ...formData, branch: e.target.value })
                }
                className="border-b-2 border-gray-300 p-2 outline-none bg-transparent"
                required
              >
                <option value="">Select Branch</option>
                <option value="Architecture">Architecture</option>
                <option value="Civil">Civil</option>
                <option value="Chemical">Chemical</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Computer Science">Computer Science</option>
                <option value="ECE">ECE</option>
                <option value="Electrical">Electrical</option>
                <option value="Metallurgy">Metallurgy</option>
                <option value="Mining">Mining</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label>Year</label>
              <select
                value={formData.year}
                onChange={(e) =>
                  setFormData({ ...formData, year: e.target.value })
                }
                className="border-b-2 border-gray-300 p-2 outline-none bg-transparent"
                required
              >
                <option value="">Select Year</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="5th Year">5th Year</option>
              </select>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isSaving}
                className="bg-primary text-white rounded px-6 py-2 hover:scale-102 transition-all"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>

              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="border border-gray-400 rounded px-6 py-2"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
