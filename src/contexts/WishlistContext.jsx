import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import wishlistService from '../services/wishlistService';
import { useToast } from './ToastContext';
import { unwrap } from '../services/api';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadWishlist = useCallback(async () => {
    if (!isAuthenticated) { setItems([]); return; }
    setLoading(true);
    try {
      const res = await wishlistService.getAll();
      setItems(unwrap(res) || []);
    } catch {
      // Silently fail — may be 401
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => { loadWishlist(); }, [loadWishlist]);

  const toggleWishlist = useCallback(async (productId) => {
    if (!isAuthenticated) {
      toast.error('Please log in to use the wishlist');
      return;
    }
    const isCurrentlyWishlisted = items.some((w) => w.productId === productId || w.id === productId);
    try {
      if (isCurrentlyWishlisted) {
        await wishlistService.remove(productId);
        setItems((prev) => prev.filter((w) => w.productId !== productId && w.id !== productId));
        toast.info('Removed from wishlist');
      } else {
        await wishlistService.add(productId);
        await loadWishlist();
        toast.success('Added to wishlist');
      }
    } catch {
      toast.error('Failed to update wishlist');
    }
  }, [items, isAuthenticated, loadWishlist, toast]);

  const isWishlisted = useCallback(
    (productId) => items.some((w) => w.productId === productId || w.id === productId),
    [items]
  );

  return (
    <WishlistContext.Provider value={{ items, loading, toggleWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within a WishlistProvider');
  return ctx;
}
