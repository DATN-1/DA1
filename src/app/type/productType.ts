

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

    created_at: string
    updated_at: string
}

export type Props = {
    sort: string
    setSort: (value: string) => void
    count: number
}