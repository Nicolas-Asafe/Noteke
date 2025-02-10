import "@/styles/globals.css";
import type { AppProps } from "next/app";
import SideBar from "@/components/Sidebar";
import Link from "next/link";
import { Plus, Home, Plug, Table } from "lucide-react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <div className="flex flex-row md:min-h-screen ">
        {/* Sidebar */}
        <SideBar />

        {/* Conteúdo principal */}
        <main className="flex-1 relative">
          <Component {...pageProps} />
          <p className="text-zinc-400 text-sm hidden md:block absolute bottom-2 left-2">
            Made by <Link href="https://github.com/Nicolas-Asafe" className="text-zinc-400 hover:text-white">Nicolas Asafe</Link>
          </p>
        </main>
      </div>

      {/* BottomBar */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden">
        <div className="mx-4 mb-4">
          <div className="bg-neutral-950 border border-zinc-900 rounded-lg p-1 flex justify-around items-center">
            <Link href={'/'} className="p-2 text-zinc-400 hover:text-white hover:bg-neutral-900 rounded-md transition">
              <Home size={24} />
            </Link>
            <Link href={'/plugins'} className="p-2 text-zinc-400 hover:text-white hover:bg-neutral-900 rounded-md transition">
              <Plug size={24} />
            </Link>
            
          </div>
        </div>
      </div>
    </>
  );
}
