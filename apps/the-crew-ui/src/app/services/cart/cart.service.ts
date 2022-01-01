import type { Cart } from '@the-crew/common';

enum CartDetails {
  CART_ITEMS = 'cart_items',
}

/**
 * Get cart items from session storage
 * @returns cart items
 */
function getCartItems(): Cart[] {
  const value = sessionStorage.getItem(CartDetails.CART_ITEMS);
  return JSON.parse(value);
}

/**
 * Set cart items into session storage
 * @param cartItems
 */
function setCartItems(cartItems: Cart[]) {
  sessionStorage.setItem(CartDetails.CART_ITEMS, JSON.stringify(cartItems));
}

/**
 * Removes cart items object from session storage
 */
function removeCartItems() {
  sessionStorage.removeItem(CartDetails.CART_ITEMS);
}

export { getCartItems, setCartItems, removeCartItems };

export const CartSessionService = {
  getCartItems,
  setCartItems,
  removeCartItems,
};
