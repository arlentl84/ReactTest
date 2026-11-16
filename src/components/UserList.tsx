import { useMemo, useState } from 'react'
import { getUsers } from '../services/api'
import type { User } from '../types'
import { useAsync } from '../hooks/useAsync'
import { normalize } from '../utils/normalize'
import { ErrorMessage, Loading } from './Status'

interface UserListProps {
  selectedUserId: number | null
  onSelect: (user: User) => void
}

export function UserList({ selectedUserId, onSelect }: UserListProps) { 
  const { state, retry } = useAsync(getUsers)
  const [query, setQuery] = useState('')

  const visibleUsers = useMemo(() => {
    if (state.status !== 'success') return []
    const needle = normalize(query)
    if (!needle) return state.data
    return state.data.filter((user) => normalize(user.name).includes(needle))
  }, [state, query])

  return (
    <section className="panel" aria-labelledby="users-title">
      <h2 id="users-title">Usuarios</h2>

      <label className="field">
        <span className="field__label">Buscar por nombre</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Buscar usuario"
          placeholder="Ej. Leanne"
          disabled={state.status !== 'success'}
        />
      </label>

      {state.status === 'loading' && <Loading label="Cargando usuarios…" />}

      {state.status === 'error' && (
        <ErrorMessage message="No se pudieron cargar los usuarios." onRetry={retry} />
      )}

      {state.status === 'success' &&
        (visibleUsers.length === 0 ? (
          <p className="empty">Ningún usuario coincide con «{query}».</p>
        ) : (
          <ul className="user-list">
            {visibleUsers.map((user) => (
              <li key={user.id}>
                <button
                  type="button"
                  className="user-list__item"
                  aria-pressed={user.id === selectedUserId}
                  onClick={() => onSelect(user)}
                >
                  <span className="user-list__name">{user.name}</span>
                  <span className="user-list__meta">@{user.username}</span>
                </button>
              </li>
            ))}
          </ul>
        ))}
    </section>
  )
}