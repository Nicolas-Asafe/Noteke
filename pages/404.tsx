export default function Custom404() {
    return (
      <div className="flex flex-col items-center justify-center h-screen  text-center">
        <h1 className="text-5xl font-bold text-gray-600">404</h1>
        <p className="text-lg text-gray-700 mt-2">Página não encontrada</p>
        <a
          href="/"
          className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
        >
          Voltar para a Home
        </a>
      </div>
    );
  }
  