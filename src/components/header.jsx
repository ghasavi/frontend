import { Link, useNavigate } from "react-router-dom";
import { BsCart3 } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";
import { useState, useRef, useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function Header() {
  const [sideDrawerOpened, setSideDrawerOpened] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const navigate = useNavigate();
  const { user, logout } = useContext(UserContext);

  const handleProfileClick = () => {
    if (!user) navigate("/login");
    else setProfileOpen(!profileOpen);
  };

  return (
    <header className="w-full h-[80px] shadow-2xl flex justify-center items-center relative bg-white">
      <GiHamburgerMenu
        className="text-3xl md:hidden absolute left-4 cursor-pointer"
        onClick={() => setSideDrawerOpened(true)}
      />

      <img
        src="/logo.png"
        alt="Logo"
        className="w-[80px] h-[80px] object-cover cursor-pointer"
        onClick={() => navigate("/")}
      />

      <div className="w-[calc(100%-240px)] h-full hidden md:flex justify-center items-center">
        <Link to="/" className="text-[18px] font-bold mx-3">Home</Link>
        <Link to="/products" className="text-[18px] font-bold mx-3">Products</Link>
        <Link to="/about" className="text-[18px] font-bold mx-3">About</Link>
      </div>

      <div className="w-[240px] hidden md:flex justify-end items-center gap-6 pr-6 relative">
        <Link to="/cart" className="text-2xl"><BsCart3 /></Link>

        <div ref={profileRef} className="relative">
          {user?.img ? (
            <img
              src={user.img}
              alt="Avatar"
              onClick={handleProfileClick}
              className="w-10 h-10 rounded-full object-cover cursor-pointer border-2 border-gray-300"
              onError={(e) => { e.target.onerror = null; e.target.src = "/defaultUser.png"; }}
            />
          ) : (
            <img
              src="/defaultUser.png"
              alt="Default"
              className="w-10 h-10 rounded-full border-2 border-gray-300 cursor-pointer"
              onClick={handleProfileClick}
            />
          )}

          {profileOpen && user && (
            <div className="absolute right-0 top-12 w-56 bg-white shadow-xl rounded-xl border z-50">
              <ul className="flex flex-col text-sm font-medium">
                <li onClick={() => navigate("/profile")} className="px-4 py-3 hover:bg-gray-100 cursor-pointer">
                  Your Profile
                </li>
                <li onClick={() => navigate("/orders")} className="px-4 py-3 hover:bg-gray-100 cursor-pointer">
                  Your Orders
                </li>
                <li onClick={() => navigate("/favourites")} className="px-4 py-3 hover:bg-gray-100 cursor-pointer">
                  Your Favourites
                </li>
                <li onClick={() => navigate("/reviews")} className="px-4 py-3 hover:bg-gray-100 cursor-pointer">
                  Your Reviews
                </li>
                <li
                  onClick={logout}
                  className="px-4 py-3 hover:bg-red-100 text-red-600 cursor-pointer rounded-b-xl"
                >
                  Sign Out
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {sideDrawerOpened && (
        <div className="fixed inset-0 bg-black/40 z-50 md:hidden">
          <div className="w-[300px] bg-white h-full">
            <div className="h-[80px] flex items-center justify-center shadow relative">
              <GiHamburgerMenu
                className="text-3xl absolute left-4 cursor-pointer"
                onClick={() => setSideDrawerOpened(false)}
              />
              <img
                src="/logo.png"
                alt="Logo"
                className="w-[80px] h-[80px] object-cover cursor-pointer"
                onClick={() => window.location.href = "/"}
              />
            </div>
            <div className="flex flex-col items-center gap-6 mt-10 text-lg font-bold">
              <Link to="/">Home</Link>
              <Link to="/products">Products</Link>
              <Link to="/about">About</Link>
              <Link to="/cart"><BsCart3 /></Link>
              <button onClick={handleProfileClick} className="mt-6">Profile</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
