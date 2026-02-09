"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatCurrency } from "@/lib/utils"
import { Calculator, AlertCircle, Info } from "lucide-react"

export function TaxSimulator() {
  const [monthlyIncome, setMonthlyIncome] = useState(5000)
  
  const annualIncome = monthlyIncome * 12
  const meiLimit = 81000
  const isOverLimit = annualIncome > meiLimit
  
  // DAS MEI 2024 calculation (approximate)
  // Base: 5% of minimum wage (R$ 1.412,00) = R$ 70,60
  // + R$ 1,00 (ICMS - Trade) + R$ 5,00 (ISS - Service)
  const dasBase = 70.60
  const dasTotal = dasBase + 5.00 // Assuming service for simplicity or both
  
  const taxPercentage = (dasTotal / monthlyIncome) * 100
  
  // Simple ME (Simples Nacional) simulation (approx 6% for services)
  const meTaxRate = 0.06
  const meMonthlyTax = monthlyIncome * meTaxRate

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          <CardTitle>Simulador de Impostos</CardTitle>
        </div>
        <CardDescription>
          Compare sua carga tributária atual com outros modelos.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between">
            <Label>Faturamento Mensal Estimado</Label>
            <span className="font-bold text-primary">{formatCurrency(monthlyIncome)}</span>
          </div>
          <input
            type="range"
            value={monthlyIncome}
            onChange={(e) => setMonthlyIncome(parseInt(e.target.value))}
            min={0}
            max={15000}
            step={100}
            className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border p-3 bg-primary/5">
            <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Carga no MEI</p>
            <p className="text-2xl font-bold text-primary">{formatCurrency(dasTotal)}<span className="text-xs font-normal">/mês</span></p>
            <p className="text-[11px] text-muted-foreground mt-1">
              Equivale a <strong>{taxPercentage.toFixed(1)}%</strong> do seu faturamento.
            </p>
          </div>

          <div className="rounded-lg border p-3 bg-muted/50">
            <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Carga na Microempresa (ME)</p>
            <p className="text-2xl font-bold">{formatCurrency(meMonthlyTax)}<span className="text-xs font-normal">/mês</span></p>
            <p className="text-[11px] text-muted-foreground mt-1">
              Alíquota estimada de 6% (Simples Nacional).
            </p>
          </div>
        </div>

        {isOverLimit && (
          <div className="flex gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
            <div>
              <p className="text-sm font-bold text-destructive">Alerta de Desenquadramento!</p>
              <p className="text-xs text-destructive/80 leading-relaxed">
                Com esse faturamento anual ({formatCurrency(annualIncome)}), você ultrapassa o limite de R$ 81.000 do MEI. 
                Considere migrar para ME para evitar multas.
              </p>
            </div>
          </div>
        )}

        {!isOverLimit && monthlyIncome > 6000 && (
          <div className="flex gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <Info className="h-5 w-5 text-yellow-600 shrink-0" />
            <div>
              <p className="text-sm font-bold text-yellow-700">Atenção ao Limite</p>
              <p className="text-xs text-yellow-600/80 leading-relaxed">
                Você está próximo do limite mensal ideal (~R$ 6.750). Se o faturamento subir, o MEI pode não ser mais vantajoso.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
