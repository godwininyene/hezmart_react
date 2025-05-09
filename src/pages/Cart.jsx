import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiTrash2, FiChevronLeft } from 'react-icons/fi';
import { useCart } from '../components/contexts/CartContext';
import { toast } from 'react-toastify';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, fetchCart } = useCart();

  useEffect(() => {
    fetchCart(); // Ensure cart is up-to-date when page loads
  }, []);

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    const result = await updateQuantity(productId, newQuantity);
    if (result.success) {
      toast.success('Quantity updated');
    }
  };

  const handleRemoveItem = async (productId) => {
    const result = await removeFromCart(productId);
    if (result.success) {
      toast.success('Item removed from cart');
    }
  };

  const handleClearCart = async () => {
    const result = await clearCart();
    if (result.success) {
      toast.success('Cart cleared');
    }
  };

  // Calculate cart totals
  const subtotal = cart.summary.totalCost;
  const discountTotal = cart.items.reduce((total, item) => {
    return item.product.discountPrice 
      ? total + ((item.product.price - item.product.discountPrice) * item.quantity)
      : total;
  }, 0);
  const hasDiscount = discountTotal > 0;
  const total = subtotal - discountTotal;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center mb-6">
        <Link to="/" className="flex items-center text-primary-light hover:text-primary-dark">
          <FiChevronLeft className="mr-1" /> Continue Shopping
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 ml-6">Your Shopping Cart</h1>
      </div>

      {cart.loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-dark mx-auto"></div>
        </div>
      ) : cart.error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="text-red-500">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{cart.error}</p>
            </div>
          </div>
        </div>
      ) : cart.items.length === 0 ? (
        <div className="text-center py-12">
          <FiShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Your cart is empty</h3>
          <p className="mt-1 text-gray-500">Start adding some products to your cart</p>
          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-light hover:bg-primary-dark"
            >
              Browse Products
            </Link>
          </div>
        </div>
      ) : (
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
          {/* Cart Items */}
          <div className="lg:col-span-8">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <ul className="divide-y divide-gray-200">
                {cart.items.map((item) => (
                  <li key={`${item.productId}-${JSON.stringify(item.selectedOptions)}`} className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row">
                      {/* Product Image */}
                      <div className="flex-shrink-0 w-full sm:w-32 h-32 bg-gray-200 rounded-md overflow-hidden">
                        <img
                          src={item.product.coverImage}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="mt-4 sm:mt-0 sm:ml-6 flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">
                              <Link to={`/product/${item.productId}`}>{item.product.name}</Link>
                            </h3>
                            {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                              <div className="mt-1 flex flex-wrap gap-2">
                                {Object.entries(item.selectedOptions).map(([key, value]) => (
                                  <span key={key} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    {key}: {value}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.productId)}
                            className="ml-4 text-primary-light hover:text-primary-dark cursor-pointer"
                          >
                            <FiTrash2 className="h-5 w-5" />
                          </button>
                        </div>

                        {/* Price and Quantity */}
                        <div className="mt-4 flex-1 flex items-end justify-between">
                          <div>
                            {item.product.discountPrice ? (
                              <div className="flex items-center">
                                <p className="text-lg font-medium text-primary-light">
                                  ₦{(item.product.discountPrice * item.quantity).toLocaleString()}
                                </p>
                                <p className="ml-2 text-sm text-gray-500 line-through">
                                  ₦{(item.product.price * item.quantity).toLocaleString()}
                                </p>
                              </div>
                            ) : (
                              <p className="text-lg font-medium text-primary-light">
                                ₦{(item.product.price * item.quantity).toLocaleString()}
                              </p>
                            )}
                            {item.quantity > 1 && (
                              <p className="text-sm text-gray-500">
                                ₦{item.product.discountPrice 
                                  ? item.product.discountPrice.toLocaleString() 
                                  : item.product.price.toLocaleString()} each
                              </p>
                            )}
                          </div>

                          <div className="flex items-center border border-gray-300 bg-[#F0F0F0] rounded-md">
                            <button
                              onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                              className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                              disabled={item.quantity <= 1}
                            >
                              -
                            </button>
                            <span className="px-4 py-1 text-gray-900">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                              className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Clear Cart Button */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleClearCart}
                className="text-sm text-red-600 hover:text-red-800 flex items-center cursor-pointer"
              >
                <FiTrash2 className="mr-1" /> Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary - Updated to match Figma design */}
          <div className="mt-8 lg:mt-0 lg:col-span-4">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-4">
                {/* Subtotal */}
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({cart.summary.totalItems} items)</span>
                  <span className="font-medium">₦{subtotal.toLocaleString()}</span>
                </div>

                {/* Discount (only shown if applicable) */}
                {hasDiscount && (
                  <div className="flex justify-between text-primary-light">
                    <span>Discount</span>
                    <span>-₦{discountTotal.toLocaleString()}</span>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-base font-medium text-gray-900">Delivery Fee</span>
                    <span className="text-base text-gray-500">Not included yet</span>
                  </div>
                </div>

                {/* Promo Code Input */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="Enter promo code"
                      className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button className="bg-primary-light text-white px-4 py-2 rounded-r-md text-sm font-medium hover:bg-primary-dark cursor-pointer">
                      Apply
                    </button>
                  </div>
                </div>

                {/* Total */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-gray-900">
                      ₦{total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  className="w-full bg-primary-light hover:bg-primary-dark cursor-pointer text-white py-3 px-4 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Proceed to Checkout
                </button>
              </div>
              <div className="mt-4 text-center text-sm text-gray-500">
                or{' '}
                <Link to="/" className="text-primary-light hover:text-primary-dark">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;