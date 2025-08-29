"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const schema = z.object({
  nome: z.string().min(2, "Informe o nome"),
  cidade: z.string().min(2, "Informe a cidade"),
  telefone: z.string().min(10, "Telefone inválido"),
  iniciaEm: z.string().min(1, "Informe a data"),
  contrato: z.string().min(1, "Informe o tipo de contrato"),
  cargoDe: z.string().min(1, "Informe o cargo"),
  turno: z.string().min(1, "Informe o turno"),
  valorVT: z.string().min(1, "Informe o valor de VT"),
  chavePix: z.string().min(1, "Informe a chave PIX"),
  banco: z.string().min(1, "Informe o banco"),
  supervisorResponsavel: z.string().min(2, "Informe o supervisor"),
  website: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function Home() {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    if (values.website && values.website.trim().length > 0) {
      return; // honeypot
    }
    setLoading(true);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Falha ao enviar");
      }
      window.location.href = "/sucesso";
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Erro ao enviar o relatório";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const maskPhone = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 11);
    const part1 = digits.slice(0, 2);
    const part2 = digits.slice(2, 7);
    const part3 = digits.slice(7, 11);
    if (digits.length <= 2) return `(${part1}`;
    if (digits.length <= 7) return `(${part1}) ${part2}`;
    return `(${part1}) ${part2}-${part3}`;
  };

  return (
    <main className="mx-auto max-w-2xl rounded px-4 py-2">
      <Card>
        <CardHeader>
          <CardTitle>Enviar cadastro</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-sm font-medium">NOME</label>
              <Input placeholder="Digite o nome" {...register("nome")} />
              {errors.nome && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.nome.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">CIDADE</label>
              <Input placeholder="Ex.: São Paulo" {...register("cidade")} />
              {errors.cidade && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.cidade.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">TELEFONE</label>
              <Input
                placeholder="(99) 99999-9999"
                {...register("telefone")}
                onChange={(e) => {
                  e.target.value = maskPhone(e.target.value);
                }}
              />
              {errors.telefone && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.telefone.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">ÍNICIA EM</label>
                <Input type="date" {...register("iniciaEm")} />
                {errors.iniciaEm && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.iniciaEm.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium">CONTRATO</label>
                <Input placeholder="Ex.: CLT, PJ" {...register("contrato")} />
                {errors.contrato && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.contrato.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">CARGO DE</label>
                <Input
                  placeholder="Ex.: Auxiliar de Limpeza"
                  {...register("cargoDe")}
                />
                {errors.cargoDe && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.cargoDe.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium">TURNO</label>
                <Input
                  placeholder="Ex.: Manhã, Tarde, Noite"
                  {...register("turno")}
                />
                {errors.turno && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.turno.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">VALOR VT</label>
                <Input placeholder="Ex.: 12,00" {...register("valorVT")} />
                {errors.valorVT && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.valorVT.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium">CHAVE PIX</label>
                <Input
                  placeholder="CPF, Email ou Celular"
                  {...register("chavePix")}
                />
                {errors.chavePix && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.chavePix.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">BANCO</label>
                <Input placeholder="Ex.: Nubank" {...register("banco")} />
                {errors.banco && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.banco.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium">
                  SUPERVISOR RESPONSÁVEL
                </label>
                <Input
                  placeholder="Nome do supervisor"
                  {...register("supervisorResponsavel")}
                />
                {errors.supervisorResponsavel && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.supervisorResponsavel.message}
                  </p>
                )}
              </div>
            </div>

            <input
              type="text"
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
              {...register("website")}
            />

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Enviando..." : "Enviar cadastro"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
