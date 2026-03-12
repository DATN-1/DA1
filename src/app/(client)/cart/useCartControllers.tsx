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
    
    const calculateTotal = () => {
        const total = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
        setTotalAmount(total);
    };

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
    });
  };
    
    const RemoveItem = (id: string) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    };
    
    const UpdateQty = (id: string, newQuantity: number) => {
        if (newQuantity <= 0) {
            RemoveItem(id);
            return;
        }
        
        setCartItems(prevItems => 
            prevItems.map(item => 
                item.id === id 
                    ? { ...item, quantity: newQuantity, totalPrice: item.price * newQuantity }
                    : item
            )
        );
    };
    
    const handleClearCart = () => {
        setCartItems([]);
        setTotalAmount(0);
    };
    
    useEffect(() => {
        calculateTotal();
    }, [cartItems]);

    return {
        cartItems,
        totalAmount,
        addToCart,
        RemoveItem,
        UpdateQty,
        handleClearCart,
    };
}