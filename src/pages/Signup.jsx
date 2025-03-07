import { useState } from "react";
import useCreateUser from "../utils/useCreateUser";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Google from "/google.png";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const { createUser, oauthSignup } = useCreateUser();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password === passwordConfirm) {
      try {
        await createUser(email, username, password, passwordConfirm);
        navigate("/");
      } catch (error) {
        console.error("Signup error:", error.message);
        alert("Signup Error: " + error.message);
      }
    } else {
      alert("Password did not match");
    }
  };

  return (
    <div className="flex h-screen w-screen items-center bg-background text-primary-text">
      <div className="hidden sm:block h-screen sm:w-2/6 bg-blue-400">
        {/* Left sidebar content */}
      </div>

      <div className="w-full sm:w-4/6 h-screen flex flex-col justify-center items-start px-5 sm:px-[6rem] py-10 rounded-md">
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
                className=" px-4 py-2 bg-transparent rounded-md border border-gray-300"
              />
            </div>

            <div className="flex flex-col w-1/2">
              <label className="mb-1 font-medium">Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value.replace(/\s/g, ""))}
                required
                className=" px-4 py-2 bg-transparent rounded-md border border-gray-300"
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

          <button
            type="submit"
            className="bg-blue-600 py-3 px-8 mt-10 font-medium rounded-md text-white hover:bg-blue-700 transition-colors"
          >
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
