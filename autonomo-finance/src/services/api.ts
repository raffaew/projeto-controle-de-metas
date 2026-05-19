const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function api(path: string, options?: RequestInit) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers
    },
    ...options
  })

  if (!response.ok) {
    throw new Error('Erro na requisição')
  }

  return response.json()
}