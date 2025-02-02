import "@/styles/globals.css";
import type { AppProps } from "next/app";
import SideBar from "@/components/Sidebar";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="flex flex-row gap-2">
      <SideBar/>
      <div className="flex flex-col flex-1">
       <Component {...pageProps} />
      </div>
    </div>
  )
}
