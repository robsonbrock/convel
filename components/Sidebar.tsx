'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UsuarioSession } from '@/lib/auth';
import { menuItems } from '@/lib/permissions';
import { useState } from 'react';

interface SidebarProps {
  usuario: UsuarioSession;
}

export function Sidebar({ usuario }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const visibleItems = menuItems.filter(item =>
    item.roles.includes(usuario.role)
  );

  return (
    <aside className={`bg-white border-r border-gray-200 transition-all duration-300 ${
      collapsed ? 'w-20' : 'w-64'
    } fixed h-screen overflow-y-auto`}>
      <div className="p-4 flex items-center justify-between">
        {!collapsed && <span className="font-bold text-gray-900">Menu</span>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      <nav className="px-2 py-4 space-y-2">
        {visibleItems.map(item => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              title={collapsed ? item.label : ''}
            >
              <span className="text-xl">{item.icon}</span>
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
