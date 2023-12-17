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

export interface ProductsExtended extends Products {
  price: number;
  optionValue: {
    value: string;
    unit: string;
  };
  SKU: string;
  quantity: number;
  productVariants: {
    id: number;
    price: number;
    optionValue: {
      value: string;
      unit: string;
    };
    SKU: string;
    quantity: number;
    status: ProductStatus;
    image: string;
  }[];
  orderItems: {
    length: any;
    id: number;
    quantity: number;
  };
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
      productStatus: (productStatus || 'PUBLISHED') as any,
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
      orderItems: {
        include: {
          productVariant: {
            include: {
              optionValue: true,
            },
          },
        },
      },
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
      productStatus: (productStatus || 'PUBLISHED') as any,
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

export const createProduct = async ({ data, categorySlug, productImages, productVariantsImages, tagIds }: any) => {
  const category = await getCategoryBySlug(categorySlug);
  data.categoryId = category?.id;
  data.slug = slugify(data.title);
  data.tagIds = tagIds;

  if (data.cover && data.cover.length > 0) {
    const uploadedCover = (await cloudinary.v2.uploader.upload(
      data.cover,
      { public_id: `products/${categorySlug}/${data.slug}/${data.slug}_cover`, overwrite: true },
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

  console.log('productImages: ', productImages.length);
  const uploadedImages = await Promise.all(
    productImages
      .filter((image: any) => image !== '')
      .map(async (image: any) => {
        const uploadedImage = (await cloudinary.v2.uploader.upload(
          image,
          { folder: `products/${categorySlug}/${data.slug}` },
          function (error, result) {
            // console.log('uploadedImage: ', result);
            console.log('image uploaded');
            if (error) {
              console.log('error: ', error);
            }
          }
        )) as UploadedImage;
        return uploadedImage;
      })
  );
  console.log('uploadedImages: ', uploadedImages);

  // console.log('uploadedVariantsImages: ', productVariantsImages);
  const uploadedVariantsImages = await Promise.all(
    productVariantsImages.map(async (imageSet: any) => {
      return await Promise.all(
        imageSet.images.map(async (image: any) => {
          // console.log('set: ', set);
          const uploadedImage = await cloudinary.v2.uploader.upload(
            image,
            { folder: `products/${categorySlug}/${data.slug}` },
            function (error, result) {
              // console.log('uploadedImage: ', result);
              console.log('image uploaded');
              if (error) {
                console.log('error: ', error);
              }
            }
          );
          uploadedImage.productVariantId = imageSet.id;
          return uploadedImage;
        })
      );
    })
  );

  console.log('uploadedVariantsImages: ', uploadedVariantsImages);

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
};

export const updateProduct = async ({
  data,
  productId,
  categorySlug,
  coverPublicId,
  productImages,
  productVariantsImages,
  tagIds,
}: any) => {
  data.slug = slugify(data.title);
  data.tagIds = tagIds;
  data.updatedAt = new Date();

  const productVariants = data.productVariants;
  delete data.productVariants;

  coverPublicId &&
    (await cloudinary.api.delete_resources_by_prefix(
      coverPublicId.slice(0, coverPublicId.lastIndexOf('/')),
      (result: any) => {
        console.log(result);
      }
    ));

  if (data.cover && data.cover.length > 0) {
    const uploadedCover = (await cloudinary.v2.uploader.upload(
      data.cover,
      { public_id: `products/${categorySlug}/${data.slug}/${data.slug}_cover`, overwrite: true },
      function (error, result) {
        // console.log('uploadedCover: ', result);
        console.log('cover uploaded');

        if (error) {
          console.log(error);
        }
      }
    )) as UploadedImage;

    data.cover = uploadedCover.secure_url || uploadedCover.url;
    coverPublicId = uploadedCover.public_id;
  }
  console.log('productImages: ', productImages.length);
  const uploadedImages =
    (productImages.filter((image: any) => image !== '').length > 0 &&
      (await Promise.all(
        productImages
          .filter((image: any) => image !== '')
          .map(async (image: any) => {
            const uploadedImage = (await cloudinary.v2.uploader.upload(
              image,
              { folder: `products/${categorySlug}/${data.slug}` },
              function (error, result) {
                // console.log('uploadedImage: ', result);
                console.log('image uploaded');
                if (error) {
                  console.log('error: ', error);
                }
              }
            )) as UploadedImage;
            return uploadedImage;
          })
      ))) ||
    [];
  console.log('uploadedImages: ', uploadedImages);

  console.log('productVariantsImages: ', productVariantsImages);
  const uploadedVariantsImages =
    productVariantsImages &&
    (await Promise.all(
      productVariantsImages.map(async (imageSet: any) => {
        return await Promise.all(
          imageSet.images.map(async (image: any) => {
            // console.log('set: ', set);
            const uploadedImage = await cloudinary.v2.uploader.upload(
              image,
              { folder: `products/${categorySlug}/${data.slug}` },
              function (error, result) {
                // console.log('uploadedImage: ', result);
                console.log('image uploaded');
                if (error) {
                  console.log('error: ', error);
                }
              }
            );
            uploadedImage.productVariantId = imageSet.id;
            return uploadedImage;
          })
        );
      }) || []
    ));

  console.log('uploadedVariantsImages: ', uploadedVariantsImages.flat(1));

  // if (coverPublicId) {
  //   await cloudinary.v2.uploader.destroy(coverPublicId);
  // }

  const updateImages =
    uploadedImages.filter((image: any) => image !== null).length > 0 &&
    (await prisma.$transaction([
      prisma.productImages.deleteMany({
        where: {
          productId,
        },
      }),
      prisma.productImages.createMany({
        data: uploadedImages.map(image => {
          return {
            productId,
            imageUrl: image.secure_url || image.url,
            publicId: image.public_id,
            assetId: image.asset_id,
            folder: image.folder,
          };
        }),
      }),
    ]));
  console.log('updateImages: ', updateImages);

  invariant(updateImages, 'Unable to update images');

  const updateVariantsImages =
    uploadedVariantsImages &&
    (await prisma.$transaction([
      prisma.productImages.deleteMany({
        where: {
          productVariantId: {
            in: productVariants.map((variant: any) => variant.id),
          },
        },
      }),
      prisma.productImages.createMany({
        data: uploadedVariantsImages.flat(1).map(image => {
          return {
            productVariantId: image.productVariantId,
            imageUrl: image.secure_url || image.url,
            publicId: image.public_id,
            assetId: image.asset_id,
            folder: image.folder,
          };
        }),
      }),
    ]));

  invariant(updateVariantsImages, 'Unable to update variants images');

  const deletedProductVariants = await prisma.productVariants.deleteMany({
    where: {
      productId,
      id: {
        notIn: productVariants.map((variant: any) => variant.id),
      },
    },
  });

  invariant(deletedProductVariants, 'Unable to delete product variants');

  const createProductVariants = await prisma.productVariants.createMany({
    data: productVariants
      .filter((variant: any) => !variant.id)
      .map((variant: any) => {
        return {
          productId,
          ...variant,
        };
      }),
    skipDuplicates: true,
  });

  invariant(createProductVariants, 'Unable to create product variants');

  const updatedProductVariants = productVariants
    .filter((variant: any) => variant.id)
    .map(
      async (variant: any) =>
        await prisma.productVariants.update({
          where: {
            id: variant.id,
          },
          data: {
            ...variant,
          },
        })
    );

  invariant(updatedProductVariants, 'Unable to update product variants');

  const updatedProduct = await prisma.products.update({
    where: {
      id: productId,
    },
    data: {
      ...data,
    },
  });

  invariant(updatedProduct, 'Unable to update product');
  return updatedProduct;
};

export const updateProductStatus = async ({ id, status }: { id: number; status: keyof typeof ProductStatus }) => {
  const product = await prisma.products.update({ where: { id }, data: { productStatus: status } });
  invariant(product, 'Unable to update product status');
  return product;
};

export const getProduct = async (id: number) => {
  const product = await prisma.products.findUnique({
    where: { id },
    include: {
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
      productImages: {
        select: {
          imageUrl: true,
          publicId: true,
        },
      },
      productVariants: {
        select: {
          id: true,
          name: true,
          SKU: true,
          price: true,
          quantity: true,
          optionValue: {
            select: {
              id: true,
            },
          },
          productImages: {
            select: {
              imageUrl: true,
              publicId: true,
            },
          },
          status: true,
        },
      },
    },
  });
  invariant(product, 'Unable to get product');
  // console.log('product: ', product);

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

export const getCategoryBySlug = async (slug: string) => {
  const category = await prisma.categories.findUnique({ where: { slug } });
  invariant(category, 'Unable to get category');
  return category;
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

export const getAllSorts = async () => {
  const sorts = await prisma.sorts.findMany();
  invariant(sorts, 'Unable to get all sorts');
  return sorts;
};

export const deleteProduct = async (id: number) => {
  const orderItems = await prisma.orderItems.findMany({
    where: {
      productsId: id,
    },
  });

  if (orderItems.length) {
    console.log('orderItems count: ', orderItems.length);
    return new Response('Unable to delete product with orders', {
      status: 500,
      statusText: 'Unable to delete product with orders',
    });
  }
  const product = await prisma.products.findUnique({ where: { id } });

  const deletedProduct = await prisma.products.delete({ where: { id } });
  invariant(deletedProduct, 'Unable to delete ');

  deletedProduct &&
    product?.cover_public_id &&
    (await cloudinary.api.delete_resources_by_prefix(
      product?.cover_public_id.slice(0, product?.cover_public_id.lastIndexOf('/')),
      (result: any) => {
        console.log(result);
      }
    )) &&
    (await cloudinary.v2.api.delete_folder(
      product?.cover_public_id.slice(0, product?.cover_public_id.lastIndexOf('/')),
      (result: any) => {
        console.log(result);
      }
    ));

  return deletedProduct;
};

export const changeProductStatus = async (id: number, status: keyof typeof ProductStatus) => {
  const product = await prisma.products.update({ where: { id }, data: { productStatus: status } });
  invariant(product, 'Unable to change product status');
  return product;
};

export const getImagesByProductId = async (productId: number) => {
  const productVariantsIds = await prisma.productVariants
    .findMany({
      where: {
        productId,
      },
    })
    .then(productVariants => productVariants.map(productVariant => productVariant.id));

  const productImages = await prisma.productImages.findMany({
    where: {
      OR: [
        {
          productId,
        },
        {
          productVariantId: {
            in: productVariantsIds,
          },
        },
      ],
    },
    select: {
      productId: true,
      productVariantId: true,
      imageUrl: true,
      publicId: true,
    },
  });
  invariant(productImages, 'Unable to get product images');
  return productImages;
};

// console.log('Images: ', await getImagesByProductId(1));

// cloudinary.api.delete_resources_by_prefix('products', (result: any) => {
//   console.log(result);
// });

// cloudinary.v2.api.delete_folder('products', (result: any) => {
//   console.log(result);
// });
