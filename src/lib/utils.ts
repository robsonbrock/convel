import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCPF(cpf: string): string {
  const digits = cpf.replace(/\D/g, "");
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

export function validateCPF(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11 || /^(\d)\1+$/.test(digits)) return false;
  const calc = (end: number) =>
    digits
      .slice(0, end)
      .split("")
      .reduce((acc, d, i) => acc + +d * (end + 1 - i), 0);
  const r1 = (calc(9) * 10) % 11;
  const r2 = (calc(10) * 10) % 11;
  return (
    digits[9] === String(r1 < 10 ? r1 : 0) &&
    digits[10] === String(r2 < 10 ? r2 : 0)
  );
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("pt-BR");
}

export function daysSince(date: Date | string): number {
  const then = new Date(date);
  const thenMidnight = Date.UTC(then.getFullYear(), then.getMonth(), then.getDate());
  const now = new Date();
  const nowMidnight = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.floor((nowMidnight - thenMidnight) / (1000 * 60 * 60 * 24));
}

export function normalizeStr(s: string): string {
  return s.normalize("NFD").replace(/\p{Mn}/gu, "").toLowerCase();
}
