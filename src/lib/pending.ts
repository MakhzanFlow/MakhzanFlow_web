export interface PendingJoin {
  companyName: string
  inviteCode: string
  createdAt: string // ISO
  companyId?: string | null
  requestId?: string | null
}

const KEY = 'mf_pending_join'

export function getPendingJoin(): PendingJoin | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as PendingJoin) : null
  } catch {
    return null
  }
}

export function setPendingJoin(data: PendingJoin) {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEY, JSON.stringify(data))
}

export function clearPendingJoin() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(KEY)
}
