import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import cartService from '../services/cartService';
import { unwrap } from '../services/api';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const pendingRef = useRef(false);

  const loadCart = useCallback(async () => {
    if (pendingRef.current) return;
    pendingRef.current = true;
    setLoading(true);
    try {
      const res = await cartService.get();
      const data = unwrap(res);
      setItems(data?.items || []);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setItems([]);
      }
    } finally {
      setLoading(false);
      pendingRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    } else {
      setItems([]);
    }
  }, [isAuthenticated, loadCart]);

  const addItem = useCallback(async (productId, quantity = 1) => {
    try {
      await cartService.addItem(productId, quantity);
      await loadCart();
      toast.success('Added to cart');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to add item to cart');
      throw new Error(e.response?.data?.message || 'Failed to add item to cart');
    }
  }, [loadCart, toast]);

  const updateQuantity = useCallback(async (itemId, quantity) => {
    try {
      if (quantity <= 0) {
        await cartService.removeItem(itemId);
        setItems((prev) => prev.filter((item) => item.id !== itemId));
        return;
      }
      await cartService.updateItem(itemId, quantity);
      await loadCart();
    } catch (e) {
      throw new Error(e.response?.data?.message || 'Failed to update quantity');
    }
  }, [loadCart]);

  const removeItem = useCallback(async (itemId) => {
    try {
      await cartService.removeItem(itemId);
      setItems((prev) => prev.filter((item) => item.id !== itemId));
      toast.info('Item removed');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to remove item');
    }
  }, [toast]);

  const clearCart = useCallback(async () => {
    try {
      await cartService.clear();
      setItems([]);
      toast.info('Cart cleared');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to clear cart');
    }
  }, [toast]);

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.lineTotal ?? Number(item.unitPrice) * item.quantity),
    0
  );

  const getItemCount = useCallback(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const value = {
    items,
    cart: items,
    loading,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    getItemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
