export interface IProduct {
  productSize: number
  backType: string
  size: string
  _id: string
  sku: string
  title: string
  parent: string
  children: string
  tags: string[]
  image: string
  originalPrice: number
  price: number
  discount?: number
  relatedImages: string[]
  description: string
  orderQuantity: number
  brand: {
    name: string
    id: string
  }
  category: {
    name: string
    id: string
  }
  unit: string
  quantity: number
  colors: string[]
  type?: string
  itemInfo?: string
  status: string
}

export interface ProductResponse {
  success: boolean
  data: IProduct[]
}

// IAddProduct
export interface IAddProduct {
  tags: string[] | undefined
  sku: string
  title: string
  parent: string
  children: string
  // tags: string[];
  image: string
  originalPrice: number
  price: number
  discount?: number
  // relatedImages: string[];
  backType: { name: string; price: number; image: string }[]
  description: string
  // brand: {
  //   name:string;
  //   id:string;
  // };
  category: {
    name: string
    id: string
  }
  unit: string
  quantity: number
  // colors: string[];
  sizes: { name: string; price: number; productSize: string }[]
  type?: string
  itemInfo?: string
  status?: string
}
