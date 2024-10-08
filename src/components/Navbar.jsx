import { useState } from "react";
import { Link } from "react-router-dom";
import UserContext from "../utils/UserContext";
import { useContext } from "react";
import useLogout from "../utils/useLogout";

const Navbar = () => {
    const [inputText, setInputText] = useState('');

    
    const logout = useLogout();

    const handleTextChange = (e) => {
        setInputText(e.target.value);
      };

    const { loggedinUser, userId, updateLoggedinUser } = useContext(UserContext);
      
    const handleLogout = () => {
        logout();
        updateLoggedinUser();
    }
    return(
        <div className="h-[10vh] w-[100%] flex justify-between items-center bg-[#0e1116] border-b-[1px] border-[#1c1f26] fixed px-10 font-medium z-10">
            <Link to="/" className="hover:text-white text-[1.2rem] font-bold text-white">
                AMUStudy
            </Link>
            <div className="flex items-center gap-10">

                <input
                    type="text"
                    className="sm:inline hidden styled-input w-[30vw] py-2 pl-3 bg-[#1c1f26]  rounded-md focus:outline-none"
                    placeholder="Search AMUStudy"
                    value={inputText}
                    onChange={handleTextChange}
                    />
                {loggedinUser !== '' ? (
                    <button 
                        className="logout-btn text-red-400 hover:border-red-400"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                ) : (
                    <Link to={'/login'} className="text-white hover:text-white/90">
                        Login
                    </Link>
                )}
                
            </div>
        </div>
    )
}

export default Navbar;