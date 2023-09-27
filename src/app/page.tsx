import Image from 'next/image'
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex place-items-center justify-center w-screen h-screen">
      <Link href="/people" className="text-xl font-bold">Star wars</Link>
    </main>
  );
}
