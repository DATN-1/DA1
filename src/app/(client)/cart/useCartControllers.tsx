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
    const [isClient, setIsClient] = useState(false);
    
    const calculateTotal = () => {
        const total = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
        setTotalAmount(total);
    };

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
    });
  };
    
    const RemoveItem = (id: string) => {
        setCartItems(prevItems => {
            const newItems = prevItems.filter(item => item.id !== id);
            dispatchCartUpdate(newItems);
            return newItems;
        });
    };
    
    const UpdateQty = (id: string, newQuantity: number) => {
        if (newQuantity <= 0) {
            RemoveItem(id);
            return;
        }
        
        setCartItems(prevItems => {
            const newItems = prevItems.map(item => 
                item.id === id 
                    ? { ...item, quantity: newQuantity, totalPrice: item.price * newQuantity }
                    : item
            );
            dispatchCartUpdate(newItems);
            return newItems;
        });
    };
    
    const handleClearCart = () => {
        setCartItems([]);
        setTotalAmount(0);
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

    return {
        cartItems,
        totalAmount,
        addToCart,
        RemoveItem,
        UpdateQty,
        handleClearCart,
    };
}