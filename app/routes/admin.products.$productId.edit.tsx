import { Input } from "~/ui/custom/Input";
import { Select } from "~/ui/custom/Select";
import { ValidatedForm } from "remix-validated-form";
import { productSchema } from "~/common/productSchema";
import { withZod } from "@remix-validated-form/with-zod";
import {
  json,
  type LoaderFunctionArgs,
  type LoaderFunction,
  redirect,
} from "@remix-run/node";
import { getProduct, updateProduct } from "~/services/products.server";
import { getAllCategories } from "~/services/category.server";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { Button } from "~/ui/custom/Button";

const validator = withZod(productSchema);

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.productId, "Missing productId param");
  const product = await getProduct(Number(params.productId));
  const categories = await getAllCategories();
  return json({ categories, defaultValues: product });
};

export const action = async ({ params, request }: LoaderFunctionArgs) => {
  invariant(params.productId, "Missing productId param");
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  console.log("updates: ", updates);

  await updateProduct(Number(params.productId), updates);
  return redirect(`/admin/products`);
};

export default function AdminProductCardEdit() {
  const { defaultValues, categories } = useLoaderData<typeof loader>();
  return (
    <ValidatedForm
      className='w-96 space-y-4'
      method='POST'
      validator={validator}
      defaultValues={defaultValues}
    >
      <Input type='text' name='sku' id='sku' label='SKU' />
      <Input type='text' name='title' id='title' label='Title' />
      <Select
        name='categoryId'
        id='categoryId'
        label='Category'
        options={categories}
      ></Select>
      <Input
        type='text'
        name='description'
        id='description'
        label='Description'
      />
      <Input type='number' name='price' id='price' label='Price' />
      <Input type='text' name='image' id='image' label='Image' />
      <Input type='number' name='rating' id='rating' label='Rating' />
      <Input type='number' name='stock' id='stock' label='Stock' />
      <Input
        type='number'
        name='numReviews'
        id='numReviews'
        label='Number of Reviews'
      />
      <Button
        type='submit'
        label='Save'
        className='w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
      >
        Save
      </Button>
    </ValidatedForm>
  );
}
