import React from 'react';
import { Bell, User, LogOut, Menu } from 'lucide-react';
import { Button } from '../ui/Button';

interface HeaderProps {
  user?: {
    name: string;
    email: string;
  };
  onLogout: () => void;
  onToggleSidebar?: () => void;
  notificationCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onLogout,
  onToggleSidebar,
  notificationCount = 0
}) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <Menu size={20} />
              </button>
            )}
            <h1 className="ml-2 text-xl font-semibold text-gray-900">
              PillCare 360
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notificaciones */}
            <div className="relative">
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md">
                <Bell size={20} />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </button>
            </div>

            {/* Usuario */}
            <div className="flex items-center space-x-2">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
            </div>

            {/* Logout */}
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="hidden sm:flex items-center space-x-1"
            >
              <LogOut size={16} />
              <span>Salir</span>
            </Button>
            
            <button
              onClick={onLogout}
              className="sm:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};