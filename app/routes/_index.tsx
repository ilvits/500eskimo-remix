import { type MetaFunction } from "@remix-run/node";

// import { authenticator } from "~/auth/authenticator.server";

export const meta: MetaFunction = () => {
  return [
    { title: "500 Eskimo" },
    { name: "description", content: "Welcome to 500 Eskimo portal!" },
  ];
};

export default function Index() {
  return <main className='h-screen'>INDEX</main>;
}
