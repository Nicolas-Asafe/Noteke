import Image from "next/image"

import { Plus,Save } from "lucide-react"

export default function Docs() {
  return (
    <div className="w-full min-h-screen flex flex-col animaMini overflow-y-auto h-[59dvh] md:h-[79dvh]">
      <h1 className="text-3xl font-bold m-4 ">Docs Noteke</h1>
      <div className="border-t p-5 border-neutral-900 overflow-auto md:mb-0 mb-20">
         <p className="text-zinc-100 font-medium  text-lg">
           Olá tudo bem? Seja bem vindo(a) ao Noteke aqui nesta documentação você vai aprender a criar seus proprios <span className="font-bold text-white">orgs</span> e também conseguir a se oganizar com suas notas, tabelas, livros, fluxos de trabalho e listas de verificação.
         </p>
         <div className="flex justify-center items-center flex-col mt-5 ">



        <div>
        <p className="md:text-3xl text-xl font-bold w-auto mb-6 bg-neutral-950 border border-neutral-800 p-2 rounded-md text-center transition self-start">Criando seus primeiros orgs</p>
      
      <p className="text-lg p-1 text-zinc-100 m-0">e vai abrir uma SideBar com as opções de criar um novo org (tabelas e notas)</p>
      <Image src="/imgsdocs/image2.png" className="mt-3 rounded-md border border-zinc-600" alt="" width={700} height={700} />
      
        </div>



        <div>
        <p className="text-lg text-zinc-100 mt-3">
         Você pode clicar em um dos dois orgs e vai ir para a pagina de criação do org escolhido, vamos clicar no org NOTE
        </p>
         <Image src="/imgsdocs/image3.png" className="mt-3 rounded-md border m-auto border-zinc-600" alt="" width={700} height={700} />

       

        </div> 

           <div> 
           <p className="text-lg font-medium text-zinc-100 mt-3">
       Você coloca o titulo e a suas anotações na nota e clica em <button 
       className="bg-zinc-900 border border-neutral-800 p-2 rounded-md hover:border-neutral-500 hover:bg-zinc-800 transition"
       aria-label="Save note"
      >
       <Save /> 
     </button> para salvar a nota.
       </p>
             <Image src="/imgsdocs/image4.png" className="mt-3 rounded-md border border-zinc-600" alt="" width={700} height={700} />
             <p className="text-lg font-medium text-zinc-100 mt-3">
              E pronto você criou sua primeira nota!</p>
            </div>
         </div>
      </div>
    </div>
  )
}