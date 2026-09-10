import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";


const CartContext = createContext();


export function CartProvider({ children }) {

  // Load cart from localStorage
  const [cartItems, setCartItems] = useState(() => {

    try {

      const savedCart =
        localStorage.getItem("tastybites_cart");

      return savedCart
        ? JSON.parse(savedCart)
        : [];

    } catch (error) {

      console.error(
        "Cart loading error:",
        error
      );

      return [];
    }
  });


  // Save cart whenever cart changes
  useEffect(() => {

    localStorage.setItem(
      "tastybites_cart",
      JSON.stringify(cartItems)
    );

  }, [cartItems]);


  // ==============================
  // ADD TO CART
  // ==============================

  const addToCart = (item) => {

    setCartItems((currentItems) => {

      const existingItem =
        currentItems.find(
          (cartItem) =>
            cartItem._id === item._id
        );


      // Already exists
      if (existingItem) {

        return currentItems.map(
          (cartItem) =>

            cartItem._id === item._id
              ? {
                  ...cartItem,
                  quantity:
                    cartItem.quantity + 1,
                }
              : cartItem
        );
      }


      // New item
      return [
        ...currentItems,

        {
          ...item,
          quantity: 1,
        },
      ];
    });
  };


  // ==============================
  // REMOVE FROM CART
  // ==============================

  const removeFromCart = (id) => {

    setCartItems((currentItems) =>

      currentItems.filter(
        (item) =>
          item._id !== id
      )
    );
  };


  // ==============================
  // INCREASE QUANTITY
  // ==============================

  const increaseQuantity = (id) => {

    setCartItems((currentItems) =>

      currentItems.map((item) =>

        item._id === id
          ? {
              ...item,
              quantity:
                item.quantity + 1,
            }
          : item
      )
    );
  };


  // ==============================
  // DECREASE QUANTITY
  // ==============================

  const decreaseQuantity = (id) => {

    setCartItems((currentItems) =>

      currentItems

        .map((item) =>

          item._id === id
            ? {
                ...item,
                quantity:
                  item.quantity - 1,
              }
            : item
        )

        .filter(
          (item) =>
            item.quantity > 0
        )
    );
  };


  // ==============================
  // CLEAR CART
  // ==============================

  const clearCart = () => {

    setCartItems([]);

    localStorage.removeItem(
      "tastybites_cart"
    );
  };


  // ==============================
  // TOTAL ITEMS
  // ==============================

  const totalItems = useMemo(() => {

    return cartItems.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );

  }, [cartItems]);


  // ==============================
  // TOTAL PRICE
  // ==============================

  const totalPrice = useMemo(() => {

    return cartItems.reduce(
      (total, item) =>
        total +
        item.price *
          item.quantity,
      0
    );

  }, [cartItems]);


  // ==============================
  // PROVIDER
  // ==============================

  return (

    <CartContext.Provider
      value={{
        cartItems,

        addToCart,

        removeFromCart,

        increaseQuantity,

        decreaseQuantity,

        clearCart,

        totalItems,

        totalPrice,
      }}
    >

      {children}

    </CartContext.Provider>
  );
}


// ==============================
// USE CART
// ==============================

export function useCart() {

  return useContext(
    CartContext
  );
}