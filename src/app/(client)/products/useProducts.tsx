'use client';

import { useEffect, useState } from 'react';
import { ProductType } from '../type/productType';

export default function useProducts(){
    const [products, setProducts] = useState<ProductType[]>([]);
    const [sort, setSort] = useState("popular");
    const [page, setpage] = useState(1);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [Loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        console.log("Fetching products - sort: ", sort, " page: ", page);

        fetch(`/api/products?sort=${sort}&page=${page}`)
            .then(res => {
                if(!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then(data => {
                setProducts(data.products || []);
                setTotal(data.total || 0);
                setTotalPages(data.totalPages || 0);
            })
            .catch(err => {
                console.error("Fetch error: ", err);
                setProducts([]);
            })
            .finally(() => setLoading(false));
    }, [sort, page]);
    return {
        products,
        sort,
        setSort,
        page,
        setpage,
        total,
        totalPages,
        Loading
    };

}

