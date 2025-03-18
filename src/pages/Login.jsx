import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import useLogin from "../utils/useLogin";
import { Link } from "react-router-dom";
import Google from '/google.png';
import { Icons } from "../components/ui/icons";
import UserContext from "../utils/UserContext";

const Login = () => {
  const navigate = useNavigate();
  const { login, handleSubmit, handleOauth } = useLogin();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { updateLoggedinUser } = useContext(UserContext);
  
  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await handleSubmit(e);

      updateLoggedinUser();
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
      navigate('/'); 
    }
  };

  const onOauthLogin = async () => {
    setIsLoading(true);
    try {
      await handleOauth();
      updateLoggedinUser();
    } catch (error) {
      console.error("OAuth login error:", error);
    } finally {
      setIsLoading(false);
      navigate('/');
    }
  };

  

  return (
    <div className="flex min-h-screen w-screen items-center bg-background text-primary-text">
      <div className="hidden sm:flex sm:flex-col sm:justify-center h-screen overflow-hidden sm:w-2/6 bg-[#00376f] text-white p-8 relative">
        {/* Left sidebar content */}
        <div className="mb-16 z-10">
          <h1 className="text-4xl font-bold font-mont mb-3">Gathr.</h1>
          <p className="text-xl font-light opacity-90 mb-6">Bringing Campus Events to Life!</p>
          <div className="h-1 w-16 bg-white opacity-60 rounded"></div>
        </div>
      </div>

      <div className="w-full sm:w-4/6 h-screen flex flex-col justify-center items-start overflow-auto px-5 sm:px-[6rem] py-[6rem] rounded-md">
        <h3 className="text-[1.5rem] font-semibold mb-10">Login</h3>

        <form
          onSubmit={onSubmit}
          className="flex flex-col items-start gap-5 w-full text-[0.9rem]"
        >
          <div className="flex flex-col w-full">
            <label className="mb-1 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="px-4 py-2 bg-transparent rounded-md border border-gray-300"
            />
          </div>

          <div className="flex flex-col w-full">
            <label className="mb-1 font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="px-4 py-2 bg-transparent rounded-md border border-gray-300"
            />
          </div>

          <button
            type="submit"
            className="flex items-center bg-[#00376f] py-3 px-8 mt-5 font-medium rounded-md text-white transition-colors"
          >
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Login
          </button>
        </form>

        <div className="mt-5 w-full flex flex-col items-start gap-2">
          <p className="text-sm text-gray-400 mb-2">Or login with</p>
          <button
            onClick={onOauthLogin}
            className="cursor-pointer bg-white rounded-md py-3 px-8 shadow-md flex justify-center items-center hover:bg-gray-100 transition-colors"
          >
            <img src={Google} className="w-[24px] mr-2" alt="Google" />
            <span className="text-gray-800">Google</span>
          </button>

          <div className="mt-5 flex items-center gap-2">
            <p className="text-slate-800 font-medium">New to AMUStudy?</p>
            <Link to="/signup" className="text-blue-600 hover:text-blue-700">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;