"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { UserCircle, CheckCircle } from "lucide-react";
import { MOCK_SESSION } from "@/lib/auth";

interface FormData {
  fullName: string;
  newPassword: string;
  confirmPassword: string;
}

export default function PerfilPage() {
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { fullName: MOCK_SESSION.fullName },
  });

  const newPassword = watch("newPassword");

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch("/api/perfil", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.error ?? "Erro ao salvar perfil");
        return;
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-300";

  return (
    <div className="space-y-4 max-w-xl">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Meu Perfil</h2>
        <p className="text-sm text-gray-500">Edite suas informações pessoais</p>
      </div>

      {/* Avatar card */}
      <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-2xl font-bold">
          {MOCK_SESSION.fullName.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-gray-800">{MOCK_SESSION.fullName}</p>
          <p className="text-sm text-gray-500">{MOCK_SESSION.email}</p>
          <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
            {MOCK_SESSION.isSuperAdmin ? "Super Admin" : "Admin"}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm flex items-center gap-2 mb-5">
            <CheckCircle className="w-4 h-4" />
            Perfil atualizado com sucesso!
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome completo</label>
            <input
              {...register("fullName", { required: "Nome é obrigatório", minLength: { value: 3, message: "Mínimo 3 caracteres" } })}
              className={inputClass}
            />
            {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">E-mail</label>
            <input
              value={MOCK_SESSION.email}
              disabled
              className="w-full border border-gray-100 bg-gray-50 rounded-xl px-3.5 py-2.5 text-sm text-gray-400 cursor-not-allowed"
            />
            <p className="text-xs text-gray-400 mt-1">O e-mail não pode ser alterado.</p>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <p className="text-sm font-medium text-gray-700 mb-4">Alterar senha (opcional)</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nova senha</label>
                <input
                  type="password"
                  {...register("newPassword", {
                    minLength: { value: 6, message: "Mínimo 6 caracteres" },
                  })}
                  className={inputClass}
                  placeholder="Deixe em branco para manter a atual"
                />
                {errors.newPassword && <p className="text-xs text-red-500 mt-1">{errors.newPassword.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirmar nova senha</label>
                <input
                  type="password"
                  {...register("confirmPassword", {
                    validate: (v) =>
                      !newPassword || v === newPassword || "As senhas não coincidem",
                  })}
                  className={inputClass}
                  placeholder="Repita a nova senha"
                />
                {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>}
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 rounded-xl px-4 py-3 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-green-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-60"
          >
            {saving ? "Salvando..." : "Salvar Alterações"}
          </button>
        </form>
      </div>
    </div>
  );
}
