import { useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { useUserLogOutMutation } from "../redux/API/AuthApiSlice";
import { toast } from "react-toastify";

export const Header = () => {
  // State to manage the navbar's visibility
  const [nav, setNav] = useState(false);
  const [userLogOut] = useUserLogOutMutation();
  const token = sessionStorage.getItem("token");
  const navigate = useNavigate();

  // Toggle function to handle the navbar's display
  const handleNav = () => {
    setNav(!nav);
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    await userLogOut(token)
      .unwrap()
      .then((fulfilled) => {
        if (fulfilled) {
          sessionStorage.removeItem("token");
          toast("logout successfully");
          navigate("/login");
        }
      })
      .catch((rejected) => {
        console.error(rejected);
        toast.error(rejected?.data?.message || "Error occurred", {});
      });
  };

  // Array containing navigation items
  const navItems = [
    { id: 1, text: "Home", url: "/" },
    { id: 2, text: "create User", url: "/createUser" },
    { id: 3, text: "posts", url: "/posts" },
    { id: 4, text: "create post", url: "/createPost" },
  ];

  return (
    <div className="bg-black flex justify-between items-center h-24  mx-auto px-4 text-white">
      {/* Logo */}
      <h1 className="w-full text-3xl font-bold text-[#00df9a]">REACT.</h1>

      {/* Desktop Navigation */}
      <ul className="hidden md:flex">
        {navItems.map((item) => (
          <Link key={item.id} to={item.url}>
            <li className="p-4 hover:bg-[#00df9a] rounded-xl m-2 cursor-pointer duration-300 hover:text-black">
              {item.text}
            </li>
          </Link>
        ))}
        <li className="p-4 hover:bg-[#00df9a] rounded-xl m-2 cursor-pointer duration-300 hover:text-black">
          <a onClick={(e) => handleLogout(e)}>LogOut</a>
        </li>
      </ul>

      {/* Mobile Navigation Icon */}
      <div onClick={handleNav} className="block md:hidden">
        {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
      </div>

      {/* Mobile Navigation Menu */}
      <ul
        className={
          nav
            ? "fixed md:hidden left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-[#000300] ease-in-out duration-500"
            : "ease-in-out w-[60%] duration-500 fixed top-0 bottom-0 left-[-100%]"
        }
      >
        {/* Mobile Logo */}
        <h1 className="w-full text-3xl font-bold text-[#00df9a] m-4">REACT.</h1>

        {/* Mobile Navigation Items */}
        {navItems.map((item) => (
          <Link key={item.id} to={item.url}>
            <li className="p-4 border-b rounded-xl hover:bg-[#00df9a] duration-300 hover:text-black cursor-pointer border-gray-600">
              {item.text}
            </li>
          </Link>
        ))}
        <li className="p-4 border-b rounded-xl hover:bg-[#00df9a] duration-300 hover:text-black cursor-pointer border-gray-600">
          <a onClick={(e) => handleLogout(e)}>LogOut</a>
        </li>
      </ul>
    </div>
  );
};
