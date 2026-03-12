'use client';

import { useEffect, useRef, useState } from "react";


type CartItem = {
    id: string;
    name: string;
    price: number;
    image: string[];
    quantity: number;
    totalPrice: number;
}



export default function useCartControllers() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [totalAmount, setTotalAmount] = useState(0);
<<<<<<< HEAD
    const [isClient, setIsClient] = useState(false);
=======
>>>>>>> 1e602eb8ac2e589c7f831c8f4b2e4866074d80f5
    
    const calculateTotal = () => {
        const total = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
        setTotalAmount(total);
    };

<<<<<<< HEAD
    const dispatchCartUpdate = (newItems: CartItem[]) => {
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cartItems: newItems } }));
        }
    };



    const addToCart = (item: Omit<CartItem, 'quantity' | 'totalPrice'>, quantity: number = 1) => {
    setCartItems(prevItems => {
      const existing = prevItems.find(p => p.id === item.id);
      let newItems;

      if (existing) {
        newItems = prevItems.map(p =>
          p.id === item.id
            ? {
                ...p,
                quantity: p.quantity + quantity,
                totalPrice: (p.quantity + quantity) * p.price
              }
            : p
        );
      } else {
        newItems = [
          ...prevItems,
          {
            ...item,
            quantity: quantity,
            totalPrice: item.price * quantity
          }
        ];
      }
      
      // Dispatch custom event to notify other components
      dispatchCartUpdate(newItems);
      
      return newItems;
=======
    const addToCart = (item: Omit<CartItem, 'quantity' | 'totalPrice'>) => {
    setCartItems(prevItems => {
      const existing = prevItems.find(p => p.id === item.id);

      if (existing) {
        return prevItems.map(p =>
          p.id === item.id
            ? {
                ...p,
                quantity: p.quantity + 1,
                totalPrice: (p.quantity + 1) * p.price
              }
            : p
        );
      }

      return [
        ...prevItems,
        {
          ...item,
          quantity: 1,
          totalPrice: item.price
        }
      ];
>>>>>>> 1e602eb8ac2e589c7f831c8f4b2e4866074d80f5
    });
  };
    
    const RemoveItem = (id: string) => {
<<<<<<< HEAD
        setCartItems(prevItems => {
            const newItems = prevItems.filter(item => item.id !== id);
            dispatchCartUpdate(newItems);
            return newItems;
        });
=======
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
>>>>>>> 1e602eb8ac2e589c7f831c8f4b2e4866074d80f5
    };
    
    const UpdateQty = (id: string, newQuantity: number) => {
        if (newQuantity <= 0) {
            RemoveItem(id);
            return;
        }
        
<<<<<<< HEAD
        setCartItems(prevItems => {
            const newItems = prevItems.map(item => 
                item.id === id 
                    ? { ...item, quantity: newQuantity, totalPrice: item.price * newQuantity }
                    : item
            );
            dispatchCartUpdate(newItems);
            return newItems;
        });
=======
        setCartItems(prevItems => 
            prevItems.map(item => 
                item.id === id 
                    ? { ...item, quantity: newQuantity, totalPrice: item.price * newQuantity }
                    : item
            )
        );
>>>>>>> 1e602eb8ac2e589c7f831c8f4b2e4866074d80f5
    };
    
    const handleClearCart = () => {
        setCartItems([]);
        setTotalAmount(0);
<<<<<<< HEAD
        if (typeof window !== 'undefined') {
            localStorage.removeItem('cartItems');
            window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cartItems: [] } }));
        }
    };
    
    // Load cart from localStorage on mount
    useEffect(() => {
        setIsClient(true);
        if (typeof window !== 'undefined') {
            const savedCart = localStorage.getItem('cartItems');
            if (savedCart) {
                try {
                    setCartItems(JSON.parse(savedCart));
                } catch (error) {
                    console.error('Error loading cart from localStorage:', error);
                }
            }
        }
    }, []);
    
    // Save cart to localStorage whenever it changes
    useEffect(() => {
        if (isClient && typeof window !== 'undefined') {
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
        }
        calculateTotal();
    }, [cartItems, isClient]);
=======
    };
    
    useEffect(() => {
        calculateTotal();
    }, [cartItems]);
>>>>>>> 1e602eb8ac2e589c7f831c8f4b2e4866074d80f5

    return {
        cartItems,
        totalAmount,
        addToCart,
        RemoveItem,
        UpdateQty,
        handleClearCart,
    };
}