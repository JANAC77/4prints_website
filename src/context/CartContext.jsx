import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY_CART = 'customer_cart';

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CART);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cartItems));
  }, [cartItems]);

  /**
   * Helper to determine unit price and line total given product pricing tiers and quantity
   */
  const calculatePrice = (product, quantity) => {
    if (!product?.pricing || product.pricing.length === 0) {
      return { unitPrice: 0, totalPrice: 0 };
    }

    // Find closest tier <= quantity
    const sortedTiers = [...product.pricing].sort((a, b) => b.quantity - a.quantity);
    const applicableTier = sortedTiers.find((t) => quantity >= t.quantity) || sortedTiers[sortedTiers.length - 1];

    if (applicableTier.price && applicableTier.quantity) {
      // In print industry, pricing tier often defines package price for that exact tier quantity,
      // or price per package. If exact match:
      if (quantity === applicableTier.quantity) {
        return {
          unitPrice: applicableTier.price / applicableTier.quantity,
          totalPrice: applicableTier.price,
        };
      }
      const unit = applicableTier.price / applicableTier.quantity;
      return {
        unitPrice: unit,
        totalPrice: Math.round(unit * quantity),
      };
    }

    return { unitPrice: 0, totalPrice: 0 };
  };

  /**
   * Add item to cart
   */
  const addToCart = (product, quantity, selectedVariants = {}, designDetails = {}) => {
    const { unitPrice, totalPrice } = calculatePrice(product, quantity);

    const variantKey = Object.entries(selectedVariants)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}:${v}`)
      .join('|');

    const cartItemId = `${product._id}_${variantKey || 'default'}`;

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === cartItemId);
      if (existingIndex > -1) {
        const existing = prev[existingIndex];
        const newQty = existing.quantity + quantity;
        const prices = calculatePrice(product, newQty);
        const updated = [...prev];
        updated[existingIndex] = {
          ...existing,
          quantity: newQty,
          unitPrice: prices.unitPrice,
          totalPrice: prices.totalPrice,
          designDetails: { ...existing.designDetails, ...designDetails },
        };
        return updated;
      }

      return [
        ...prev,
        {
          id: cartItemId,
          productId: product._id,
          slug: product.slug,
          name: product.name,
          sku: product.sku,
          image: product.images?.[0]?.url || '',
          quantity,
          unitPrice,
          totalPrice,
          selectedVariants,
          designDetails,
          productRef: product,
        },
      ];
    });
  };

  /**
   * Remove item from cart
   */
  const removeFromCart = (cartItemId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  /**
   * Update item quantity
   */
  const updateQuantity = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          const prices = calculatePrice(item.productRef, newQty);
          return {
            ...item,
            quantity: newQty,
            unitPrice: prices.unitPrice,
            totalPrice: prices.totalPrice,
          };
        }
        return item;
      })
    );
  };

  /**
   * Clear cart
   */
  const clearCart = () => {
    setCartItems([]);
  };

  const totalItems = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.totalPrice, 0);
  }, [cartItems]);

  // 18% GST standard on commercial print
  const gstAmount = useMemo(() => Math.round(subtotal * 0.18), [subtotal]);
  const shippingFee = useMemo(() => (subtotal > 1500 || subtotal === 0 ? 0 : 99), [subtotal]);
  const grandTotal = useMemo(() => subtotal + gstAmount + shippingFee, [subtotal, gstAmount, shippingFee]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItems,
        subtotal,
        gstAmount,
        shippingFee,
        grandTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        calculatePrice,
      }}
    >
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
