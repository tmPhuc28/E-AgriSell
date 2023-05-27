// products.data.ts

import { Product } from '../models/product.model';

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Máy cắt cỏ',
    image: 'https://isfh.org/wp-content/uploads/2021/03/may-xoi-dat.jpg',
    description: 'Product 1 Description',
    price: 100,
  },
  {
    id: 2,
    name: 'Máy gặt lúa',
    image: 'https://isfh.org/wp-content/uploads/2021/03/may-xoi-dat.jpg',
    description: 'Product 2 Description',
    price: 200,
  },
  {
    id: 3,
    name: 'Máy phun thuốc',
    image: 'https://isfh.org/wp-content/uploads/2021/03/may-xoi-dat.jpg',
    description: 'Product 3 Description',
    price: 300,
  },
];
