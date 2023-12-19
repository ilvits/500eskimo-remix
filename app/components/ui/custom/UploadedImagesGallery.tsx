import { LucideLoader2 } from 'lucide-react';
import pkg from 'react-sortablejs';
const { ReactSortable } = pkg;

export default function UploadedImagesGallery({
  productImages,
  setProductImages,
  fetcherImages,
  isSubmiting,
  isSorting,
  handleReactSortableEnd,
}: any) {
  console.log('fetcherImages: ', fetcherImages.length, productImages.length);

  return (
    <>
      <ReactSortable
        animation={200}
        delayOnTouchOnly
        // delay={2}
        list={productImages}
        setList={setProductImages}
        onEnd={evt => handleReactSortableEnd(evt)}
        ghostClass='opacity-20'
        chosenClass='chosen'
        easing='cubic-bezier(1, 0, 0, 1)'
        className='grid w-full grid-cols-3 gap-4 mt-4 grid-container'
      >
        <>
          {productImages.map((image: any, i: number) => (
            <div
              key={i}
              className={`relative flex flex-col items-center justify-end rounded-lg
          bg-secondary-50 [&>div.trash]:hover:opacity-100 aspect-square w-auto h-auto ${
            isSorting ? 'pointer-events-none' : ''
          }`}
            >
              <div
                className='trash absolute -right-3 -top-3  cursor-pointer opacity-0 bg-secondary-500 rounded-full p-1.5 transition-opacity'
                // onClick={() => setProductImages(prev => prev.filter(f => f !== image))}
              >
                <img className='z-10 w-5 h-5' src='/static/assets/icons/trash-white.svg' alt='' />
              </div>
              <img className='rounded-sm bg-[#F6F4EF]' src={image.imageUrl} alt='' />
              <p className='w-full p-1 text-xs font-semibold truncate text-secondary-500'>
                {image.imageUrl.split('/')[image.imageUrl.split('/').length - 1]}
              </p>
            </div>
          ))}
          {fetcherImages.length > 0 &&
            fetcherImages?.map((image: any, i: number) => (
              <div
                key={i}
                className={`relative flex items-center justify-center rounded-lg
            bg-secondary-50 [&>div.trash]:hover:opacity-100 aspect-square w-auto h-auto`}
              >
                <LucideLoader2 className='absolute z-50 w-6 h-6 animate-spin' />
                <img
                  className={`rounded-sm bg-[#F6F4EF] ${isSubmiting ? 'opacity-50' : ''}`}
                  src={image.imageUrl}
                  alt=''
                />
              </div>
            ))}
        </>
      </ReactSortable>
    </>
  );
}
