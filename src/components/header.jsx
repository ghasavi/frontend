import { Link, useNavigate } from "react-router-dom";
import { BsCart3, BsPersonCircle } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";
import { useState, useRef, useEffect } from "react";

export default function Header() {
	const [sideDrawerOpened, setSideDrawerOpened] = useState(false);
	const [profileOpen, setProfileOpen] = useState(false);
	const navigate = useNavigate();
	const token = localStorage.getItem("token");
	const profileRef = useRef(null);

	// close dropdown when clicking outside
	useEffect(() => {
		function handleClickOutside(e) {
			if (profileRef.current && !profileRef.current.contains(e.target)) {
				setProfileOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	function handleProfileClick() {
		if (!token) {
			navigate("/login");
		} else {
			setProfileOpen(!profileOpen);
		}
	}

	function handleLogout() {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		window.location.href = "/";
	}

	return (
		<header className="w-full h-[80px] shadow-2xl flex justify-center items-center relative bg-white">
			
			{/* MOBILE MENU */}
			<GiHamburgerMenu
				className="text-3xl md:hidden absolute left-4 cursor-pointer"
				onClick={() => setSideDrawerOpened(true)}
			/>

			{/* LOGO */}
			<img
				src="/logo.png"
				alt="Logo"
				className="w-[80px] h-[80px] object-cover cursor-pointer"
				onClick={() => navigate("/")}
			/>

			{/* DESKTOP NAV */}
			<div className="w-[calc(100%-240px)] h-full hidden md:flex justify-center items-center">
				<Link to="/" className="text-[18px] font-bold mx-3">Home</Link>
				<Link to="/products" className="text-[18px] font-bold mx-3">Products</Link>
				<Link to="/about" className="text-[18px] font-bold mx-3">About</Link>
			</div>

			{/* RIGHT ICONS */}
			<div className="w-[240px] hidden md:flex justify-end items-center gap-6 pr-6 relative">

				<Link to="/cart" className="text-2xl">
					<BsCart3 />
				</Link>

				{/* PROFILE */}
				<div ref={profileRef} className="relative">
					<BsPersonCircle
						className="text-3xl cursor-pointer"
						onClick={handleProfileClick}
					/>

					{/* DROPDOWN */}
					{profileOpen && token && (
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
									onClick={handleLogout}
									className="px-4 py-3 hover:bg-red-100 text-red-600 cursor-pointer rounded-b-xl"
								>
									Sign Out
								</li>
							</ul>
						</div>
					)}
				</div>
			</div>

			{/* MOBILE SIDE DRAWER */}
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
							<button onClick={handleProfileClick} className="mt-6">
								Profile
							</button>
						</div>
					</div>
				</div>
			)}
		</header>
	);
}
