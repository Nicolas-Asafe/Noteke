import { Save,Image,Download } from "lucide-react"

export default function Home() {
  return (
    <>
      <div className="flex flex-col h-screen text-center p-5 justify-center items-center anima">
        <nav className="flex flex-row justify-between items-center w-full mb-4">
          <h1 className="font-semibold text-2xl">Create a new note here</h1>
          <div className="flex gap-2">
            <button className="bg-zinc-900 border border-neutral-800 p-2 rounded-md text-2xl hover:border-neutral-500 hover:bg-zinc-800 transition" aria-label="Download note"><Download /></button>
            <button className="bg-zinc-900 border border-neutral-800 p-2 rounded-md text-2xl hover:border-neutral-500 hover:bg-zinc-800 transition" aria-label="Save note"><Save /></button>
            <button className="bg-zinc-900 border border-neutral-800 p-2 rounded-md text-2xl hover:border-neutral-500 hover:bg-zinc-800 transition" aria-label="Change cover"><Image /></button>
          </div>
        </nav>
        <input type="text" placeholder="Title" className="w-full bg-neutral-950 p-3 text-3xl outline-none border rounded-md border-neutral-900 hover:border-neutral-600 transition" />
        <textarea placeholder="Description" className="w-full bg-neutral-950 mt-3 p-3 resize-none border outline-none text-2xl h-4/6 rounded-md border-neutral-900 hover:border-neutral-600 transition"></textarea>
      </div>
    </>
  )
}
