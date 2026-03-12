

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
<<<<<<< HEAD
=======
}

export type Props = {
    sort: string
    setSort: (value: string) => void
    count: number
>>>>>>> 1e602eb8ac2e589c7f831c8f4b2e4866074d80f5
}