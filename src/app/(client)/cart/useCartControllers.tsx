'use client';

import { useEffect, useMemo, useState } from "react";


type CartItem = {
    id: string;
    name: string;
    price: number;
    image: string[];
    quantity: number;
    totalPrice: number;
    variant?: {
        id: number;
        size: string;
        price: number;
        sku: string;
    };
}



export default function useCartControllers() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isClient, setIsClient] = useState(false);
    
    const totalAmount = useMemo(() => {
        return cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
    }, [cartItems]);

    const dispatchCartUpdate = (newItems: CartItem[]) => {
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cartItems: newItems } }));
        }
    };



    const addToCart = (item: Omit<CartItem, 'quantity' | 'totalPrice'>, quantity: number = 1) => {
      const existing = cartItems.find(p => p.id === item.id);
      let newItems;

      if (existing) {
        newItems = cartItems.map(p =>
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
          ...cartItems,
          {
            ...item,
            quantity: quantity,
            totalPrice: item.price * quantity
          }
        ];
      }
      
      setCartItems(newItems);
      dispatchCartUpdate(newItems);
  };
    
    const RemoveItem = (id: string) => {
        const newItems = cartItems.filter(item => item.id !== id);
        setCartItems(newItems);
        dispatchCartUpdate(newItems);
    };
    
    const UpdateQty = (id: string, newQuantity: number) => {
        if (newQuantity <= 0) {
            RemoveItem(id);
            return;
        }
        
        const newItems = cartItems.map(item => 
            item.id === id 
                ? { ...item, quantity: newQuantity, totalPrice: item.price * newQuantity }
                : item
        );
        setCartItems(newItems);
        dispatchCartUpdate(newItems);
    };
    
    const handleClearCart = () => {
        setCartItems([]);
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
                    const parsedCart = JSON.parse(savedCart);
                    setCartItems(parsedCart);
                } catch (error) {
                    console.error('Error loading cart from localStorage:', error);
                }
            }

            // Sync this instance when other instances dispatch the custom event
            const handleCartUpdateEvent = (e: any) => {
                if (e.detail?.cartItems) {
                    setCartItems(e.detail.cartItems);
                }
            };
            window.addEventListener('cartUpdated', handleCartUpdateEvent);
            return () => {
                window.removeEventListener('cartUpdated', handleCartUpdateEvent);
            };
        }
    }, []);
    
    // Save cart to localStorage whenever it changes
    useEffect(() => {
        if (isClient && typeof window !== 'undefined') {
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
        }
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