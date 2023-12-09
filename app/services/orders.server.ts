import invariant from 'tiny-invariant';
import { prisma } from '~/lib/prisma.server';

export const getAllOrdersCount = async () => {
  const result = await prisma.orders.count();
  return result;
};

export const getAllOrders = async (status: string, orderBy: string, order: string, $top: string, $skip: string) => {
  const result = await prisma.$transaction([
    prisma.orders.findMany({
      include: {
        _count: {
          select: {
            orderItems: true,
          },
        },
        customers: {
          select: {
            username: true,
            email: true,
          },
        },
        orderItems: {
          include: {
            productVariant: {
              include: {
                product: true,
              },
            },
          },
        },
      },
      where: {
        status:
          status === 'all'
            ? {
                not: '',
              }
            : status === 'active'
            ? {
                not: 'closed',
              }
            : status,
      },
      orderBy: [
        {
          [orderBy ? orderBy : 'createdAt']: order ? order : 'desc',
        },
      ],
      skip: $skip ? Number($skip) : 0,
      take: $top ? Number($top) : 10,
    }),
    prisma.orders.groupBy({
      by: ['status'],
      _count: true,
      orderBy: {
        status: 'asc',
      },
    }),
    prisma.orders.count({
      where: {
        status:
          status === 'all'
            ? {
                not: '',
              }
            : status === 'active'
            ? {
                not: 'closed',
              }
            : status,
      },
    }),
  ]);
  // console.log('result: ', result);
  const groupOrders = result[1].map(group => {
    return {
      status: group.status,
      count: group._count,
    };
  });
  invariant(result, 'Unable to get all orders');
  return { orders: result[0], groupOrders, total: result[2] };
};

export const getOrders = async (limit = 10) => {
  const result = await prisma.orders.findMany({
    include: {
      _count: {
        select: {
          orderItems: true,
        },
      },
      customers: {
        select: {
          username: true,
          email: true,
        },
      },
      orderItems: {
        include: {
          productVariant: {
            include: {
              product: true,
            },
          },
        },
      },
    },
    orderBy: [
      {
        createdAt: 'desc',
      },
    ],
    take: limit,
  });
  // console.log('result: ', result[0]);

  invariant(result, 'Unable to get orders');
  return result;
};

export const getAllOrdersTotal = async () => {
  const result = await prisma.orders.aggregate({
    _sum: {
      total: true,
    },
  });

  invariant(result, 'Unable to get all orders');
  return result._sum.total;
};

export const getAllOrdersOnlyTotalsByDateRange = async (startDate: Date, endDate: Date) => {
  const result = await prisma.orders.findMany({
    select: {
      total: true,
      createdAt: true,
    },
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: [
      {
        createdAt: 'desc',
      },
    ],
  });
  // console.log('result: ', result.length);

  invariant(result, 'Unable to get all orders');
  return result;
};

export const getOrdersTotalByStatus = async (status: string) => {
  const result = await prisma.orders.aggregate({
    _sum: {
      total: true,
    },
    where: {
      status: status,
    },
  });

  invariant(result, 'Unable to get all orders');
  return result._sum.total;
};

export const getOrderHits = async () => {
  const data = await prisma.productVariants.findMany({
    include: {
      _count: {
        select: {
          orderItems: true,
        },
      },
      product: {
        select: {
          title: true,
          cover: true,
          category: {
            select: {
              name: true,
            },
          },
        },
      },
      optionValue: {
        select: {
          value: true,
          unit: true,
        },
      },
    },
    orderBy: {
      orderItems: {
        _count: 'desc',
      },
    },
    take: 4,
  });

  invariant(data, 'Unable to get all orders');
  return data;
};
