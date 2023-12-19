import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/custom/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';
import { Link, useFetcher } from '@remix-run/react';

import { useEffect, type FunctionComponent } from 'react';
import { ProductStatus } from '@prisma/client';
import type { ProductsExtended } from '~/services/products.server';
import { TableCell } from '~/components/ui/table';
import numeral from 'numeral';

export const ProductCell: FunctionComponent<{ product: ProductsExtended }> = ({ product }) => {
  const fetcher = useFetcher<{ ok: boolean; error?: string }>();

  const changeProductStatus = async (id: number, status: keyof typeof ProductStatus) => {
    fetcher.submit({ _action: 'updateStatus', id: id.toString(), status: status.toString() }, { method: 'post' });
  };
  const deleteProduct = async (id: number) => {
    if (confirm('Please confirm you want to delete this product.')) {
      fetcher.submit({ _action: 'delete', id: id.toString() }, { method: 'post' });
    }
  };

  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data.error) {
        alert(fetcher.data.error);
        if (product.productStatus !== 'ARCHIVED' && confirm('Move a product to the archive?'))
          changeProductStatus(product.id, 'ARCHIVED');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher.data]);

  return (
    <>
      <TableCell>
        <div className='flex items-center space-x-2'>
          <img
            className='object-cover w-16 h-16 rounded-md shrink-0'
            width={64}
            height={64}
            src={product.cover || '/static/assets/no-image.jpg'}
            alt=''
          />
          <div className='flex flex-col space-y-0.5'>
            <div className='text-sm font-bold'>{product.title}</div>
            <div className='text-xs font-normal text-secondary-500 line-clamp-1'>{product.description}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        {product.productVariants.map(variant => {
          return (
            <div key={variant.id} className='flex items-center space-x-2.5'>
              <span>{numeral(variant.price).format('$0,0.00')}</span>
              <span>/</span>
              <img src='/static/assets/icons/jar_big.svg' alt='' />
              <span className='text-xs font-normal text-secondary-500 whitespace-nowrap'>
                {variant.optionValue.value} {variant.optionValue.unit}
              </span>
            </div>
          );
        })}
      </TableCell>
      <TableCell className='grid gap-1'>
        <div className='w-0 h-0 bg-secondary-500'></div>
        {product.tags &&
          product.tags.map((tag, i) => (
            <div
              key={i}
              className={`text-xs rounded-full px-2 py-1 w-fit text-white`}
              style={{ backgroundColor: tag.color }}
            >
              {tag.name}
            </div>
          ))}
      </TableCell>
      <TableCell>
        {product.productVariants.map(variant => {
          return (
            <div key={variant.id} className='flex items-center w-full space-x-2'>
              <div className='relative h-1 rounded-full w-14 bg-secondary-100'>
                <div
                  className='absolute top-0 left-0 w-1/2 h-1 rounded-full bg-additional-green-100'
                  style={{
                    width: `${(100 * variant.quantity) / 1000}%`,
                    backgroundColor: `${
                      (100 * variant.quantity) / 1000 < 20
                        ? '#D80D00'
                        : (100 * variant.quantity) / 1000 < 50
                        ? '#E9BD66'
                        : '#A6B24F'
                    }`,
                  }}
                ></div>
              </div>
              <div>{variant.quantity}</div>
            </div>
          );
        })}
      </TableCell>
      <TableCell>
        <div
          className={`flex items-center space-x-2 ${
            fetcher.state !== 'idle' ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
          }`}
        >
          <Link
            to={`/admin/products/${product.id}/edit`}
            className='flex items-center justify-center rounded-full w-9 h-9 bg-secondary-100'
          >
            <img className='w-5 h-5' src='/static/assets/icons/pencilBrown.svg' alt=''></img>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className='flex items-center justify-center rounded-full w-9 h-9 bg-secondary-100'>
                <img className='w-5 h-5' src='/static/assets/icons/dots.svg' alt='' />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='min-w-0'>
              {Object.values(ProductStatus)
                .filter(status => status !== product.productStatus)
                .map(status => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => changeProductStatus(product.id, status)}
                    className='justify-end w-full space-x-1 cursor-pointer whitespace-nowrap focus:bg-secondary-100 text-primary-brown focus:text-primary-brown'
                  >
                    <span>→ </span>
                    <span className='capitalize'> {status.toLocaleLowerCase()}</span>
                  </DropdownMenuItem>
                ))}
              <DropdownMenuSeparator className='bg-secondary-100' />
              <DropdownMenuItem
                className={`justify-end w-full cursor-pointer whitespace-nowrap focus:bg-secondary-100 text-primary-brown focus:text-primary-brown
                ${product.orderItems.length ? 'cursor-not-allowed hover:!bg-secondary-50' : ''}`}
              >
                {product.orderItems.length ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className='opacity-50 cursor-not-allowed'>Delete</TooltipTrigger>
                      <TooltipContent>
                        <p>Unable to delete product with orders.</p>
                        <p>
                          You can move product to <b>Archived</b>
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <span onClick={() => deleteProduct(product.id)}>Delete</span>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </>
  );
};
