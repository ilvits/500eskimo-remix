import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { deleteProduct, getProducts, updateProductStatus } from '~/services/products.server';

import AdminProductsLayout from '~/features/admin/AdminProductsLayout';
import type { ProductStatus } from '@prisma/client';
import { authenticator } from '~/auth/authenticator.server';
import { json } from '@remix-run/node';

export type FormErrors = {
  [key: string]: boolean;
};

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
    productStatus: status || 'PUBLISHED',
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

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const _action = formData.get('_action');
  switch (_action) {
    case 'updateStatus': {
      const id = Number(formData.get('id'));
      const status = formData.get('status');
      const updatedProduct = await updateProductStatus({ id, status: status as keyof typeof ProductStatus });
      if (!updatedProduct) throw new Error('Something went wrong');
      return json({ ok: true });
    }
    case 'delete': {
      const id = Number(formData.get('id'));
      const response: Response = (await deleteProduct(id)) as Response;
      if (response.status === 500) return json({ error: response.statusText });
      return json({ ok: true });
    }
    default:
      return json({ ok: false });
  }
};

export default function AdminCatalog() {
  return <AdminProductsLayout />;
}
