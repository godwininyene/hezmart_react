import { useEffect, useState } from "react";
import axios from "../../lib/axios";
import { useParams, Link } from "react-router-dom";
import { FiStar, FiShoppingCart, FiHeart, FiShare2 } from "react-icons/fi";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

const ProductDetails = () => {
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
            setSelectedOptions(initialOptions);
            
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

    const handleAddToCart = () => {
        // Implement add to cart logic
        console.log("Added to cart:", {
            productId: product.id,
            quantity,
            options: selectedOptions
        });
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

    const renderRatingStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        for (let i = 1; i <= 5; i++) {
            if(rating >= i){
                stars.push(<FaStar key={i} className="text-primary-light" />);
            }else{
                stars.push(<FaRegStar key={i} className="text-primary-light" />);
            }
            // if (i <= fullStars) {
            //     stars.push(<FaStar key={i} className="text-primary-light" />);
            // } else if (i === fullStars + 1 && hasHalfStar) {
            //     stars.push(<FaStarHalfAlt key={i} className="text-primary-light" />);
            // } else {
            //     stars.push(<FaRegStar key={i} className="text-primary-light" />);
            // }
        }
        
        return stars;
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
                <div className="max-w-md w-full text-center p-8 bg-white rounded-xl shadow-lg border border-gray-100 transform transition-all duration-300 hover:shadow-xl">
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

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
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
                        {product.discountPrice ? (
                            <div className="flex items-center">
                                <span className="text-3xl font-bold text-gray-900">
                                    ${product.discountPrice}
                                </span>
                                <span className="ml-2 text-lg text-gray-500 line-through">
                                    ${product.price}
                                </span>
                                <span className="ml-2 bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded">
                                    {Math.round((1 - product.discountPrice / product.price) * 100)}% OFF
                                </span>
                            </div>
                        ) : (
                            <span className="text-3xl font-bold text-gray-900">
                                ${product.price}
                            </span>
                        )}
                    </div>

                    {/* <div className="mb-6">
                        <p className="text-gray-700">{product.description}</p>
                    </div> */}

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
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md flex items-center justify-center gap-2"
                            >
                                <FiShoppingCart /> Add to Cart
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
            <div className="mb-8">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab('description')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'description' 
                                ? 'border-blue-500 text-blue-600' 
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            Description
                        </button>
                        <button
                            onClick={() => setActiveTab('specifications')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'specifications' 
                                ? 'border-blue-500 text-blue-600' 
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            Specifications
                        </button>
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'reviews' 
                                ? 'border-blue-500 text-blue-600' 
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            Reviews ({product.ratingsQuantity})
                        </button>
                    </nav>
                </div>

                <div className="py-6">
                    {activeTab === 'description' && (
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Product Description</h3>
                            <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
                        </div>
                    )}

                    {activeTab === 'specifications' && (
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Specifications</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-2">General</h4>
                                    <ul className="space-y-2">
                                        <li className="flex justify-between">
                                            <span className="text-gray-500">Category</span>
                                            <span className="text-gray-900">{product.category?.name}</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span className="text-gray-500">Subcategory</span>
                                            <span className="text-gray-900">{product.subCategory?.name}</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span className="text-gray-500">Weight</span>
                                            <span className="text-gray-900">{product.weight} kg</span>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-2">Other</h4>
                                    <ul className="space-y-2">
                                        <li className="flex justify-between">
                                            <span className="text-gray-500">Taxable</span>
                                            <span className="text-gray-900">{product.taxable ? 'Yes' : 'No'}</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span className="text-gray-500">Digital Product</span>
                                            <span className="text-gray-900">{product.isDigital ? 'Yes' : 'No'}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <div>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-1">Customer Reviews</h3>
                                    <div className="flex items-center">
                                        <div className="flex mr-2">
                                            {renderRatingStars(product.ratingsAverage)}
                                        </div>
                                        <span className="text-sm text-gray-500">
                                            {product.ratingsAverage.toFixed(1)} out of 5 ({product.ratingsQuantity} reviews)
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Review Form */}
                            {user && (
                                <div className="bg-gray-50 p-6 rounded-lg mb-8">
                                    <h4 className="text-lg font-medium text-gray-900 mb-4">Write a Review</h4>
                                    <form onSubmit={handleSubmitReview}>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Rating
                                            </label>
                                            <div className="flex">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => setNewReview({...newReview, rating: star})}
                                                        className="text-2xl mr-1"
                                                    >
                                                        {star <= newReview.rating ? (
                                                            <FaStar className="text-primary-light" />
                                                        ) : (
                                                            <FaRegStar className="text-primary-light" />
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                                                Review
                                            </label>
                                            <textarea
                                                id="comment"
                                                rows="4"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                value={newReview.comment}
                                                onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                                                required
                                            ></textarea>
                                        </div>
                                        <button
                                            type="submit"
                                            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
                                        >
                                            Submit Review
                                        </button>
                                    </form>
                                </div>
                            )}

                            {/* Reviews List */}
                            <div className="space-y-6">
                                {reviews.length > 0 ? (
                                    reviews.map(review => (
                                        <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                                            <div className="flex items-start">
                                                <img 
                                                    src={review.user.avatar} 
                                                    alt={review.user.name} 
                                                    className="h-10 w-10 rounded-full mr-4"
                                                />
                                                <div>
                                                    <div className="flex items-center mb-1">
                                                        <h4 className="font-medium text-gray-900 mr-2">{review.user.name}</h4>
                                                        <div className="flex">
                                                            {renderRatingStars(review.rating)}
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-gray-500 mb-2">{review.date}</p>
                                                    <p className="text-gray-700">{review.comment}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Similar Products */}
            <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Products</h2>
                {/* You would implement similar products carousel here */}
                <div className="bg-gray-100 p-12 rounded-lg text-center">
                    <p className="text-gray-500">Similar products based on {product.category?.name} &gt; {product.subCategory?.name} will appear here</p>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;