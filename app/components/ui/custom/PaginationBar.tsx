import { Form, useSearchParams } from '@remix-run/react';
import { PiArrowLeftBold, PiArrowLineLeftBold, PiArrowLineRightBold, PiArrowRightBold } from 'react-icons/pi/index.js';

export function PaginationBar({ total }: { total: number }) {
  const [searchParams] = useSearchParams();
  const $skip = Number(searchParams.get('$skip')) || 0;
  const $top = Number(searchParams.get('$top')) || 10;
  const totalPages = Math.ceil(total / $top);
  const currentPage = Math.floor($skip / $top) + 1;
  const maxPages = 7;
  const halfMaxPages = Math.floor(maxPages / 2);
  const canPageBackwards = $skip > 0;
  const canPageForwards = $skip + $top < total;
  const pageNumbers = [] as Array<number>;
  if (totalPages <= maxPages) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    let startPage = currentPage - halfMaxPages;
    let endPage = currentPage + halfMaxPages;
    if (startPage < 1) {
      endPage += Math.abs(startPage) + 1;
      startPage = 1;
    }
    if (endPage > totalPages) {
      startPage -= endPage - totalPages;
      endPage = totalPages;
    }
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
  }
  const existingParams = Array.from(searchParams.entries()).filter(([key]) => {
    return key !== '$skip' && key !== '$top';
  });
  return (
    <>
      {totalPages > 1 && (
        <Form method='GET' className='flex items-center gap-1 text-[#4A2502]' preventScrollReset>
          <>
            {[['$top', String($top)], ...existingParams].map(([key, value]) => {
              return <input key={key} type='hidden' name={key} value={value} />;
            })}
          </>
          <button
            type='submit'
            name='$skip'
            value='0'
            disabled={!canPageBackwards}
            aria-label='First page'
            className='min-w-[32px] min-h-[32px] flex items-center justify-center disabled:opacity-50'
          >
            <PiArrowLineLeftBold className='fill-[#4A2502]' />
          </button>
          <button
            type='submit'
            name='$skip'
            value={Math.max($skip - $top, 0)}
            disabled={!canPageBackwards}
            aria-label='Previous page'
            className='min-w-[32px] min-h-[32px] flex items-center justify-center disabled:opacity-50'
          >
            <PiArrowLeftBold className='fill-[#4A2502]' />
          </button>
          {pageNumbers.map(pageNumber => {
            const pageSkip = (pageNumber - 1) * $top;
            const isCurrentPage = pageNumber === currentPage;
            const isValidPage = pageSkip >= 0 && pageSkip < total;
            if (isCurrentPage) {
              return (
                <button
                  type='submit'
                  name='$skip'
                  className='min-w-[32px] min-h-[32px] rounded-md border border-[#F0D399] bg-[#FFFBF2]'
                  key={`${pageNumber}-active`}
                  value={pageSkip}
                  aria-label={`Page ${pageNumber}`}
                  disabled={!isValidPage}
                >
                  {pageNumber}
                </button>
              );
            } else {
              return (
                <button
                  type='submit'
                  className='min-w-[32px] min-h-[32px]'
                  name='$skip'
                  key={pageNumber}
                  value={pageSkip}
                  aria-label={`Page ${pageNumber}`}
                  disabled={!isValidPage}
                >
                  {pageNumber}
                </button>
              );
            }
          })}
          <button
            type='submit'
            name='$skip'
            value={Math.min($skip + $top, total - $top + 1)}
            disabled={!canPageForwards}
            aria-label='Next page'
            className='min-w-[32px] min-h-[32px] flex items-center justify-center disabled:opacity-50'
          >
            <PiArrowRightBold className='fill-[#4A2502]' />
          </button>
          <button
            type='submit'
            name='$skip'
            value={(totalPages - 1) * $top}
            disabled={!canPageForwards}
            aria-label='Last page'
            className='min-w-[32px] min-h-[32px] flex items-center justify-center disabled:opacity-50'
          >
            <PiArrowLineRightBold className='fill-[#4A2502]' />
          </button>
        </Form>
      )}
    </>
  );
}
