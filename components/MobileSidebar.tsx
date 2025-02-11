import Link from "next/link";
import { X, Plus, Table, ListChecks, GitBranch, FilePlus } from "lucide-react";
import { getAvailableOrgs } from "@/utils/getOrgs";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const router = useRouter();
  const [orgs, setOrgs] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      const availableOrgs = getAvailableOrgs();
      setOrgs(availableOrgs);
    }
  }, [isOpen]);

  const getIcon = (iconName: string, size: number = 20) => {
    switch (iconName) {
      case 'FilePlus': return <FilePlus size={size} />;
      case 'Table': return <Table size={size} />;
      case 'ListChecks': return <ListChecks size={size} />;
      case 'GitBranch': return <GitBranch size={size} />;
      default: return <Plus size={size} />;
    }
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-50 transform transition-all duration-500 ease-in-out ${
      isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
    }`}>
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black transition-opacity duration-500 ease-in-out"
        style={{ 
          opacity: isOpen ? 0.5 : 0,
          transition: 'opacity 500ms cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="relative w-64 h-full bg-neutral-950 border-r border-zinc-900">
        <div className="p-4 flex justify-between items-center border-b border-zinc-900">
          <h1 className="text-2xl font-bold">Create New</h1>
          <button onClick={onClose} className="p-2">
            <X size={24} />
          </button>
        </div>

        <div className="p-4 space-y-3">
          {orgs.map(org => (
            <button 
              key={org.id}
              onClick={() => handleNavigation(org.path)}
              className="w-full flex items-center justify-between p-3 bg-zinc-900 rounded-lg border border-neutral-800 hover:border-neutral-500 hover:bg-zinc-800 transition"
            >
              <span>New {org.name}</span>
              {getIcon(org.icon)}
            </button>
          ))}
        </div>

        <p className="text-zinc-400 text-sm absolute bottom-2 left-2">
          Made by <Link href="https://github.com/Nicolas-Asafe" className="text-zinc-400 hover:text-white">Nicolas Asafe</Link>
        </p>
      </div>
    </div>
  );
} 