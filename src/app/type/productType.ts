

export type ProductType = {
    category_name: string
    brand_name: string
    id: number
    price: number
    image: string
    brand_id: number | null
    category_id: number | null
    sku: string
    name: string
    slug: string
    size: string
    description: string | null
    short_description: string | null
    stock: number
    status: 'active' | 'draft' | 'archived'
    is_featured: number
    average_rating?: number
    review_count?: number

    created_at: string
    updated_at: string
}

export type ProductCategoryType = {
    id: number
    name: string
}

export type ProductVariant = {
    id: number
    product_id: number
    size: string
    price: number
    stock: number
    sku: string
}

export type Props = {
    sort: string
    setSort: (value: string) => void
    count: number
}