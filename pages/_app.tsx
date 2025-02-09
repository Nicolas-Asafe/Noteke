import "@/styles/globals.css";
import type { AppProps } from "next/app";
import SideBar from "@/components/Sidebar";
import Link from "next/link";
import { Plus, Home, Search } from "lucide-react";


export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar */}
      <SideBar />

      {/* Conteúdo principal */}
      <div className="flex flex-col flex-1">
        <Component {...pageProps} />
      </div>
 
      {/* BottomBar */}
      <nav className="md:hidden rounded-xl p-2 fixed bottom-2f w-11/12 self-center flex justify-center bg-neutral-950 border border-zinc-900">
        <div className="flex w-full justify-around p-2">
          <Link href={'/'} className="text-zinc-400 hover:text-white">
            <Home size={24} />
          </Link>
          <Link href={'/NewNote'} className="text-zinc-400 hover:text-white">
            <Plus size={24} />
          </Link>
          <Link href={'/explorer'} className="text-zinc-400 hover:text-white">
            <Search size={24} />
          </Link>
        </div>
      </nav>
    </div>
  );
}
