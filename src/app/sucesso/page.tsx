"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SucessoPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h2 className="text-2xl font-semibold">Relatório enviado!</h2>
      <p className="text-neutral-600 mt-2">
        Recebemos seu formulário e será analisado.
      </p>
      <div className="mt-6 flex items-center justify-center gap-3">
        <Link href="/">
          <Button>Enviar outro relatório</Button>
        </Link>
      </div>
    </main>
  );
}
