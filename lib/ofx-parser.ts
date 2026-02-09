export interface OFXTransaction {
  type: "income" | "expense"
  amount: number
  description: string
  date: Date
  fitid: string
}

export function parseOFX(ofxContent: string): OFXTransaction[] {
  const transactions: OFXTransaction[] = []
  
  // Regex para encontrar blocos STMTTRN
  const stmttrnRegex = /<STMTTRN>([\s\S]*?)<\/STMTTRN>/g
  let match

  while ((match = stmttrnRegex.exec(ofxContent)) !== null) {
    const block = match[1]
    
    const trntype = /<TRNTYPE>(.*)/.exec(block)?.[1]?.trim()
    const dtposted = /<DTPOSTED>(.*)/.exec(block)?.[1]?.trim()
    const trnamt = /<TRNAMT>(.*)/.exec(block)?.[1]?.trim()
    const memo = /<MEMO>(.*)/.exec(block)?.[1]?.trim()
    const fitid = /<FITID>(.*)/.exec(block)?.[1]?.trim() || Math.random().toString(36).substring(7)

    if (dtposted && trnamt && memo) {
      // Formato data OFX: YYYYMMDDHHMMSS
      const year = parseInt(dtposted.substring(0, 4))
      const month = parseInt(dtposted.substring(4, 6)) - 1
      const day = parseInt(dtposted.substring(6, 8))
      const date = new Date(year, month, day)

      const amount = parseFloat(trnamt.replace(',', '.'))
      const type = amount > 0 ? "income" : "expense"

      transactions.push({
        type,
        amount: Math.abs(amount),
        description: memo,
        date,
        fitid
      })
    }
  }

  return transactions
}
