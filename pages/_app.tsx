import "../styles/globals.css";
import "../styles/docs.css";
import type { AppProps } from "next/app";
import SideBar from "@/components/Sidebar";
import Link from "next/link";
import { Plus, Home, Plug, Table, Settings } from "lucide-react";
import { OrgsProvider } from "@/contexts/OrgsContext";
import { useRouter } from "next/router";
import { useEffect } from "react";
  
export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Simplificar o useEffect para evitar loops
  useEffect(() => {
    const handleRouteChange = () => {
      window.scrollTo(0, 0);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => router.events.off('routeChangeComplete', handleRouteChange);
  }, []); // array de dependências vazio

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <OrgsProvider>
      <>
        <div className="flex flex-row md:min-h-screen">
          {/* Sidebar */}
          <SideBar />

          {/* Conteúdo principal */}
          <main className="flex-1 relative overflow-y-auto">
            <Component {...pageProps} key={router.asPath} />
          </main>
        </div>

        {/* BottomBar */}
        <div className="fixed bottom-0 left-0 right-0 md:hidden">
          <div className="mx-4 mb-4">
            <div className="bg-neutral-950 border border-zinc-900 rounded-lg p-1 flex justify-around items-center">
              {/* <button 
                onClick={() => handleNavigation('/settings')}
                className="p-2 text-zinc-400 hover:text-white hover:bg-neutral-900 rounded-md transition"
              >
                <Settings size={24} />
              </button> */}
              <button 
                onClick={() => handleNavigation('/')}
                className="p-2 text-zinc-400 hover:text-white hover:bg-neutral-900 rounded-md transition"
              >
                <Home size={24} />
              </button>
              <button 
                onClick={() => handleNavigation('/plugins')}
                className="p-2 text-zinc-400 hover:text-white hover:bg-neutral-900 rounded-md transition"
              >
                <Plug size={24} />
              </button>
            </div>
          </div>
        </div>
      </>
    </OrgsProvider>
  );
}
