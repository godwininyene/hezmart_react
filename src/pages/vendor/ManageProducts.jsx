import Button from "../../components/common/Button";
import { Link } from "react-router-dom";
const ManageProducts = ()=>{
    return(
        <div className="">
            {/* Header and button */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Products Manager</h1>
                <Link to="/manage/vendor/add-product" className="cursor-pointer">
                    <button className="text-primary-dark font-medium cursor-pointer">Add Product</button>
                </Link>

            </div>

            {/*Products goes here */}
        </div>


  
    )
}

export default ManageProducts;
