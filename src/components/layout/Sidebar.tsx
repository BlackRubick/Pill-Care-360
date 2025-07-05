import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Pill, 
  Activity, 
  AlertTriangle, 
  Calendar,
  BarChart3,
  Settings,
  X
} from 'lucide-react';
import { NAVIGATION_ITEMS } from '../../routes/constants';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mapeo de iconos
const iconMap = {
  Home,
  Users,
  Pill,
  Activity,
  AlertTriangle,
  Calendar,
  BarChart3,
  Settings
};

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-20 md:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 transform transition-transform duration-300 ease-in-out
        md:translate-x-0 md:static md:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-4 bg-gray-800">
          <span className="text-white font-semibold text-lg">PillCare 360</span>
          <button
            onClick={onClose}
            className="md:hidden text-gray-300 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mt-8">
          <div className="px-2 space-y-1">
            {NAVIGATION_ITEMS.map((item) => {
              const Icon = iconMap[item.icon as keyof typeof iconMap];
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.key}
                  to={item.path}
                  onClick={() => window.innerWidth < 768 && onClose()}
                  className={`
                    group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors
                    ${isActive 
                      ? 'bg-gray-800 text-white' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }
                  `}
                >
                  <Icon 
                    size={20} 
                    className={`
                      mr-3 flex-shrink-0
                      ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}
                    `} 
                  />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </>
  );
};