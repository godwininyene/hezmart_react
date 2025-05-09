import { Link } from "react-router-dom";
import { logo_white, logo } from "../assets/images";
import { LuShoppingCart } from "react-icons/lu";
import { 
  FiUser, 
  FiLogOut, 
  FiShoppingBag,
  FiSettings,
  FiChevronDown,
  FiChevronUp 
} from "react-icons/fi";
import { useState } from "react";
import SearchBar from "./SearchBar";
import { useCart } from "./contexts/CartContext";

const Header = () => {
    const { cartCount } = useCart();
    const user = JSON.parse(localStorage.getItem('user'));
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
    const closeDropdown = () => setIsDropdownOpen(false);

    return (
        <div>
            {/* Top Bar */}
            <div className="bg-primary-light">
                <div className="max-w-5xl mx-auto lg:px-0 px-4 flex items-center scroll-py-20">
                    <Link to='sell-on-hezmart' className="text-white lg:text-base text-xs cursor-pointer">
                        Sell on Hezmart
                    </Link>

                    <img src={logo_white} alt="Logo" width={76} className="mx-auto -translate-x-8"/>
                </div>
            </div>
           
            {/* Navigation */}
            <nav className="hidden py-2 max-w-5xl mx-auto lg:px-0 px-4 lg:flex lg:justify-between">
                <Link to='/'>
                    <img src={logo} alt="Logo"/>
                </Link>
                <SearchBar/>
                <div className="flex gap-3 items-center">
                    {user ? (
                        // Show profile dropdown when user is logged in
                        <div className="relative">
                            <button 
                                onClick={toggleDropdown}
                                className="flex items-center gap-2 focus:outline-none group"
                            >
                                <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-white">
                                    {user.firstName?.charAt(0) || <FiUser />}
                                </div>
                                <div className="flex items-center">
                                    <span className="text-gray-700 mr-1">
                                        {user.firstName || 'Profile'}
                                    </span>
                                    {isDropdownOpen ? (
                                        <FiChevronUp className="text-gray-500 transition-transform" />
                                    ) : (
                                        <FiChevronDown className="text-gray-500 transition-transform group-hover:translate-y-0.5" />
                                    )}
                                </div>
                            </button>
                            
                            {/* Dropdown Menu */}
                            {isDropdownOpen && (
                                <div 
                                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Link
                                        to="/profile"
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={closeDropdown}
                                    >
                                        <FiUser className="mr-2 text-gray-500" />
                                        My Profile
                                    </Link>
                                    <Link
                                        to="/orders"
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={closeDropdown}
                                    >
                                        <FiShoppingBag className="mr-2 text-gray-500" />
                                        My Orders
                                    </Link>
                                    <Link
                                        to="/settings"
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={closeDropdown}
                                    >
                                        <FiSettings className="mr-2 text-gray-500" />
                                        Settings
                                    </Link>
                                    <Link
                                        to="/logout"
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t border-gray-100"
                                        onClick={closeDropdown}
                                    >
                                        <FiLogOut className="mr-2 text-gray-500" />
                                        Logout
                                    </Link>
                                </div>
                            )}
                        </div>
                    ) : (
                        // Show login/signup buttons when no user
                        <>
                            <Link
                                to="/customer-register"
                                className="text-white bg-gradient-to-r rounded-xl py-2 from-primary-light to-primary-dark px-5 cursor-pointer"
                            >
                                Signup
                            </Link>
                            <Link
                                to="/login"
                                className="cursor-pointer py-2 px-5 rounded-xl text-primary-light border border-primary-light"
                            >
                                Login
                            </Link>
                        </>
                    )}

                    <Link to='/cart' className="bg-primary-light py-2 gap-x-1 font-medium text-white px-5 ml-4 flex items-center rounded shadow">
                        <LuShoppingCart className="text-2xl" />
                        {cartCount > 0 && <span>{cartCount}</span>}
                    </Link>
                </div>
            </nav>

            {/* Close dropdown when clicking outside */}
            {isDropdownOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-transparent"
                    onClick={closeDropdown}
                />
            )}
        </div>
    );
};

export default Header;