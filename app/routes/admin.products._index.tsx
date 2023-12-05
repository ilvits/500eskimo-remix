import { type LoaderFunctionArgs, json } from '@remix-run/node';

import { authenticator } from '~/auth/authenticator.server';

import AdminProductsLayout from '~/features/admin/AdminProductsLayout';
import { getProducts } from '~/services/products.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticator.isAuthenticated(request, {
    failureRedirect: '/auth/sign-in',
  });
  const url = new URL(request.url);
  const q = url.searchParams.get('q');
  const { status, $skip, $top, orderBy, order, categoryId, tagId } = Object.fromEntries(url.searchParams.entries());

  const { products, total, groupProducts, categories, tags } = await getProducts({
    $top: Number($top) || 10,
    $skip: Number($skip) || 0,
    productStatus: status || 'published',
    orderBy: orderBy || 'id',
    order: order || 'asc',
    categoryId: categoryId || '',
    tagId: tagId || '',
    q: q?.trim() || '',
  });

  return json({
    products,
    total,
    groupProducts,
    categories,
    tags,
    tagId,
    status,
    $skip,
    $top,
    orderBy,
    order,
    categoryId,
    q,
  });
};

export default function AdminCatalog() {
  return <AdminProductsLayout />;
}
