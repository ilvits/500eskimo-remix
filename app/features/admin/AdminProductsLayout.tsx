import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/custom/dropdown-menu';
import { Form, useLoaderData, useNavigate, useNavigation, useSearchParams, useSubmit } from '@remix-run/react';
import { PiCaretDownBold, PiSpinnerLight } from 'react-icons/pi/index.js';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { useEffect, useState } from 'react';

import { Button } from '~/components/ui/button';
import { PaginationBar } from '~/components/ui/custom/PaginationBar';
import { ProductCell } from './ProductCell';
import { ProductStatus } from '@prisma/client';
import type { loader } from '~/routes/admin.products._index';

export default function AdminProductsLayout() {
  const {
    status = 'PUBLISHED',
    groupProducts,
    products,
    total,
    $top = '10',
    categoryId = '',
    categories,
    tags,
    tagId = '',
    q,
  } = useLoaderData<typeof loader>();

  const [query, setQuery] = useState(q);

  const [searchParams] = useSearchParams();
  const navigation = useNavigation();
  const submit = useSubmit();

  const productsOnPageOptions = ['10', '25', '50', '100'];

  const searching = navigation.location && new URLSearchParams(navigation.location.search).has('q');
  const existingParams = Array.from(searchParams.entries());

  useEffect(() => {
    setQuery(q || '');
  }, [q]);

  const productStatusesArr = Object.values(ProductStatus);

  return (
    <div className='mr-12'>
      <div className='flex items-start justify-between pb-6'>
        <h1 className='mb-4 text-2xl font-bold'>Products</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className='py-2 pl-8 pr-6 space-x-2'>
              <span>Add new product</span>
              <PiCaretDownBold className='w-4 h-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            {categories.length ? (
              categories.map(category => (
                <DropdownMenuItem
                  className='justify-end cursor-pointer'
                  key={category.slug}
                  onClick={() =>
                    submit({ _action: 'newProduct', category: category.slug }, { replace: true, method: 'post' })
                  }
                >
                  {category.name}
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem>No Categories. Please create one.</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        {/* </Link> */}
      </div>
      <Tabs id='product-status--tabs' defaultValue='PUBLISHED' className='mb-8'>
        <TabsList className='rounded-full bg-white space-x-2.5'>
          {productStatusesArr.map(productStatus => (
            <Form key={productStatus} method='get' preventScrollReset>
              <>
                {[
                  ['status', productStatus],
                  ['$skip', '0'],
                  ...existingParams.filter(([key]) => {
                    return key !== 'status' && key !== '$skip';
                  }),
                ].map(([key, value]) => {
                  return <input key={key} type='hidden' name={key} value={value} />;
                })}
              </>
              <TabsTrigger
                type='submit'
                value={productStatus}
                className='px-6 py-1.5 rounded-full text-foreground bg-white border border-secondary-200 data-[state=active]:border-secondary-100 data-[state=active]:bg-secondary-100 capitalize'
                data-state={status === productStatus ? 'active' : ''}
              >
                {productStatus.toLocaleLowerCase()} (
                {(groupProducts.find(group => group.name === productStatus)?.count || 0).toString()})
              </TabsTrigger>
            </Form>
          ))}
        </TabsList>
      </Tabs>
      <section id='filter-list'>
        <div className='flex items-center my-4 space-x-2'>
          {categoryId && (
            <Form method='get' preventScrollReset>
              <>
                {[...existingParams.filter(([key]) => key !== 'categoryId')].map(([key, value]) => {
                  return <input key={key} type='hidden' name={key} value={value} />;
                })}
              </>
              <button
                type='submit'
                className='flex items-center py-1 pl-3 pr-2 space-x-2 border rounded-md text-primary-brown bg-secondary-100 border-primary-brown/50'
              >
                <div>category: {categories.find(cat => cat.id.toString() === categoryId)?.name}</div>
                <img src='/static/assets/icons/cross.svg' alt='' />
              </button>
            </Form>
          )}
          {tagId && (
            <Form method='get' preventScrollReset>
              <>
                {[...existingParams.filter(([key]) => key !== 'tagId')].map(([key, value]) => {
                  return <input key={key} type='hidden' name={key} value={value} />;
                })}
              </>
              <button
                type='submit'
                className='flex items-center py-1 pl-3 pr-2 space-x-2 border rounded-md text-primary-brown bg-secondary-100 border-primary-brown/50'
              >
                <div>tag: {tags.find(tag => tag.id.toString() === tagId)?.name}</div>
                <img src='/static/assets/icons/cross.svg' alt='' />
              </button>
            </Form>
          )}
        </div>
      </section>
      <section id='products_list' className='border rounded-xl border-secondary-100'>
        <Table>
          <TableHeader>
            <TableRow className='h-[60px] hover:bg-secondary-50 bg-secondary-50 [&>th]:font-semibold border-secondary-100'>
              {/* <TableHead className='w-8 rounded-tl-xl'>D</TableHead> */}
              <TableHead className='rounded-tl-xl'>
                <div className='flex items-center space-x-2'>
                  <Form
                    id='search-form'
                    className='relative w-full'
                    preventScrollReset
                    onChange={e => {
                      const isFirstSearch = q === null;
                      const { currentTarget } = e;
                      submit(currentTarget, {
                        replace: !isFirstSearch,
                      });
                    }}
                  >
                    <>
                      {[...existingParams.filter(([key]) => key !== 'q')].map(([key, value]) => {
                        return <input key={key} type='hidden' name={key} value={value} />;
                      })}
                    </>
                    <input
                      id='q'
                      type='search'
                      aria-label='Search products'
                      name='q'
                      placeholder='Search'
                      onChange={e => {
                        setQuery(e.currentTarget.value);
                      }}
                      value={query || ''}
                      className='pl-6 border border-primary-brown/50 rounded-md min-h-[24px] max-w-80 w-full bg-white text-primary-brown placeholder:text-secondary-500 focus:outline-none
                      search-cancel:appearance-none search-cancel:w-[22px] search-cancel:h-[22px] search-cancel:scale-[0.6] search-cancel:bg-[url(/static/assets/icons/cross.svg)]'
                    />
                    <img
                      src='/static/assets/icons/searchSmall.svg'
                      hidden={searching}
                      className='absolute w-4 h-4 fill-primary-brown left-1 top-1'
                      alt=''
                    />
                    <PiSpinnerLight
                      aria-hidden
                      hidden={!searching}
                      className='fill-primary-brown animate-spin absolute left-1.5 top-1.5 w-3.5 h-3.5'
                    />
                  </Form>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className='min-h-[24px] px-2 rounded-md bg-secondary-100 border border-secondary-100 
                                    flex justify-center items-center space-x-2 text-xs font-semibold whitespace-nowrap min-w-fit'
                      >
                        <span>
                          {categories.find(category => category.id.toString() === categoryId)?.name || 'All categories'}
                        </span>
                        <PiCaretDownBold className='fill-primary-brown' />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align='start'
                      className='border rounded-md shadow-none bg-secondary-50 border-secondary-100'
                    >
                      <Form method='get' preventScrollReset>
                        <>
                          {[
                            ['$skip', '0'],
                            ...existingParams.filter(([key]) => {
                              return key !== 'categoryId' && key !== '$skip';
                            }),
                          ].map(([key, value]) => {
                            return <input key={key} type='hidden' name={key} value={value} />;
                          })}
                        </>
                        <button className='w-full' type='submit'>
                          <DropdownMenuItem className='focus:bg-secondary-100 text-primary-brown focus:text-primary-brown'>
                            All categories
                          </DropdownMenuItem>
                        </button>
                      </Form>
                      {categories.map((category, index) => {
                        return (
                          <Form method='get' preventScrollReset key={index}>
                            <>
                              {[
                                ['$skip', '0'],
                                ['categoryId', category.id.toString()],
                                ...existingParams.filter(([key]) => {
                                  return key !== 'categoryId' && key !== '$skip';
                                }),
                              ].map(([key, value]) => {
                                return <input key={key} type='hidden' name={key} value={value} />;
                              })}
                            </>
                            <button className='w-full' type='submit'>
                              <DropdownMenuItem className='focus:bg-secondary-100 text-primary-brown focus:text-primary-brown'>
                                {category.name}
                              </DropdownMenuItem>
                            </button>
                          </Form>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableHead>
              <TableHead className='w-40'>Price</TableHead>
              <TableHead className=''>
                <div className='flex items-center space-x-2'>
                  <div>Tag</div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className='min-h-[24px] px-2 rounded-md bg-secondary-100 border border-secondary-100 
                                    flex justify-center items-center space-x-2 text-xs font-semibold'
                      >
                        <span className='whitespace-nowrap'>
                          {tags.find(tag => tag.id.toString() === tagId.toString())?.name || 'All'}
                        </span>
                        <PiCaretDownBold className='fill-primary-brown' />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align='start'
                      className='border rounded-md shadow-none bg-secondary-50 border-secondary-100'
                    >
                      <Form method='get' preventScrollReset>
                        <>
                          {[
                            ['$skip', '0'],
                            ...existingParams.filter(([key]) => {
                              return key !== 'tagId' && key !== '$skip';
                            }),
                          ].map(([key, value]) => {
                            return <input key={key} type='hidden' name={key} value={value} />;
                          })}
                        </>
                        <button className='w-full' type='submit'>
                          <DropdownMenuItem className='whitespace-nowrap focus:bg-secondary-100 text-primary-brown focus:text-primary-brown'>
                            All
                          </DropdownMenuItem>
                        </button>
                      </Form>
                      {tags.map((tag, index) => {
                        return (
                          <Form method='get' preventScrollReset key={index}>
                            <>
                              {[
                                ['$skip', '0'],
                                ['tagId', tag.id.toString()],
                                ...existingParams.filter(([key]) => {
                                  return key !== 'tagId' && key !== '$skip';
                                }),
                              ].map(([key, value]) => {
                                return <input key={key} type='hidden' name={key} value={value} />;
                              })}
                            </>
                            <button className='w-full' type='submit'>
                              <DropdownMenuItem className='whitespace-nowrap focus:bg-secondary-100 text-primary-brown focus:text-primary-brown'>
                                {tag.name}
                              </DropdownMenuItem>
                            </button>
                          </Form>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableHead>
              <TableHead className='w-32'>Stock</TableHead>
              <TableHead className='text-center rounded-tr-xl w-28'></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length > 0 ? (
              products.map(product => (
                <TableRow key={product.id} className={`border-secondary-100 hover:bg-[#fffdf8] `}>
                  {/* <TableCell className='w-10'>D</TableCell> */}
                  <ProductCell product={product as any} />
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className='text-center'>
                  No products
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </section>
      {products.length > 0 && (
        <section id='pagination' className='flex justify-between my-12 text-xs font-medium'>
          <PaginationBar total={total} />
          <div className='flex items-center space-x-2'>
            <div>Products per page: </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className='min-w-[32px] min-h-[32px] px-2 rounded-md bg-secondary-50 border border-secondary-100 flex justify-center items-center space-x-2 text-sm font-normal'>
                  <span>{$top}</span>
                  <PiCaretDownBold />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align='end'
                className='min-w-[54px] rounded-md shadow-none bg-secondary-50 border border-secondary-100'
              >
                {productsOnPageOptions.map((value, index) => {
                  return (
                    <Form method='get' preventScrollReset key={index}>
                      <>
                        {[
                          ['$skip', '0'],
                          ['$top', value],
                          ...existingParams.filter(([key]) => key !== '$skip' && key !== '$top'),
                        ].map(([key, value]) => {
                          return <input key={key} type='hidden' name={key} value={value} />;
                        })}
                      </>
                      <button className='w-full' type='submit'>
                        <DropdownMenuItem className='focus:bg-secondary-100 text-primary-brown focus:text-primary-brown'>
                          {value}
                        </DropdownMenuItem>
                      </button>
                    </Form>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </section>
      )}
    </div>
  );
}
