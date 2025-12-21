import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";
import Loader from "../../components/Loader";
import BlogCard from "../../components/BlogCard";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    axios,
    user: loggedInUser,
    token,
    authLoading,
    logout,
    fetchBlogs,
  } = useAppContext();

  const isOwnProfile = !id;

  const [user, setUser] = useState(null);
  const [blogs, setLocalBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    branch: "",
    year: "",
  });

  /* ---------------- FETCH PROFILE ---------------- */
  const fetchProfile = async () => {
    try {
      if (isOwnProfile) {
        const { data } = await axios.get("/api/user/profile");
        setUser(data);
        setFormData({
          name: data.name,
          branch: data.branch,
          year: data.year,
        });
      } else {
        const { data } = await axios.get(`/api/user/${id}`);
        setUser(data.user);
        setLocalBlogs(data.blogs || []);
      }
    } catch {
      toast.error("Profile not found");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!id && !loggedInUser) return;

    fetchProfile();
  }, [id, authLoading, loggedInUser]);

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
      setIsDeleting(true);

      await axios.delete("/api/user/profile");

      await fetchBlogs();
      logout();

      toast.success("Account deleted");
      navigate("/");
    } catch {
      toast.error("Delete failed");
    } finally {
      setIsDeleting(false);
    }
  };

  if (authLoading || loading) return <Loader />;
  if (!user) return <Loader />;

  return (
    <div className="relative">
      <Navbar />

      <div className="text-center mt-20 text-gray-600">
        <h1 className="text-3xl sm:text-5xl font-semibold text-gray-800">
          {isOwnProfile ? (
            <>
              My <span className="text-primary">Profile</span>
            </>
          ) : (
            <>
              {user.name}'s <span className="text-primary">Profile</span>
            </>
          )}
        </h1>

        <p className="font-light mt-3 text-lg">
          {user?.branch} • {user?.year}
        </p>
      </div>

      <div className="flex flex-col items-center mx-5 max-w-3xl md:mx-auto my-16">
        {isOwnProfile ? (
          !isEditing ? (
            <div className="space-y-6 text-gray text-lg">
              <p className="font-medium text-2xl">Name: {user.name}</p>
              <p className="font-medium text-2xl">Email: {user.email}</p>
              <p className="font-medium text-2xl">Branch: {user.branch}</p>
              <p className="font-medium text-2xl">Year: {user.year}</p>

              <div className="flex gap-4 pt-8">
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-primary text-white rounded-full px-6 py-2 hover:scale-102 transition-all cursor-pointer"
                >
                  Edit Profile
                </button>

                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="border border-red-500 text-red-500 rounded-full px-6 py-2 hover:bg-red-50 transition-all cursor-pointer"
                >
                  {isDeleting ? "Deleting..." : "Delete Account"}
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleUpdate}
              className="flex flex-col gap-6 text-gray-600 max-w-md"
            >
              <div className="flex flex-col">
                <label>Name</label>
                <input
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
                  <option>Architecture</option>
                  <option>Civil</option>
                  <option>Chemical</option>
                  <option>Mechanical</option>
                  <option>Computer Science</option>
                  <option>ECE</option>
                  <option>Electrical</option>
                  <option>Metallurgy</option>
                  <option>Mining</option>
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
                  <option>1st Year</option>
                  <option>2nd Year</option>
                  <option>3rd Year</option>
                  <option>4th Year</option>
                  <option>5th Year</option>
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-primary text-white rounded-full px-6 py-2 hover:scale-102 transition-all cursor-pointer"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="border border-gray-400 rounded-full hover:bg-primary/5 px-6 py-2 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          )
        ) : (
          <>
            <p className="font-medium text-xl mb-6">Blogs by {user.name}</p>

            {blogs.length === 0 ? (
              <p className="text-gray-500">No blogs published yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                {blogs.map((blog) => (
                  <BlogCard key={blog._id} blog={blog} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
