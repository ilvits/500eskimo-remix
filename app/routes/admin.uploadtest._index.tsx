import {
  unstable_composeUploadHandlers as composeUploadHandlers,
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
  json,
  unstable_parseMultipartFormData as parseMultipartFormData,
} from '@remix-run/node';
import { useActionData, useFetcher } from '@remix-run/react';
import { useEffect, useState } from 'react';

import type { ActionFunction } from '@remix-run/node';
import { uploadImage } from '~/utils/utils.server';
import { useDropzone } from 'react-dropzone-esm';

interface UploadedImage {
  secure_url?: string;
  url: string;
}

export const action: ActionFunction = async ({ request }) => {
  try {
    const uploadHandler = composeUploadHandlers(async ({ name, data }) => {
      if (name !== 'files') {
        return undefined;
      }

      const uploadedImage = (await uploadImage(data)) as UploadedImage;
      return uploadedImage.secure_url;
    }, createMemoryUploadHandler());

    const formData = await parseMultipartFormData(request, uploadHandler);
    const files = formData.getAll('files');
    console.log('formData: ', files);

    return json({ error: null, imgSrc: files });
  } catch (error) {
    console.log(error);
    return error;
  }
};

type FileWithPreview = File & { preview: string };

function Previews() {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const fetcher = useFetcher();
  useEffect(() => {
    console.log(fetcher.state);
  }, [fetcher.state]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': [],
    },
    maxFiles: 4,
    onDrop: (acceptedFiles: File[]) => {
      setFiles(
        acceptedFiles.map(file =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
      const formData = new FormData();
      formData.append('draftId', '1');
      for (const file of acceptedFiles) {
        formData.append('files', file);
      }
      fetcher.submit(formData, { method: 'post', action: '', encType: 'multipart/form-data' });
    },
  });

  const thumbs = files.map(file => (
    <div
      className='inline-flex flex-shrink-0 mr-2 mb-2 w-24 h-24 overflow-hidden rounded border border-secondary-200 p-2'
      key={file.name}
    >
      <div
        className={`flex items-center justify-center transition-opacity duration-1000 ${
          fetcher.state === 'submitting' ? 'animate-pulse' : ''
        }`}
      >
        <img
          src={file.preview}
          className={`object-contain w-full h-auto transition-opacity duration-1000 ${
            fetcher.state === 'submitting' ? 'opacity-50' : ''
          }`}
          onLoad={() => {
            URL.revokeObjectURL(file.preview);
          }}
          alt=''
        />
      </div>
    </div>
  ));

  useEffect(() => {
    return () => files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
    <section className='container'>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input name='files' {...getInputProps()} onChange={event => console.log('changed', event.target.value)} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <aside className='mt-4 flex flex-wrap gap-2 items-center'>{thumbs}</aside>
      {files.length > 0 ? (
        <aside>
          <button
            type='button'
            onClick={() => {
              setFiles([]);
            }}
          >
            Clear
          </button>
        </aside>
      ) : (
        <aside></aside>
      )}
      {files.length > 0 && <button type='submit'>upload to cloudinary</button>}
    </section>
  );
}

export default function Index() {
  const data = useActionData<typeof action>();
  const fetcher = useFetcher();

  return (
    <>
      <fetcher.Form method='post' encType='multipart/form-data'>
        <Previews />
      </fetcher.Form>
      {data?.error ? <h2>{data.error}</h2> : null}
      {data?.imgSrc ? (
        <>
          {fetcher.state}
          <h2>uploaded images</h2>
          <pre>{JSON.stringify(data.imgSrc, null, 2)}</pre>
          {/* {data?.imgSrc &&
            data.imgSrc.map((img, index) => (
              <div key={index}>
                {img.toString()}
                <img
                  loading='lazy'
                  className='border rounded m-4 w-9 h-9 object-cover'
                  src={img.toString()}
                  alt={data.imgDesc?.toString() || 'Upload result'}
                />
              </div>
            ))} */}
          {/* <img
            className='border rounded m-4 w-9 h-9 object-cover'
            src={data.imgSrc.toString()}
            alt={data.imgDesc?.toString() || 'Upload result'}
          /> */}
        </>
      ) : null}
    </>
  );
}
