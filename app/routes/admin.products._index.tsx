import AdminProductsLayout from '~/features/admin/AdminProductsLayout';
import { getAllProducts } from '~/services/products.server';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

export const loader = async () => {
  const products = await getAllProducts();
  return json({ products });
};

export default function AdminCatalog() {
  const { products } = useLoaderData<typeof loader>();
  console.log('products: ', products);

  return <AdminProductsLayout />;
}
