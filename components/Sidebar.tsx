import Link from "next/link";
import {Trash2,Plus,Home} from  'lucide-react'


export default function SideBar() {
    return (
        <div className="bg-neutral-950 text-white w-64 min-h-screen border-r border-zinc-900  shadow-md shadow-black">
            <header className="p-4">
                <h1 className="text-3xl font-bold">Notes</h1>
            </header>
            <section className="pt-8 p-3 space-y-2 flex flex-col border-t border-zinc-900">
                <Link href={'/'}
                    className="font-semibold flex flex-row justify-between items-center transition text-center shadow-md shadow-black rounded-lg hover:border-neutral-500 p-2 bg-zinc-900 hover:bg-zinc-800 w-auto  border border-neutral-800" aria-label="Go to home">  
                     Go Home 
                     <Home></Home>
                </Link> 
                <Link href={'/NewNote'}
                    className=" font-semibold flex flex-row justify-between items-center transition  shadow-md shadow-black rounded-lg hover:border-neutral-500  hover:bg-zinc-800 p-2 bg-zinc-900 w-auto mb-2 border border-neutral-800"
                    aria-label="Create new note"
                >  
                    New Note
                   <Plus></Plus>
                </Link>
                <div className="shadow-md shadow-black  border border-neutral-900 p-2 rounded-lg space-y-2">
                    <p className="text-slate-200 font-semibold">Your notes:</p>
                    <ul className="space-y-2">
                    <li 
                        className="flex flex-row justify-between items-center transition shadow-md shadow-blackbg-neutral-950 hover:bg-zinc-800 rounded-lg hover:border-neutral-600 cursor-pointer border border-neutral-800"
                        role="listitem"
                        >
                            <span className="font-semibold p-2">
                            Note 1
                            </span>

                            <Trash2 color="white" size={36} className="hover:bg-black hover:border-transparent rounded-md m-1 p-2 border border-zinc-900"></Trash2>
                        </li>
                    </ul>
                </div>
            </section> 
        </div>
    );
}
