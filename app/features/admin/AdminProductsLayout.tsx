import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Form, Link, useLoaderData, useNavigation, useSearchParams, useSubmit } from '@remix-run/react';
import { PiCaretDownBold, PiSpinnerLight } from 'react-icons/pi/index.js';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { TbSortAscendingNumbers, TbSortDescendingNumbers } from 'react-icons/tb/index.js';
import { useEffect, useState } from 'react';

import { PaginationBar } from '~/components/ui/custom/PaginationBar';
import type { loader } from '~/routes/admin.products._index';

export default function AdminProductsLayout() {
  // const fetcher = useFetcher();
  const submit = useSubmit();
  const navigation = useNavigation();

  const productsOnPageOptions = ['10', '25', '50', '100'];

  const loaderData = useLoaderData<typeof loader>();
  const {
    status = 'published',
    groupProducts,
    products,
    total,
    $top = '10',
    order = 'asc',
    orderBy = 'id',
    categoryId = '',
    categories,
    tags,
    tagId = '',
    q,
  } = loaderData;
  const [searchParams] = useSearchParams();
  const existingParams = Array.from(searchParams.entries());
  const searching = navigation.location && new URLSearchParams(navigation.location.search).has('q');
  const [query, setQuery] = useState(q);

  useEffect(() => {
    setQuery(q || '');
  }, [q]);
  // console.log(existingParams);
  // console.log('products: ', products);
  // console.log('total: ', total);
  // console.log('groupProducts: ', groupProducts);
  // console.log('categoryId: ', categoryId);
  // console.log(products[1]);
  // console.log('tags: ', tags);
  // console.log('tagId: ', tagId);

  return (
    <div className='mr-12'>
      <div className='flex justify-between items-start pb-6'>
        <h1 className='text-2xl font-bold mb-4'>Products</h1>
        <Link
          to='/admin/products/new'
          className='px-8 py-2 rounded-full bg-primary font-medium text-base text-white flex items-center space-x-1'
        >
          <img src='/static/assets/icons/plus.svg' alt='' />
          <span>Add new product</span>
        </Link>
      </div>
      <Tabs id='product-status--tabs' defaultValue='published' className='mb-8'>
        <TabsList className=' rounded-full bg-white space-x-2.5'>
          <Form method='get' preventScrollReset>
            <>
              {[
                ['status', 'published'],
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
              value='published'
              className='px-6 py-1.5 rounded-full data-[state=active]:text-primary-brown text-secondary-500 
              bg-white border border-primary-brown/50 data-[state=active]:border-secondary-100 data-[state=active]:bg-secondary-100'
              data-state={status === 'published' ? 'active' : ''}
            >
              Published ({(groupProducts.find(group => group.name === 'published')?.count || 0).toString()})
            </TabsTrigger>
          </Form>
          <Form method='get' preventScrollReset>
            <>
              {[
                ['status', 'draft'],
                ['$skip', '0'],
                ...existingParams.filter(([key]) => key !== 'status' && key !== '$skip'),
              ].map(([key, value]) => {
                return <input key={key} type='hidden' name={key} value={value} />;
              })}
            </>
            <TabsTrigger
              type='submit'
              value='draft'
              className='px-6 py-1.5 rounded-full data-[state=active]:text-primary-brown text-secondary-500 bg-white border border-primary-brown/50 data-[state=active]:border-secondary-100 data-[state=active]:bg-secondary-100'
              data-state={status === 'draft' ? 'active' : ''}
            >
              Drafts ({(groupProducts.find(group => group.name === 'draft')?.count || 0).toString()})
            </TabsTrigger>
          </Form>
          <Form method='get' preventScrollReset>
            <>
              {[
                ['status', 'hidden'],
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
              value='hidden'
              className='px-6 py-1.5 rounded-full data-[state=active]:text-primary-brown text-secondary-500 bg-white border border-primary-brown/50 data-[state=active]:border-secondary-100 data-[state=active]:bg-secondary-100'
              data-state={status === 'hidden' ? 'active' : ''}
            >
              Hidden ({(groupProducts.find(group => group.name === 'hidden')?.count || 0).toString()})
            </TabsTrigger>
          </Form>
          <Form method='get' preventScrollReset>
            <>
              {[
                ['status', 'archived'],
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
              value='archived'
              className='px-6 py-1.5 rounded-full data-[state=active]:text-primary-brown text-secondary-500 bg-white border border-primary-brown/50 data-[state=active]:border-secondary-100 data-[state=active]:bg-secondary-100'
              data-state={status === 'archived' ? 'active' : ''}
            >
              Archived ({(groupProducts.find(group => group.name === 'archived')?.count || 0).toString()})
            </TabsTrigger>
          </Form>
        </TabsList>
      </Tabs>
      <section id='filter-list'>
        <div className='flex items-center space-x-2 my-4'>
          {categoryId && (
            <Form method='get' preventScrollReset>
              <>
                {[...existingParams.filter(([key]) => key !== 'categoryId')].map(([key, value]) => {
                  return <input key={key} type='hidden' name={key} value={value} />;
                })}
              </>
              <button
                type='submit'
                className='flex items-center space-x-2 pl-3 pr-2 py-1 rounded-md text-primary-brown bg-secondary-100 border border-primary-brown/50'
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
                className='flex items-center space-x-2 pl-3 pr-2 py-1 rounded-md text-primary-brown bg-secondary-100 border border-primary-brown/50'
              >
                <div>tag: {tags.find(tag => tag.id.toString() === tagId)?.name}</div>
                <img src='/static/assets/icons/cross.svg' alt='' />
              </button>
            </Form>
          )}
        </div>
      </section>
      <section id='products_list' className='rounded-xl border border-secondary-100'>
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
                      className='fill-primary-brown absolute left-1 top-1 w-4 h-4'
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
                      className='rounded-md shadow-none bg-secondary-50 border border-secondary-100'
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
              <TableHead className='w-40'>
                <Form method='get' preventScrollReset>
                  <>
                    {[
                      ['orderBy', orderBy === 'price' && order === 'desc' ? '' : 'price'],
                      ['order', orderBy !== 'price' ? 'asc' : 'desc'],
                      ...existingParams.filter(([key]) => key !== 'orderBy' && key !== 'order'),
                    ].map(([key, value]) => {
                      return <input key={key} type='hidden' name={key} value={value} />;
                    })}
                  </>
                  <button className='w-full flex items-center space-x-2' type='submit'>
                    <span>Price</span>
                    {orderBy === 'price' &&
                      (order === 'desc' ? (
                        <TbSortDescendingNumbers className='h-4 w-4' />
                      ) : (
                        <TbSortAscendingNumbers className='h-4 w-4' />
                      ))}
                  </button>
                </Form>
              </TableHead>
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
                      className='rounded-md shadow-none bg-secondary-50 border border-secondary-100'
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
              <TableHead className='rounded-tr-xl text-center w-28'></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length > 0 ? (
              products.map(product => (
                <TableRow key={product.id} className='border-secondary-100 hover:bg-[#fffdf8]'>
                  {/* <TableCell className='w-10'>D</TableCell> */}
                  <TableCell>
                    <div className='flex space-x-2 items-center'>
                      <img className='w-16 h-16 rounded-md' width={64} height={64} src={product.image} alt='' />
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
                          <span>${variant.price}</span>
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
                      product.tags.map((tag: any, index) => (
                        <div
                          key={index}
                          className={`text-xs rounded-full bg-[${tag.color}] px-2 py-1 w-fit text-white`}
                        >
                          {tag.name}
                        </div>
                      ))}
                  </TableCell>
                  <TableCell>
                    {product.productVariants.map(variant => {
                      return (
                        <div key={variant.id} className='flex items-center w-full space-x-2'>
                          <div className='h-1 w-14 bg-secondary-100 relative rounded-full'>
                            <div
                              className='h-1 bg-additional-green-100 absolute top-0 left-0 w-1/2 rounded-full'
                              // style={{ width: `${product.stock}%` }}
                            ></div>
                          </div>
                          <div>{variant.quantity}</div>
                        </div>
                      );
                    })}
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center space-x-2'>
                      <Link
                        to={`/admin/products/${product.id}/edit`}
                        className='w-9 h-9 rounded-full bg-secondary-100 flex justify-center items-center'
                      >
                        <img className='w-5 h-5' src='/static/assets/icons/pencil.svg' alt=''></img>
                      </Link>
                      <button className='w-9 h-9 rounded-full bg-secondary-100 flex justify-center items-center'>
                        <img className='w-5 h-5' src='/static/assets/icons/dots.svg' alt=''></img>
                      </button>
                    </div>
                  </TableCell>
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
        <section id='pagination' className='my-12 flex justify-between text-xs font-medium'>
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
