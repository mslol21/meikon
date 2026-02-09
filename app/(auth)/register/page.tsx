import { RegisterForm } from "@/components/auth/register-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"

export default function RegisterPage() {
  return (
    <div className="px-4">
      <div className="mb-8 text-center">
        <Link href="/" className="inline-flex items-center gap-2">
          <Image src="/meikon-icon.png" alt="MEIKon Logo" width={32} height={32} className="h-8 w-8" />
          <span className="text-2xl font-bold tracking-tight">
            <span className="text-[#0055CC]">MEI</span>
            <span className="text-primary">Kon</span>
          </span>
        </Link>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Criar Conta</CardTitle>
          <CardDescription>
            Preencha os dados abaixo para criar sua conta gratuita
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
          <div className="mt-4 text-center text-sm">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Entrar
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
