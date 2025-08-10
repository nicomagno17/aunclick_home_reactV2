export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  image: string
  category: string
  source: string
  rating: number
  reviews: number
  inStock: boolean
  discount?: number
}