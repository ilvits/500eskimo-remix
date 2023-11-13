import MainNavigation from "./MainNavigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className='flex flex-col min-h-screen'>
      <MainNavigation />
      <section>{children}</section>
    </main>
  );
}
