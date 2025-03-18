import { useState } from "react";
import useCreateUser from "../utils/useCreateUser";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Google from "/google.png";
import { Icons } from "../components/ui/icons";
const Signup = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [club, setClub] = useState("");
  const [role, setRole] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { createUser, oauthSignup } = useCreateUser();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password === passwordConfirm) {
      setIsLoading(true);
      try {
        await createUser(email, username, password, passwordConfirm, isAdmin ? club : "", isAdmin ? role : "", isAdmin);
        navigate("/");
      } catch (error) {
        console.error("Signup error:", error.message);
        alert("Signup Error: " + error.message);
      }
      setIsLoading(false);
    } else {
      alert("Password did not match");
    }
  };

  return (
    <div className="flex min-h-screen w-screen items-center bg-background text-primary-text">
      <div className="hidden sm:block h-screen overflow-hidden sm:w-2/6 bg-[#00376f]">
        {/* Left sidebar content */}
      </div>

      <div className="w-full sm:w-4/6 h-screen flex flex-col justify-center items-start overflow-auto px-5 sm:px-[6rem] py-[6rem] rounded-md">
        <h3 className="text-[1.5rem] font-semibold mb-10">Register</h3>

        <form
          onSubmit={handleSignup}
          className="flex flex-col items-start gap-5 w-full text-[0.9rem] "
        >
          <div className="flex gap-5 w-full">
            <div className="flex flex-col w-1/2">
              <label className="mb-1 font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="px-4 py-2 bg-transparent rounded-md border border-gray-300"
              />
            </div>

            <div className="flex flex-col w-1/2">
              <label className="mb-1 font-medium">Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value.replace(/\s/g, ""))}
                required
                className="px-4 py-2 bg-transparent rounded-md border border-gray-300"
              />
            </div>
          </div>
          
          
          <div className="flex gap-5 w-full">
            <div className="flex flex-col w-1/2">
              <label className="mb-1 font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="px-4 py-2 bg-transparent rounded-md border border-gray-300"
              />
            </div>

            <div className="flex flex-col w-1/2">
              <label className="mb-1 font-medium">Confirm Password</label>
              <input
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
                className="px-4 py-2 bg-transparent rounded-md border border-gray-300"
              />
            </div>
          </div>
          
          {isAdmin && (
            <div className="flex gap-5 w-full">
              <div className="flex flex-col w-1/2">
                <label className="mb-1 font-medium">Club</label>
                <input
                  type="text"
                  value={club}
                  onChange={(e) => setClub(e.target.value)}
                  className="px-4 py-2 bg-transparent rounded-md border border-gray-300"
                />
              </div>

              <div className="flex flex-col w-1/2">
                <label className="mb-1 font-medium">Role</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="px-4 py-2 bg-transparent rounded-md border border-gray-300"
                />
              </div>
            </div>
          )}
          <div className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              id="admin-checkbox"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
              className="w-4 h-4 accent-blue-600 border-gray-300 rounded-full cursor-pointer"
            />
            <label htmlFor="admin-checkbox" className="font-medium cursor-pointer">
              Register as an admin
            </label>
          </div>

          <button
            type="submit"
            className="flex items-center bg-[#00376f] py-3 px-8 mt-10 font-medium rounded-md text-white transition-colors"
          >
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Create Account
          </button>
        </form>

        <div className="mt-5 w-full flex flex-col items-start gap-2">
          <p className="text-sm text-gray-400 mb-2">Or sign up with</p>
          <button
            onClick={oauthSignup}
            className="cursor-pointer bg-white rounded-md py-3 px-8 shadow-md flex justify-center items-center hover:bg-gray-100 transition-colors"
          >
            <img src={Google} className="w-[24px] mr-2" alt="Google" />
            <span className="text-gray-800">Google</span>
          </button>

          <div className="mt-5 flex items-center gap-2">
            <p className="text-slate-800 font-medium">Already have an account?</p>
            <Link to="/login" className="text-blue-600 hover:text-blue-700">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;