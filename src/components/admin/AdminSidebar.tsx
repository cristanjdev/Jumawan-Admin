import { Link, useLocation } from 'react-router-dom'
import {
    LayoutDashboard,
    FolderOpen,
    Award,
    Briefcase,
    GraduationCap,
    MessageSquare,
    BarChart3,
    Settings,
    Sparkles,
    ImageIcon,
    Wrench
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface AdminSidebarProps {
    className?: string
    onItemClick?: () => void
}

export const AdminSidebar = ({ className, onItemClick }: AdminSidebarProps) => {
    const location = useLocation()

    const navItems = [
        { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/admin/hero', label: 'Hero', icon: Sparkles },
        { path: '/admin/about', label: 'About Section', icon: ImageIcon },
        { path: '/admin/skills', label: 'Skills', icon: Wrench },
        { path: '/admin/projects', label: 'Projects', icon: FolderOpen },
        { path: '/admin/certificates', label: 'Certificates', icon: Award },
        { path: '/admin/work-experience', label: 'Experience', icon: Briefcase },
        { path: '/admin/education', label: 'Education', icon: GraduationCap },
        { path: '/admin/tools', label: 'Tools', icon: Settings },
        { path: '/admin/contact', label: 'Messages', icon: MessageSquare },
        { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    ]

    const isActive = (path: string) => location.pathname === path

    return (
        <div className={cn("flex flex-col h-full bg-navy-800 border-r border-navy-700", className)}>
            <div className="h-16 flex items-center px-6 border-b border-navy-700">
                <Link to="/admin/dashboard" className="flex items-center gap-2" onClick={onItemClick}>
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">CJJ</span>
                    </div>
                    <span className="text-white font-bold text-lg">Admin Panel</span>
                </Link>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
                <nav className="space-y-1 px-3">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={onItemClick}
                                className={cn(
                                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                    isActive(item.path)
                                        ? "bg-navy-900 text-primary border-l-2 border-primary"
                                        : "text-gray-300 hover:bg-navy-700 hover:text-white"
                                )}
                            >
                                <Icon className="w-5 h-5 mr-3" />
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>
            </div>
        </div>
    )
}
