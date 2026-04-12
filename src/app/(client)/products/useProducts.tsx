'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCategoryType, ProductType } from '@/app/type/productType';

export default function useProducts(){
    const searchParams = useSearchParams();
    const [products, setProducts] = useState<ProductType[]>([]);
    const [categories, setCategories] = useState<ProductCategoryType[]>([]);
    const [sort, setSort] = useState("popular");
    const [page, setpage] = useState(1);
    const [search, setSearch] = useState("");
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
    const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
    const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [Loading, setLoading] = useState(false);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        setSearch(searchParams.get("search") || "");
        const selectedFromUrl = (searchParams.get("categories") || "")
            .split(",")
            .map((value) => Number(value.trim()))
            .filter((value) => Number.isInteger(value) && value > 0);
        setSelectedCategoryIds(selectedFromUrl);
        setIsReady(true);
    }, [searchParams]);

    useEffect(() => {
        setpage(1);
    }, [search, selectedCategoryIds, selectedPriceRanges, selectedRatings]);

    useEffect(() => {
        if (!isReady) {
            return;
        }
        setLoading(true);
        const minimumRating = selectedRatings.includes(4) ? 4 : selectedRatings.includes(5) ? 5 : 0;
        const categoriesQuery = selectedCategoryIds.join(",");
        const pricesQuery = selectedPriceRanges.join(",");

        console.log("Fetching products - sort: ", sort, " page: ", page, " search: ", search);

        fetch(`/api/products?sort=${encodeURIComponent(sort)}&page=${page}&search=${encodeURIComponent(search)}&categories=${encodeURIComponent(categoriesQuery)}&prices=${encodeURIComponent(pricesQuery)}&minRating=${minimumRating}`)
            .then(res => {
                if(!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then(data => {
                setProducts(data.products || []);
                setCategories(data.categories || []);
                setTotal(data.total || 0);
                setTotalPages(data.totalPages || 0);
            })
            .catch(err => {
                console.error("Fetch error: ", err);
                setProducts([]);
                setCategories([]);
                setTotal(0);
                setTotalPages(0);
            })
            .finally(() => setLoading(false));

            }, [sort, page, search, selectedCategoryIds, selectedPriceRanges, selectedRatings, isReady]);

    const toggleCategory = (categoryId: number) => {
        setSelectedCategoryIds((current) =>
            current.includes(categoryId)
                ? current.filter((item) => item !== categoryId)
                : [...current, categoryId]
        );
    };

    const togglePriceRange = (priceRange: string) => {
        setSelectedPriceRanges((current) =>
            current.includes(priceRange)
                ? current.filter((item) => item !== priceRange)
                : [...current, priceRange]
        );
    };

    const toggleRating = (rating: number) => {
        setSelectedRatings((current) =>
            current.includes(rating)
                ? current.filter((item) => item !== rating)
                : [...current, rating]
        );
    };

    const clearFilters = () => {
        setSelectedCategoryIds([]);
        setSelectedPriceRanges([]);
        setSelectedRatings([]);
    };

    return {
        products,
        categories,
        sort,
        setSort,
        page,
        setpage,
        search,
        setSearch,
        selectedCategoryIds,
        selectedPriceRanges,
        selectedRatings,
        toggleCategory,
        togglePriceRange,
        toggleRating,
        clearFilters,
        total,
        totalPages,
        Loading
    };

}

