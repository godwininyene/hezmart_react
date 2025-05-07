import { Link } from "react-router-dom";
import { logo_white, logo} from "../assets/images";
import { LuShoppingCart } from "react-icons/lu";
import SearchBar from "./SearchBar";
import { useCart } from "./contexts/CartContext";
const Header = ()=>{
    const { cartCount } = useCart();
    return(
        <div>
            {/* Top Bar  */}
            <div className="bg-primary-light">
                <div className="max-w-5xl mx-auto lg:px-0 px-4 flex items-center scroll-py-20 ">
                    <Link  to='sell-on-hezmart' className="text-white lg:text-base text-xs cursor-pointer">
                        Sell on Hezmart
                    </Link>

                    <img src={logo_white} alt="Logo" width={76}  className="mx-auto -translate-x-8"/>

                </div>

            </div>
           
            {/* Navigation  */}
            <nav className="hidden py-2 max-w-5xl mx-auto lg:px-0 px-4 lg:flex  lg:justify-between">
                <Link to='/'>
                    <img src={logo} alt="Logo"/>
                </Link>
                <SearchBar/>
                <div className="flex gap-3">
                    <Link
                        to="/customer-register"
                        className="text-white bg-gradient-to-r rounded-xl  py-2 from-primary-light to-primary-dark px-5
                        cursor-pointer
                        "
                    >
                        Signup
                    </Link>

                    <Link
                        to="/login"
                        className="cursor-pointer py-2 px-5 rounded-xl text-primary-light border border-primary-light "
                    >
                        Login
                      
                    </Link>

                    

                    <Link to='/cart' className="bg-primary-light py-2 gap-x-1 font-medium text-white px-5 ml-4 flex items-center rounded shadow">
                        <LuShoppingCart className="text-2xl" />
                       {cartCount > 0 &&  <span>{cartCount}</span>}
                    </Link>
                </div>
            </nav>
        </div>
       
    )
}

export default Header;