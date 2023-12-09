import type { ProductStatus, Products } from '@prisma/client';

import cloudinary from 'cloudinary';
import invariant from 'tiny-invariant';
import { prisma } from '~/lib/prisma.server';
import slugify from '@sindresorhus/slugify';

type UploadedImage = {
  secure_url?: string;
  url: string;
  public_id: string;
};

type GroupProducts = {
  name: string;
  count: number;
};

interface ProductsExtended extends Products {
  id: number;
  price: number;
  optionValue: {
    value: string;
    unit: string;
  };
  sku: string;
  quantity: number;
  productVariants: {
    id: number;
    price: number;
    optionValue: {
      value: string;
      unit: string;
    };
    sku: string;
    quantity: number;
  }[];
  tags: {
    id: number;
    name: string;
    color: string;
  }[];
}

export const getProducts = async ({
  q,
  productStatus,
  $top,
  $skip,
  orderBy,
  order,
  categoryId,
  tagId,
}: {
  q: string;
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
      title: {
        contains: q || undefined,
        mode: 'insensitive',
      },
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
      productVariants: {
        include: {
          optionValue: true,
        },
      },
    },
    orderBy: {
      [orderBy || 'id']: order || 'asc',
    },
    where: {
      productStatus: (productStatus || 'published') as any,
      categoryId: categoryId ? Number(categoryId) : undefined,
      title: {
        // search: q ? `_${q}` : undefined,
        contains: q || undefined,
        mode: 'insensitive',
      },
    },
  } as any;
  const groupRequest = {
    by: ['productStatus'],
    _count: true,
    orderBy: {
      productStatus: 'asc',
    },
    where: {
      categoryId: categoryId ? Number(categoryId) : undefined,
      title: {
        contains: q || undefined,
        mode: 'insensitive',
      },
    },
  } as any;

  if (tagId) {
    countRequest.where.tagIds = {
      has: tagId.toString(),
    };
    productsRequest.where.tagIds = {
      has: tagId.toString(),
    };
    groupRequest.where.tagIds = {
      has: tagId.toString(),
    };
  }

  const result = await prisma.$transaction([
    prisma.products.count(countRequest),
    prisma.products.findMany(productsRequest),
    prisma.products.groupBy(groupRequest),
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
  }) as GroupProducts[];

  invariant(result, 'Unable to get all products');
  return {
    total: result[0],
    products: result[1] as ProductsExtended[],
    groupProducts,
    categories: result[3],
    tags: result[4],
  };
};
export const createProduct = async (data: any, images: any, tagIds: any) => {
  data.slug = slugify(data.title);
  data.tagIds = tagIds;

  if (data.cover && data.cover.length > 0) {
    const uploadedCover = (await cloudinary.v2.uploader.upload(
      data.cover,
      { public_id: `products/${data.categoryId}/${data.slug}/${data.slug}_cover`, overwrite: true },
      function (error, result) {
        console.log('uploadedCover: ', result);
        if (error) {
          console.log(error);
        }
      }
    )) as UploadedImage;

    data.cover = uploadedCover.secure_url || uploadedCover.url;
    data.cover_public_id = uploadedCover.public_id;
  }

  const uploadedImages = await Promise.all(
    images
      .filter((image: any) => image !== '')
      .map(async (image: any) => {
        const uploadedImage = (await cloudinary.v2.uploader.upload(
          image,
          { folder: `products/${data.categoryId}/${data.slug}` },
          function (error, result) {
            console.log('uploadedImage: ', result);
            if (error) {
              console.log('error: ', error);
            }
          }
        )) as UploadedImage;
        return uploadedImage;
      })
  );

  const product = await prisma.products.create({
    data: {
      ...data,
      productImages: {
        create: uploadedImages.map(image => {
          return {
            imageUrl: image.secure_url || image.url,
            publicId: image.public_id,
          };
        }),
      },
      productVariants: {
        create: data.productVariants,
      },
    },
  });
  invariant(product, 'Unable to create product');
  return product;
  return;
};
export const getProduct = async (id: number) => {
  const product = await prisma.products.findUnique({ where: { id } });
  invariant(product, 'Unable to get product');
  return product;
};

export const getTotalProducts = async () => {
  const result = await prisma.products.count();
  return result;
};

export const getAllCategories = async () => {
  const categories = await prisma.categories.findMany();
  invariant(categories, 'Unable to get all categories');
  return categories;
};

export const getTotalCategories = async () => {
  const result = await prisma.categories.count();
  return result;
};

export const getAllTags = async () => {
  const tags = await prisma.tags.findMany();
  invariant(tags, 'Unable to get all tags');
  return tags;
};

export const getOptions = async () => {
  const options = await prisma.options.findMany({
    select: {
      id: true,
      name: true,
      optionValues: {
        select: {
          id: true,
          value: true,
          unit: true,
        },
        orderBy: {
          value: 'asc',
        },
      },
    },
  });
  invariant(options, 'Unable to get all options');
  return options;
};

export const deleteProduct = async (id: number) => {
  const orders = await prisma.orderItems.findMany({
    where: {
      productsId: id,
    },
  });
  if (orders.length > 0) {
    throw new Error('Cannot delete product with orders');
  }
  const product = await prisma.products.delete({ where: { id } });
  invariant(product, 'Unable to delete product');
  return product;
};

export const changeProductStatus = async (id: number, status: keyof typeof ProductStatus) => {
  const product = await prisma.products.update({ where: { id }, data: { productStatus: status } });
  invariant(product, 'Unable to change product status');
  return product;
};
