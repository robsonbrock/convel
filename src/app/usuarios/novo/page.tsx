"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { ArrowLeft, Copy, CheckCircle } from "lucide-react";
import Link from "next/link";

interface FormData {
  fullName: string;
  email: string;
}

interface CreatedUser {
  id: number;
  fullName: string;
  email: string;
  tempPassword: string;
}

export default function NovoUsuarioPage() {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState<CreatedUser | null>(null);
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.error ?? "Erro ao cadastrar usuário");
        return;
      }
      const user = await res.json();
      setCreated(user);
      reset();
    } finally {
      setSaving(false);
    }
  };

  const copyPassword = () => {
    if (created) {
      navigator.clipboard.writeText(created.tempPassword);
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
          <h2 className="text-2xl font-bold text-gray-800">Novo Usuário Admin</h2>
          <p className="text-sm text-gray-500">Cadastre um voluntário como administrador</p>
        </div>
      </div>

      {created && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="font-semibold text-green-800">Usuário cadastrado com sucesso!</p>
          </div>
          <p className="text-sm text-green-700 mb-3">
            Anote a senha temporária abaixo e repasse para <strong>{created.fullName}</strong>.
          </p>
          <div className="flex items-center gap-3 bg-white rounded-xl border border-green-200 px-4 py-3">
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-0.5">Senha temporária</p>
              <p className="font-mono font-bold text-gray-800 text-lg tracking-wider">{created.tempPassword}</p>
            </div>
            <button
              onClick={copyPassword}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
            >
              {copied ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <button
            onClick={() => setCreated(null)}
            className="mt-3 text-sm text-green-700 hover:underline"
          >
            Cadastrar outro usuário
          </button>
        </div>
      )}

      {!created && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Nome completo <span className="text-red-500">*</span>
              </label>
              <input
                {...register("fullName", { required: "Nome é obrigatório", minLength: { value: 3, message: "Mínimo 3 caracteres" } })}
                className={inputClass}
                placeholder="Ex: Ana Paula Voluntária"
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
                placeholder="voluntaria@email.com"
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
              <p className="text-xs text-gray-400 mt-1">
                Uma senha temporária será gerada e exibida na tela após o cadastro.
              </p>
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
                {saving ? "Cadastrando..." : "Cadastrar Admin"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
