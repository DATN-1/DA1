'use client';

import { useEffect, useMemo, useState } from "react";


type CartItem = {
    id: string;
    name: string;
    price: number;
    image: string[];
    quantity: number;
    totalPrice: number;
    maxStock?: number;
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
      const stock = item.maxStock ?? Infinity;

      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, stock);
        newItems = cartItems.map(p =>
          p.id === item.id
            ? {
                ...p,
                quantity: newQty,
                totalPrice: newQty * p.price
              }
            : p
        );
      } else {
        const newQty = Math.min(quantity, stock);
        newItems = [
          ...cartItems,
          {
            ...item,
            quantity: newQty,
            totalPrice: item.price * newQty
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
        
        const item = cartItems.find(i => i.id === id);
        const maxQty = item?.maxStock ?? Infinity;
        const clampedQty = Math.min(newQuantity, maxQty);

        const newItems = cartItems.map(i => 
            i.id === id 
                ? { ...i, quantity: clampedQty, totalPrice: i.price * clampedQty }
                : i
        );
        setCartItems(newItems);
        dispatchCartUpdate(newItems);
    };
    
    const handleClearCart = () => {
        setCartItems([]);
        if (typeof window !== 'undefined') {
            const key = getCartKey();
            localStorage.removeItem(key);
            window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cartItems: [] } }));
        }
    };
    
    // Hàm lấy key giỏ hàng hiện tại dựa trên thư viện người dùng
    const getCartKey = () => {
        if (typeof window === 'undefined') return 'cartItems_guest';
        try {
            const userStr = localStorage.getItem('currentUser');
            if (userStr) {
                const user = JSON.parse(userStr);
                if (user && user.id) return `cartItems_${user.id}`;
            }
        } catch {}
        return 'cartItems_guest';
    };

    // Load cart
    useEffect(() => {
        setIsClient(true);
        if (typeof window !== 'undefined') {
            const loadCurrentCart = () => {
                const key = getCartKey();
                const currentCartKey = localStorage.getItem('currentCartKey') || 'cartItems_guest';
                
                // Phát hiện chuyển đổi user (Đăng nhập / Đăng ký)
                if (key !== currentCartKey && currentCartKey === 'cartItems_guest') {
                     // Nếu từ guest -> user: Merge giỏ hàng
                     const guestCart = JSON.parse(localStorage.getItem('cartItems_guest') || '[]');
                     const userCart = JSON.parse(localStorage.getItem(key) || '[]');
                     
                     let merged = [...userCart];
                     guestCart.forEach((gItem: CartItem) => {
                         const existing = merged.find(i => i.id === gItem.id);
                         if (existing) {
                             existing.quantity += gItem.quantity;
                             if (existing.maxStock) {
                                 existing.quantity = Math.min(existing.quantity, existing.maxStock);
                             }
                             existing.totalPrice = existing.quantity * existing.price;
                         } else {
                             merged.push(gItem);
                         }
                     });
                     
                     localStorage.setItem(key, JSON.stringify(merged));
                     localStorage.setItem('cartItems_guest', '[]'); // clear guest cart
                     setCartItems(merged);
                } else {
                     // Load bình thường
                     const saved = localStorage.getItem(key);
                     if (saved) {
                         try { setCartItems(JSON.parse(saved)); } catch {}
                     } else {
                         setCartItems([]);
                     }
                }
                
                localStorage.setItem('currentCartKey', key);
            };

            loadCurrentCart();

            // Sync this instance when other instances dispatch the custom event
            const handleCartUpdateEvent = (e: any) => {
                if (e.detail?.cartItems) {
                    setCartItems(e.detail.cartItems);
                }
            };
            
            // Authentication changed: re-run logic
            const handleAuthChanged = () => {
                loadCurrentCart();
            };

            window.addEventListener('cartUpdated', handleCartUpdateEvent);
            window.addEventListener('authChanged', handleAuthChanged);
            return () => {
                window.removeEventListener('cartUpdated', handleCartUpdateEvent);
                window.removeEventListener('authChanged', handleAuthChanged);
            };
        }
    }, []);
    
    // Save cart to localStorage whenever it changes
    useEffect(() => {
        if (isClient && typeof window !== 'undefined') {
            const key = getCartKey();
            localStorage.setItem(key, JSON.stringify(cartItems));
        }
    }, [cartItems, isClient]);

    const handleClearSelectedCart = (selectedIds: string[]) => {
        const newItems = cartItems.filter(item => !selectedIds.includes(item.id));
        setCartItems(newItems);
        dispatchCartUpdate(newItems);
    };

    return {
        cartItems,
        totalAmount,
        addToCart,
        RemoveItem,
        UpdateQty,
        handleClearCart,
        handleClearSelectedCart,
    };
}