import Link from "next/link";
import {Trash2,Plus,Home,Search} from  'lucide-react'


export default function SideBar() {
    return (
        <div className="bg-neutral-950 text-white w-64 min-h-screen border-r border-zinc-900  ">
            <header className="p-4">
                <h1 className="text-3xl font-bold">Notes</h1>
            </header>
            <section className="pt-8 p-3 space-y-2 flex flex-col border-t border-zinc-900">
                <Link href={'/'}
                    className="font-normal text-zinc-400 flex flex-row justify-between items-center transition text-center rounded-lg hover:border-neutral-500 p-1 px-2 bg-zinc-900 hover:bg-zinc-800 w-auto border border-neutral-800" aria-label="Go to home">  
                     Go Home 
                     <Home size={30} style={{padding:'5px'}} className="rounded-md hover:bg-neutral-900 hover:text-white transition"></Home>
                </Link> 
                <Link href={'/NewNote'}
                    className=" font-normal text-zinc-400 flex flex-row justify-between items-center transition   rounded-lg hover:border-neutral-500  hover:bg-zinc-800 p-1 px-2 bg-zinc-900 w-auto mb-2 border border-neutral-800"
                    aria-label="Create new note"
                >  
                    New Note
                   <Plus size={30} style={{padding:'5px'}} className="rounded-md hover:bg-neutral-900 hover:text-white transition"></Plus>
                </Link>
                <Link href={'/explorer'}
                    className=" font-normal text-zinc-400 flex flex-row justify-between items-center transition   rounded-lg hover:border-neutral-500  hover:bg-zinc-800 p-1 px-2 bg-zinc-900 w-auto mb-2 border border-neutral-800"
                    aria-label="Create new note"
                >  
                    Explorer 
                   <Search size={30} style={{padding:'5px'}} className="rounded-md hover:bg-neutral-900 hover:text-white transition"/>
                </Link>
                <div className=" border border-neutral-900 p-2 rounded-lg space-y-2">
                    <p className="text-slate-200 font-semibold">Your notes:</p>
                    <ul className="space-y-2">
                    <li 
                        className="flex flex-row justify-between items-center transition shadow-md shadow-blackbg-neutral-950 hover:bg-zinc-800 rounded-lg hover:border-neutral-600 cursor-pointer border border-neutral-800"
                        role="listitem"
                        >
                            <span className="font-semibold p-2">
                            Note 1
                            </span>

                            <Trash2 color="white" size={36} className="hover:bg-red-600 transition hover:border-transparent rounded-md m-1 p-2 border border-zinc-800"></Trash2> 
                        </li>
                    </ul>
                </div>
            </section> 
        </div>
    );
}
