import { LoginForm } from "@/components/auth/login-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"

export default function LoginPage() {
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
          <CardTitle>Entrar</CardTitle>
          <CardDescription>
            Entre com suas credenciais para acessar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <div className="mt-4 text-center text-sm">
            Não tem uma conta?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Cadastre-se
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
