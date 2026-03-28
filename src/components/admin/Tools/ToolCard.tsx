import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { Tool } from '@/lib/types/tools.types';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';

interface ToolCardProps {
  tool: Tool;
  onEdit: (tool: Tool) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
  isDragging?: boolean;
}

export function ToolCard({
  tool,
  onEdit,
  onDelete,
  onToggleActive,
  isDragging = false
}: ToolCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleToggleActive = (checked: boolean) => {
    onToggleActive(tool.id, checked);
  };

  return (
    <>

      <div
        className={`
          group relative aspect-square flex items-center justify-center rounded-xl transition-all duration-300
          ${isDragging ? 'opacity-50 scale-95' : 'hover:bg-white/5'}
        `}
      >
        {/* Top Left: Toggle (Visible on Hover or if Inactive) */}
        <div className={`
            absolute top-2 left-2 z-20 transition-all duration-200
            ${tool.is_active ? 'opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100' : 'opacity-100'}
          `}>
          <Switch
            checked={tool.is_active}
            onCheckedChange={handleToggleActive}
            className="data-[state=checked]:bg-cyan-500 h-4 w-7 shadow-lg"
          />
        </div>

        {/* Top Right: Actions Menu (Visible on Hover) */}
        <div className="absolute top-1 right-1 z-20 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-white/70 hover:text-white hover:bg-black/40 rounded-full backdrop-blur-sm">
                <MoreVertical className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-navy-900 border-navy-700 text-white shadow-xl">
              <DropdownMenuItem onClick={() => onEdit(tool)} className="hover:bg-navy-800 cursor-pointer text-cyan-400 focus:text-cyan-400 focus:bg-navy-800">
                <Edit className="h-3.5 w-3.5 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="hover:bg-red-900/20 text-red-500 cursor-pointer focus:text-red-500 focus:bg-red-900/20">
                <Trash2 className="h-3.5 w-3.5 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Center: Icon (No Container) */}
        <div className="w-2/3 h-2/3 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
          <OptimizedImage
            src={tool.icon_url}
            alt={tool.name}
            className="object-contain w-full h-full filter drop-shadow-2xl"
            fallbackIcon={<div className="w-full h-full rounded-full bg-navy-800/50 animate-pulse" />}
          />
        </div>

        {/* Tooltip for Name (Bottom Overlay) */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0 pointer-events-none z-20">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-white/90 bg-black/80 px-2 py-1 rounded-full backdrop-blur-md shadow-lg whitespace-nowrap border border-white/10">
            {tool.name}
          </span>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-navy-800 border-navy-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Tool</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete "{tool.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-navy-600 text-white hover:bg-navy-700">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDelete(tool.id)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}