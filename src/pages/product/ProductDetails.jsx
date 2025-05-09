import { useEffect, useState } from "react";
import axios from "../../lib/axios";
import { useParams, Link } from "react-router-dom";
import { FiShoppingCart, FiHeart, FiShare2 } from "react-icons/fi";
import { ReviewsSection, renderRatingStars } from "./ReviewComponent";
import { ProductTabs } from "./ProductTabs";
import { useCart } from "../../components/contexts/CartContext.jsx";
import { toast } from 'react-toastify';

const ProductDetails = () => {
    const { addToCart, cart } = useCart();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState();
    const [quantity, setQuantity] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [activeTab, setActiveTab] = useState('description');
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({
        rating: 1,
        comment: ''
    });

    const user = JSON.parse(localStorage.getItem('user'));
    const url = user?.role === 'admin' || user?.role === 'vendor' 
        ? `api/v1/products/${id}` 
        : `api/v1/products/${id}?status=active`;

    const fetchProductDetail = async () => {
        try {
            const res = await axios.get(url);
            setProduct(res.data.data.product);
            
            // Initialize selected options
            const initialOptions = {};
            if (res.data.data.product.options) {
                res.data.data.product.options.forEach(option => {
                    initialOptions[option.name] = option.values[0].value;
                });
            }
            // setSelectedOptions(initialOptions);
            
            // Fetch reviews (mock data for now - replace with actual API call)
            const mockReviews = [
                {
                    id: 1,
                    user: {
                        name: "John Doe",
                        avatar: "https://randomuser.me/api/portraits/men/1.jpg"
                    },
                    rating: 5,
                    comment: "Excellent product! Very happy with my purchase.",
                    date: "2025-05-01"
                },
                {
                    id: 2,
                    user: {
                        name: "Jane Smith",
                        avatar: "https://randomuser.me/api/portraits/women/1.jpg"
                    },
                    rating: 2,
                    comment: "Good quality but shipping took longer than expected.",
                    date: "2025-04-28"
                }
            ];
            setReviews(mockReviews);
            
        } catch (error) {
            console.error("Error fetching product:", error);
            toast.error("Failed to load product details");
        } finally {
            setLoading(false);
        }
    };

    const handleOptionSelect = (optionName, value) => {
        setSelectedOptions(prev => ({
            ...prev,
            [optionName]: value
        }));
    };

    const handleQuantityChange = (change) => {
        setQuantity(prev => {
            const newQuantity = prev + change;
            return newQuantity < 1 ? 1 : newQuantity > product.stockQuantity ? product.stockQuantity : newQuantity;
        });
    };

    const handleAddToCart = async () => {
        if (!product) return;
        
        const result = await addToCart(product, quantity, selectedOptions);
        if (result.success) {
            toast.success(`${product.name} added to cart!`);
        } else {
            toast.error(result.error?.message || 'Failed to add to cart');
        }
    };

    const handleSubmitReview = (e) => {
        e.preventDefault();
        // Implement review submission logic
        console.log("Submitting review:", newReview);
        // After submission, you would typically refresh the reviews
        setReviews(prev => [
            {
                id: Date.now(),
                user: {
                    name: user?.firstName + " " + user?.lastName,
                    avatar: user?.profilePicture || "https://randomuser.me/api/portraits/men/2.jpg"
                },
                rating: newReview.rating,
                comment: newReview.comment,
                date: new Date().toISOString().split('T')[0]
            },
            ...prev
        ]);
        setNewReview({ rating: 5, comment: '' });
    };

    const calculateDiscountPercentage = () => {
        const discountPrice = parseFloat(product.discountPrice);
        const actualPrice = parseFloat(product.price);
        
        if (!discountPrice || discountPrice >= actualPrice) return 0;
        
        return Math.round((1 - discountPrice / actualPrice) * 100);
    };

    const getDisplayPrice = () => {
        return product.discountPrice || product.price;
    };

    useEffect(() => {
        fetchProductDetail();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-dark mx-auto"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-white py-12 px-4">
                <div className="max-w-md w-full text-center p-8 bg-white rounded-xl shadow-lg border border-gray-100">
                    <div className="flex justify-center mb-6">
                        <div className="h-16 w-16 rounded-full bg-rose-100 flex items-center justify-center">
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-8 w-8 text-rose-500" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={1.5} 
                                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                                />
                            </svg>
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">Product Not Found</h2>
                    <p className="text-gray-600 mb-6">
                        The product you're looking for doesn't exist or may have been removed.
                    </p>
                    <div className="space-y-3">
                        <button
                            onClick={() => window.history.back()}
                            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
                        >
                            Go Back
                        </button>
                        <Link
                            to="/"
                            className="inline-block w-full px-6 py-3 border border-gray-300 hover:border-gray-400 text-gray-700 font-medium rounded-lg transition-all duration-200 hover:shadow active:scale-95"
                        >
                            Browse Products
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const discountPercentage = calculateDiscountPercentage();
    const displayPrice = getDisplayPrice();

    const reviewsSection = (
        <ReviewsSection
            product={product}
            user={user}
            reviews={reviews}
            newReview={newReview}
            setNewReview={setNewReview}
            handleSubmitReview={handleSubmitReview}
        />
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Product Overview */}
            <div className="flex flex-col md:flex-row gap-8 mb-12">
                {/* Product Images */}
                <div className="md:w-1/2">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
                        <img 
                            src={product.images?.[selectedImage] || product.coverImage} 
                            alt={product.name} 
                            className="w-full h-96 object-contain"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {product.images?.map((img, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedImage(index)}
                                className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${selectedImage === index ? 'border-blue-500' : 'border-transparent'}`}
                            >
                                <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div className="md:w-1/2">
                    <div className="mb-4">
                        <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                        <div className="flex items-center mt-2">
                            <div className="flex mr-2">
                                {renderRatingStars(product.ratingsAverage)}
                            </div>
                            <span className="text-sm text-gray-500">
                                ({product.ratingsQuantity} reviews)
                            </span>
                        </div>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center">
                            <span className="text-3xl font-bold text-gray-900">
                                ₦{displayPrice.toLocaleString()}
                            </span>
                           
                            {discountPercentage > 0 && (
                                
                                <>
                                    <span className="ml-2 text-lg text-gray-500 line-through">
                                        ₦{product.price.toLocaleString()}
                                    </span>
                                    <span className="ml-2 bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded">
                                        {discountPercentage}% OFF
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Product Options */}
                    {product.options?.map(option => (
                        <div key={option.id} className="mb-4">
                            <h3 className="text-sm font-medium text-gray-900 mb-2">{option.name}</h3>
                            <div className="flex flex-wrap gap-2">
                                {option.values.map(value => (
                                    <button
                                        key={value.id}
                                        onClick={() => handleOptionSelect(option.name, value.value)}
                                        className={`px-3 py-1 border rounded-md text-sm ${selectedOptions[option.name] === value.value 
                                            ? 'bg-blue-100 border-blue-500 text-blue-800' 
                                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                                    >
                                        {value.value}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Quantity and Add to Cart */}
                    <div className="mb-6">
                        <div className="flex items-center mb-4">
                            <span className="text-sm font-medium text-gray-900 mr-4">Quantity</span>
                            <div className="flex items-center border border-gray-300 rounded-md">
                                <button 
                                    onClick={() => handleQuantityChange(-1)}
                                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                >
                                    -
                                </button>
                                <span className="px-4 py-1 text-gray-900">{quantity}</span>
                                <button 
                                    onClick={() => handleQuantityChange(1)}
                                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                >
                                    +
                                </button>
                            </div>
                            <span className="ml-4 text-sm text-gray-500">
                                {product.stockQuantity} available
                            </span>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleAddToCart}
                                disabled={cart.loading}
                                className="flex-1 bg-primary-light hover:bg-primary-dark text-white py-3 px-6 rounded-md flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {cart.loading ? (
                                    'Adding...'
                                ) : (
                                    <>
                                        <FiShoppingCart /> Add to Cart
                                    </>
                                )}
                            </button>
                            <button className="p-3 border border-gray-300 rounded-md hover:bg-gray-50">
                                <FiHeart className="text-gray-600" />
                            </button>
                            <button className="p-3 border border-gray-300 rounded-md hover:bg-gray-50">
                                <FiShare2 className="text-gray-600" />
                            </button>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="border-t border-gray-200 pt-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-500">Category:</span>
                                <span className="ml-2 text-gray-900">
                                    {product.category?.name} &gt; {product.subCategory?.name}
                                </span>
                            </div>
                            <div>
                                <span className="text-gray-500">Vendor:</span>
                                <span className="ml-2 text-gray-900">
                                    {product.user?.businessName}
                                </span>
                            </div>
                            <div>
                                <span className="text-gray-500">Status:</span>
                                <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                    ${product.status === 'active' ? 'bg-green-100 text-green-800' : 
                                      product.status === 'inactive' ? 'bg-red-100 text-red-800' : 
                                      'bg-yellow-100 text-yellow-800'}`}>
                                    {product.status}
                                </span>
                            </div>
                            <div>
                                <span className="text-gray-500">Weight:</span>
                                <span className="ml-2 text-gray-900">{product.weight} kg</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Tabs */}
            <ProductTabs 
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                product={product}
                reviewsSection={reviewsSection}
            />

            {/* Similar Products */}
            <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Products</h2>
                <div className="bg-gray-100 p-12 rounded-lg text-center">
                    <p className="text-gray-500">Similar products based on {product.category?.name} &gt; {product.subCategory?.name} will appear here</p>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;