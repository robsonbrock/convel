"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { validateCPF } from "@/lib/utils";

interface BorrowerFormData {
  name: string;
  cpf: string;
  address: string;
  phone: string;
  email: string;
}

function maskCPF(v: string) {
  return v.replace(/\D/g, "").slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function maskPhone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 10)
    return d.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d{1,4})$/, "$1-$2");
  return d.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d{1,4})$/, "$1-$2");
}

export default function NovoLeitorPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BorrowerFormData>();

  const onSubmit = async (data: BorrowerFormData) => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/leitores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.error ?? "Erro ao salvar leitor");
        return;
      }
      router.push("/leitores");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300";

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/leitores" className="p-2 rounded-xl hover:bg-white text-gray-500">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Cadastrar Leitor</h2>
          <p className="text-sm text-gray-500">Adicione um leitor para empréstimos</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Nome completo <span className="text-red-500">*</span>
            </label>
            <input
              {...register("name", { required: "Nome é obrigatório", minLength: { value: 3, message: "Mínimo 3 caracteres" } })}
              className={inputClass}
              placeholder="Ex: Maria das Graças Silva"
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              CPF <span className="text-red-500">*</span>
            </label>
            <input
              {...register("cpf", {
                required: "CPF é obrigatório",
                validate: (v) => validateCPF(v) || "CPF inválido",
              })}
              className={inputClass}
              placeholder="000.000.000-00"
              maxLength={14}
              onChange={(e) => setValue("cpf", maskCPF(e.target.value), { shouldValidate: false })}
            />
            {errors.cpf && <p className="text-xs text-red-500 mt-1">{errors.cpf.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Endereço <span className="text-red-500">*</span>
            </label>
            <input
              {...register("address", { required: "Endereço é obrigatório", minLength: { value: 5, message: "Mínimo 5 caracteres" } })}
              className={inputClass}
              placeholder="Ex: Rua das Flores, 123, São Paulo, SP"
            />
            {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Telefone <span className="text-red-500">*</span>
              </label>
              <input
                {...register("phone", {
                  required: "Telefone é obrigatório",
                  validate: (v) => v.replace(/\D/g, "").length >= 10 || "Telefone inválido",
                })}
                className={inputClass}
                placeholder="(11) 99999-9999"
                maxLength={15}
                onChange={(e) => setValue("phone", maskPhone(e.target.value), { shouldValidate: false })}
              />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">E-mail (opcional)</label>
              <input
                type="email"
                {...register("email", {
                  validate: (v) =>
                    !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "E-mail inválido",
                })}
                className={inputClass}
                placeholder="leitor@email.com"
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 rounded-xl px-4 py-3 text-sm">{error}</div>
          )}

          <div className="flex gap-3 pt-2">
            <Link
              href="/leitores"
              className="flex-1 text-center border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              {saving ? "Salvando..." : "Cadastrar Leitor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
