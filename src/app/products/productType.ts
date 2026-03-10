

export type ProductType = {
    id: number
    price: number
    image: string
    brand_id: number | null
    category_id: number | null

    name: string
    slug: string

    description: string | null
    short_description: string | null

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