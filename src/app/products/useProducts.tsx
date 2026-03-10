'use client';

import { use, useEffect, useState } from 'react';
import { ProductType } from './productType';

export default function useProducts(){
    const [products, setProducts] = useState<ProductType[]>([]);
    const [sort, setSort] = useState("popular");

    useEffect(() => {
        console.log("sort changed: ", sort);
        fetch(`/api/products?sort=${sort}`)
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.error(err));
    }, [sort]);
    return {
        products,
        sort,
        setSort
    };

}

