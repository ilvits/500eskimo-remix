import MainNavigation from './MainNavigation';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className='flex flex-col'>
      <MainNavigation />
      <section className='mt-6'>{children}</section>
    </main>
  );
}
