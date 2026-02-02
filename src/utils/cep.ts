export async function fetchAddressByCep(cep: string) {
  const cleanCep = cep.replace(/\D/g, '')
  if (cleanCep.length !== 8) return null
  const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
  if (!res.ok) return null
  const data = await res.json()
  if (data.erro) return null
  return {
    street: data.logradouro || '',
    city: data.localidade || '',
    cep: data.cep || '',
  }
}

export function maskCep(value: string) {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{3})\d+?$/, '$1')
}
