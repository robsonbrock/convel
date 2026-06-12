import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getSupabase } from './supabase';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here-min-32-chars';

export interface LoginCredentials {
  cpf: string;
  email: string;
  senha: string;
}

export interface UsuarioSession {
  id: string;
  cpf?: string | null;
  nome?: string | null;
  email: string;
  apelido?: string | null;
  role: 'super_admin' | 'admin' | 'vendedor' | 'operador';
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Compare password
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Generate JWT token
export function generateToken(usuario: UsuarioSession): string {
  return jwt.sign(usuario, JWT_SECRET, { expiresIn: '7d' });
}

// Verify JWT token
export function verifyToken(token: string): UsuarioSession | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded as UsuarioSession;
  } catch {
    return null;
  }
}

// Login
export async function loginUsuario(credentials: LoginCredentials): Promise<{ token: string; usuario: UsuarioSession } | null> {
  try {
    const { data, error } = await getSupabase()
      .from('usuarios')
      .select('id, cpf, nome, email, role, senha')
      .eq('cpf', credentials.cpf)
      .single();

    if (error || !data) {
      return null;
    }

    const passwordValid = await comparePassword(credentials.senha, data.senha);
    if (!passwordValid) {
      return null;
    }

    const usuario: UsuarioSession = {
      id: data.id,
      cpf: data.cpf,
      nome: data.nome,
      email: data.email,
      role: data.role,
    };

    const token = generateToken(usuario);
    return { token, usuario };
  } catch {
    return null;
  }
}

// Get session from token
export function getSessionFromToken(token: string): UsuarioSession | null {
  return verifyToken(token);
}

// Create new user (only super_admin)
export async function criarUsuario(
  email: string,
  role: 'super_admin' | 'admin' | 'vendedor' | 'operador',
  cpf?: string | null,
  nome?: string | null,
  senha?: string | null,
  telefone?: string,
  endereco?: string,
): Promise<UsuarioSession | null> {
  try {
    const senhaHash = senha ? await hashPassword(senha) : null;

    const { data, error } = await getSupabase()
      .from('usuarios')
      .insert([
        {
          email,
          role,
          cpf: cpf || null,
          nome: nome || null,
          senha: senhaHash,
          telefone: telefone || null,
          endereco: endereco || null,
          status: 'pendente',
        },
      ])
      .select('id, email, nome, apelido, role, status')
      .single();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      email: data.email,
      nome: data.nome,
      apelido: data.apelido,
      role: data.role,
    };
  } catch {
    return null;
  }
}
