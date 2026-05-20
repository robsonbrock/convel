import { UserRole } from './types';

export type Permission =
  | 'admin_usuarios'
  | 'admin_categorias'
  | 'admin_autores'
  | 'manage_livros'
  | 'manage_leitores'
  | 'register_venda'
  | 'register_emprestimo';

// Define qual role tem acesso a qual feature
const rolePermissions: Record<UserRole, Permission[]> = {
  super_admin: [
    'admin_usuarios',
    'admin_categorias',
    'admin_autores',
    'manage_livros',
    'manage_leitores',
    'register_venda',
    'register_emprestimo',
  ],
  admin: [
    'admin_categorias',
    'admin_autores',
    'manage_livros',
    'manage_leitores',
    'register_venda',
    'register_emprestimo',
  ],
  vendedor: [
    'manage_livros', // apenas leitura
    'manage_leitores',
    'register_venda',
    'register_emprestimo',
  ],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) || false;
}

export function canAccessRoute(role: UserRole, route: string): boolean {
  if (route === '/dashboard' || route === '/') return true;

  if (route.startsWith('/admin')) return role === 'super_admin' || role === 'admin';
  if (route.startsWith('/livros')) return true;
  if (route.startsWith('/leitores')) return role === 'super_admin' || role === 'admin';
  if (route.startsWith('/vendas')) return true;
  if (route.startsWith('/emprestimos')) return true;

  return false;
}

// Menu items por role
export interface MenuItem {
  label: string;
  href: string;
  icon: string;
  roles: UserRole[];
  disabled?: boolean;
}

export const menuItems: MenuItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: '📊',
    roles: ['super_admin', 'admin', 'vendedor'],
  },
  {
    label: 'Usuários',
    href: '/admin/usuarios',
    icon: '👥',
    roles: ['super_admin'],
  },
  {
    label: 'Categorias',
    href: '/admin/categorias',
    icon: '📚',
    roles: ['super_admin', 'admin'],
  },
  {
    label: 'Autores',
    href: '/admin/autores',
    icon: '✍️',
    roles: ['super_admin', 'admin'],
  },
  {
    label: 'Livros',
    href: '/livros',
    icon: '📖',
    roles: ['super_admin', 'admin', 'vendedor'],
  },
  {
    label: 'Leitores',
    href: '/leitores',
    icon: '👤',
    roles: ['super_admin', 'admin'],
  },
  {
    label: 'Vendas',
    href: '/vendas',
    icon: '💰',
    roles: ['super_admin', 'admin', 'vendedor'],
    disabled: true,
  },
  {
    label: 'Empréstimos',
    href: '/emprestimos',
    icon: '🔄',
    roles: ['super_admin', 'admin', 'vendedor'],
    disabled: true,
  },
];
