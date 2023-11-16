import { Link, useLoaderData } from '@remix-run/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';

import type { loader } from '~/routes/admin.products._index';

export default function AdminProductsLayout() {
  const { products } = useLoaderData<typeof loader>();

  return (
    <div>
      <div className='flex justify-between items-start'>
        <h1 className='text-5xl mb-4'>Products</h1>
        <Link to='/admin/products/new' className='text-green-900 text-xl font-bold'>
          add new product
        </Link>
      </div>
      <section id='last_orders' className='mr-12 rounded-xl border border-[#F8E9CC]'>
        <Table>
          <TableHeader>
            <TableRow className='hover:bg-[#FFFBF2] bg-[#FFFBF2] [&>th]:text-[#A59280] [&>th]:font-semibold border-[#F8E9CC]'>
              <TableHead className='w-16 rounded-tl-xl'>D</TableHead>
              <TableHead className=''>Product</TableHead>
              <TableHead className=''>Price</TableHead>
              <TableHead className=''>Tag</TableHead>
              <TableHead className=''>Stock</TableHead>
              <TableHead className='rounded-tr-xl text-center'></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map(product => (
              <TableRow key={product.id} className='border-[#F8E9CC] hover:bg-[#fffdf8]'>
                <TableCell className='w-10'>D</TableCell>
                <TableCell>
                  <div className='flex space-x-2 items-center'>
                    <img className='w-16 h-16 rounded-md' src={product.image} alt='' />
                    <div className='flex flex-col space-y-0.5'>
                      <div className='text-sm font-bold'>{product.title}</div>
                      <div className='text-xs font-normal text-[#A59280] line-clamp-1'>{product.description}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className='flex items-center space-x-2.5'>
                    <span>${product.price}</span>
                    <span>/</span>
                    <img src='/static/assets/icons/jar_big.svg' alt='' />
                    <span className='text-xs font-normal text-[#A59280] whitespace-nowrap'>250 g</span>
                  </div>
                  <div className='flex items-center space-x-2.5'>
                    <span>${product.price}</span>
                    <span>/</span>
                    <img src='/static/assets/icons/jar_big.svg' alt='' />
                    <span className='text-xs font-normal text-[#A59280] whitespace-nowrap'>250 g</span>
                  </div>
                </TableCell>
                <TableCell className='grid grid-rows-2 grid-flow-col gap-1'>
                  {product.tags &&
                    product.tags.map(tag => (
                      <div key={tag} className='text-xs rounded-full bg-[#A59280] px-2 py-1 w-fit text-white'>
                        {tag}
                      </div>
                    ))}
                </TableCell>
                <TableCell className=''>
                  <div className='flex items-center w-full space-x-2'>
                    <div className='h-1 w-14 bg-[#F8E9CC] relative rounded-full'>
                      <div
                        className='h-1 bg-[#A6B24F] absolute top-0 left-0 w-1/2 rounded-full'
                        // style={{ width: `${product.stock}%` }}
                      ></div>
                    </div>
                    <div>{product.stock}</div>
                  </div>
                  <div className='flex items-center w-full space-x-2'>
                    <div className='h-1 w-14 bg-[#F8E9CC] relative rounded-full'>
                      <div
                        className='h-1 bg-[#D80D00] absolute top-0 left-0 w-1/12 rounded-full'
                        // style={{ width: `${product.stock}%` }}
                      ></div>
                    </div>
                    <div>{product.stock}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className='flex items-center space-x-2'>
                    <button className='w-9 h-9 rounded-full bg-[#F8E9CC] flex justify-center items-center'>
                      <img className='w-5 h-5' src='/static/assets/icons/pencil.svg' alt=''></img>
                    </button>
                    <button className='w-9 h-9 rounded-full bg-[#F8E9CC] flex justify-center items-center'>
                      <img className='w-5 h-5' src='/static/assets/icons/dots.svg' alt=''></img>
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}
