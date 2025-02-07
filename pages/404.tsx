import { Home } from "lucide-react";


export default function Custom404() {
    return (
      <div className="flex flex-col items-center justify-center h-screen  text-center">
        <h1 className="text-9xl font-bold text-gray-100">404</h1>
        <p className="text-3xl text-gray-100 mt-2">Essa página não existe, anote isso...</p>
        <a
          href="/"
          className="mt-4 2xl px-4 py-2 bg-neutral-900 text-white rounded-md hover:bg-neutral-800 transition flex gap-2 items-center"
        >
          Voltar para a Home <Home></Home>
        </a>
      </div>
    );
  }
  