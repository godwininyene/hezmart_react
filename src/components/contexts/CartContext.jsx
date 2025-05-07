import { createContext, useContext, useState, useEffect } from 'react';
import axios from '../../lib/axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [cart, setCart] = useState({
    items: [],
    summary: { totalItems: 0, totalCost: 0 },
    loading: false,
    error: null
  });
  const [cartCount, setCartCount] = useState(0); // Separate state for header count

  // Fetch cart on mount and when user changes
  useEffect(() => {
    fetchCart();
  }, []);

  // Update cartCount whenever summary.totalItems changes
  useEffect(() => {
    setCartCount(cart.summary.totalItems);
  }, [cart.summary.totalItems]);

  const fetchCart = async () => {
    try {
      setCart(prev => ({ ...prev, loading: true }));
      const response = await axios.get('api/v1/cart');
      const newCart = {
        items: response.data.data.items || [],
        summary: response.data.data.summary || { totalItems: 0, totalCost: 0 },
        loading: false,
        error: null
      };
      setCart(newCart);
      setCartCount(newCart.summary.totalItems); // Update count immediately
    } catch (error) {
      setCart(prev => ({
        ...prev,
        loading: false,
        error: error.response?.data?.message || 'Failed to fetch cart'
      }));
    }
  };

  const addToCart = async (product, quantity, options) => {
    try {
      setCart(prev => ({ ...prev, loading: true }));
      const response = await axios.post('api/v1/cart', {
        productId: product.id,
        quantity,
        options
      });

      // Optimistically update both cart and count
      setCart(prev => {
        const existingItemIndex = prev.items.findIndex(
          item => item.productId === product.id && 
                 JSON.stringify(item.selectedOptions) === JSON.stringify(options)
        );

        let newItems;
        let quantityToAdd = quantity;
        if (existingItemIndex >= 0) {
          newItems = [...prev.items];
          newItems[existingItemIndex].quantity += quantity;
        } else {
          newItems = [...prev.items, {
            ...response.data.data.item,
            product
          }];
        }

        const newSummary = {
          totalItems: prev.summary.totalItems + quantity,
          totalCost: prev.summary.totalCost + (product.price * quantity)
        };

        setCartCount(newSummary.totalItems); // Update count

        return {
          items: newItems,
          summary: newSummary,
          loading: false,
          error: null
        };
      });

      return { success: true, data: response.data };
    } catch (error) {
      setCart(prev => ({
        ...prev,
        loading: false,
        error: error.response?.data?.message || 'Failed to add item to cart'
      }));
      return { success: false, error: error.response?.data };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      setCart(prev => ({ ...prev, loading: true }));
      await axios.delete(`api/v1/cart/item/${productId}`);

      // Optimistically update both cart and count
      setCart(prev => {
        const itemToRemove = prev.items.find(item => item.productId === productId);
        if (!itemToRemove) return prev;

        const newItems = prev.items.filter(item => item.productId !== productId);
        const newSummary = {
          totalItems: prev.summary.totalItems - itemToRemove.quantity,
          totalCost: prev.summary.totalCost - (itemToRemove.product.price * itemToRemove.quantity)
        };

        setCartCount(newSummary.totalItems); // Update count

        return {
          items: newItems,
          summary: newSummary,
          loading: false,
          error: null
        };
      });

      return { success: true };
    } catch (error) {
      setCart(prev => ({
        ...prev,
        loading: false,
        error: error.response?.data?.message || 'Failed to remove item'
      }));
      return { success: false, error: error.response?.data };
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    try {
      if (newQuantity < 1) {
        return { success: false, error: { message: 'Quantity must be at least 1' } };
      }

      setCart(prev => ({ ...prev, loading: true }));
      const response = await axios.patch(`api/v1/cart/item/${productId}`, {
        quantity: newQuantity
      });

      // Optimistically update both cart and count
      setCart(prev => {
        const itemIndex = prev.items.findIndex(item => item.productId === productId);
        if (itemIndex < 0) return prev;

        const oldQuantity = prev.items[itemIndex].quantity;
        const quantityDiff = newQuantity - oldQuantity;
        const price = prev.items[itemIndex].product.price;

        const newItems = [...prev.items];
        newItems[itemIndex].quantity = newQuantity;
        const newSummary = {
          totalItems: prev.summary.totalItems + quantityDiff,
          totalCost: prev.summary.totalCost + (price * quantityDiff)
        };

        setCartCount(newSummary.totalItems); // Update count

        return {
          items: newItems,
          summary: newSummary,
          loading: false,
          error: null
        };
      });

      return { success: true, data: response.data };
    } catch (error) {
      setCart(prev => ({
        ...prev,
        loading: false,
        error: error.response?.data?.message || 'Failed to update quantity'
      }));
      return { success: false, error: error.response?.data };
    }
  };

  const clearCart = async () => {
    try {
      setCart(prev => ({ ...prev, loading: true }));
      await axios.delete('api/v1/cart/clear');

      const newCart = {
        items: [],
        summary: { totalItems: 0, totalCost: 0 },
        loading: false,
        error: null
      };
      setCart(newCart);
      setCartCount(0); // Reset count

      return { success: true };
    } catch (error) {
      setCart(prev => ({
        ...prev,
        loading: false,
        error: error.response?.data?.message || 'Failed to clear cart'
      }));
      return { success: false, error: error.response?.data };
    }
  };

  return (
    <CartContext.Provider value={{
      cart,
      cartCount, // Expose cartCount to consumers
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};