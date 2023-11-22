import invariant from 'tiny-invariant';
import { prisma } from '~/lib/prisma.server';
import slugify from '@sindresorhus/slugify';

export const getProducts = async ({
  productStatus,
  $top,
  $skip,
  orderBy,
  order,
  categoryId,
  tagId,
}: {
  productStatus: string;
  $top: number;
  $skip: number;
  orderBy: string;
  order: string;
  categoryId: Number | string;
  tagId: Number | string;
}) => {
  const countRequest = {
    where: {
      productStatus: (productStatus || 'published') as any,
      categoryId: categoryId ? Number(categoryId) : undefined,
    },
  } as any;

  const productsRequest = {
    take: $top || 10,
    skip: $skip || 0,
    include: {
      category: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      [orderBy || 'id']: order || 'asc',
    },
    where: {
      productStatus: (productStatus || 'published') as any,
      categoryId: categoryId ? Number(categoryId) : undefined,
    },
  } as any;

  if (tagId) {
    productsRequest.where.tagIds = {
      has: tagId.toString(),
    };
    countRequest.where.tagIds = {
      has: tagId.toString(),
    };
  }

  const result = await prisma.$transaction([
    prisma.products.count(countRequest),
    prisma.products.findMany(productsRequest),
    prisma.products.groupBy({
      by: ['productStatus'],
      _count: true,
      orderBy: {
        productStatus: 'asc',
      },
    }),
    prisma.categories.findMany(),
    prisma.tags.findMany(),
  ]);

  for (const product of result[1] as any) {
    product.tags = result[4]
      .filter(tag => product.tagIds.includes(tag.id.toString()))
      .map(tag => ({
        name: tag.name,
        color: tag.color,
      }));
  }

  const groupProducts = result[2].map(group => {
    return {
      name: group.productStatus,
      count: group._count,
    };
  });

  // console.log('**************| products.server |*********************');
  // console.log({ productStatus, groupProducts, $top, $skip, orderBy, order });
  // console.log({ ...result[1][1] });

  // console.log({ ...result });
  // console.log('**************| products.server |*********************');

  invariant(result, 'Unable to get all products');
  return { total: result[0], products: result[1], groupProducts, categories: result[3], tags: result[4] };
};

export const createProduct = async (data: any) => {
  data.slug = slugify(data.title);
  data.categoryName = '';
  const product = await prisma.products.create({ data });
  invariant(product, 'Unable to create product');
  return product;
};

export const getAllCategories = async () => {
  const categories = await prisma.categories.findMany();
  invariant(categories, 'Unable to get all categories');
  return categories;
};

export const getAllTags = async () => {
  const tags = await prisma.tags.findMany();
  invariant(tags, 'Unable to get all tags');
  return tags;
};
