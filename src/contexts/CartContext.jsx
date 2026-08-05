import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import cartService from '../services/cartService';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadCart = useCallback(async () => {
    setLoading(true);
    try {
      const res = await cartService.get();
      const data = res.data?.data || res.data;
      setItems(data?.items || []);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setItems([]);
      }
    } finally {
      setLoading(false);
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
    await cartService.addItem(productId, quantity);
    await loadCart();
  }, [loadCart]);

  const updateQuantity = useCallback(async (itemId, quantity) => {
    if (quantity <= 0) {
      await cartService.removeItem(itemId);
      setItems((prev) => prev.filter((item) => item.id !== itemId));
      return;
    }
    await cartService.updateItem(itemId, quantity);
    await loadCart();
  }, [loadCart]);

  const removeItem = useCallback(async (itemId) => {
    await cartService.removeItem(itemId);
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  }, []);

  const clearCart = useCallback(async () => {
    await cartService.clear();
    setItems([]);
  }, []);

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.lineTotal ?? Number(item.unitPrice) * item.quantity),
    0
  );

  const getTotal = useCallback(() => subtotal, [subtotal]);
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
    getTotal,
    subtotal,
    getItemCount,
    refresh: loadCart,
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
