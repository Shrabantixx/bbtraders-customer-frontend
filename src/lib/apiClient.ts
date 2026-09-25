import { supabase } from './supabaseClient'

const API_URL = 'http://localhost:5000/api'

async function getAuthHeader(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function apiGet(path: string) {
  const headers = await getAuthHeader()
  const res = await fetch(`${API_URL}${path}`, { headers })
  if (!res.ok) throw new Error(`GET ${path} failed`)
  return res.json()
}

export async function apiPost(path: string, body: unknown) {
  const headers = await getAuthHeader()
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`POST ${path} failed`)
  return res.json()
}

export async function apiPut(path: string, body: unknown) {
  const headers = await getAuthHeader()
  const res = await fetch(`${API_URL}${path}`, {
    method: 'PUT',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`PUT ${path} failed`)
  return res.json()
}

export async function apiDelete(path: string) {
  const headers = await getAuthHeader()
  const res = await fetch(`${API_URL}${path}`, { method: 'DELETE', headers })
  if (!res.ok) throw new Error(`DELETE ${path} failed`)
}