"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ArrowLeft, Copy, CheckCircle } from "lucide-react";
import Link from "next/link";

interface User {
  id: number;
  fullName: string;
  email: string;
  isSuperAdmin: boolean;
}

interface FormData {
  fullName: string;
  email: string;
  resetPassword: boolean;
}

export default function EditarUsuarioForm({ user }: { user: User }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [newPassword, setNewPassword] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { fullName: user.fullName, email: user.email, resetPassword: false },
  });

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/usuarios/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.error ?? "Erro ao salvar usuário");
        return;
      }
      const result = await res.json();
      if (result.tempPassword) {
        setNewPassword(result.tempPassword);
      } else {
        router.push("/usuarios");
      }
    } finally {
      setSaving(false);
    }
  };

  const copyPassword = () => {
    if (newPassword) {
      navigator.clipboard.writeText(newPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300";

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/usuarios" className="p-2 rounded-xl hover:bg-white text-gray-500">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Editar Usuário Admin</h2>
          <p className="text-sm text-gray-500">{user.fullName}</p>
        </div>
      </div>

      {newPassword && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="font-semibold text-green-800">Senha resetada com sucesso!</p>
          </div>
          <p className="text-sm text-green-700 mb-3">
            Repasse a nova senha temporária para <strong>{user.fullName}</strong>.
          </p>
          <div className="flex items-center gap-3 bg-white rounded-xl border border-green-200 px-4 py-3">
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-0.5">Nova senha temporária</p>
              <p className="font-mono font-bold text-gray-800 text-lg tracking-wider">{newPassword}</p>
            </div>
            <button
              onClick={copyPassword}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
            >
              {copied ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <Link href="/usuarios" className="mt-3 text-sm text-green-700 hover:underline inline-block">
            Voltar para usuários
          </Link>
        </div>
      )}

      {!newPassword && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Nome completo <span className="text-red-500">*</span>
              </label>
              <input
                {...register("fullName", { required: "Nome é obrigatório", minLength: { value: 3, message: "Mínimo 3 caracteres" } })}
                className={inputClass}
              />
              {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                E-mail <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                {...register("email", { required: "E-mail é obrigatório" })}
                className={inputClass}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3">
              <input
                type="checkbox"
                id="resetPassword"
                {...register("resetPassword")}
                className="w-4 h-4 accent-gray-800"
              />
              <label htmlFor="resetPassword" className="text-sm text-gray-700 cursor-pointer">
                Resetar senha — uma nova senha temporária será gerada
              </label>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 rounded-xl px-4 py-3 text-sm">{error}</div>
            )}

            <div className="flex gap-3 pt-2">
              <Link
                href="/usuarios"
                className="flex-1 text-center border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-gray-800 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-60"
              >
                {saving ? "Salvando..." : "Salvar Alterações"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
