import { useState } from 'react'
import type { User } from './types'
import { UserList } from './components/UserList'

function App() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)  
  
  return (
    <div className="layout">
      <header className="layout__header">
        <h1>Usuarios y publicaciones</h1>
        <p>Datos de JSONPlaceholder. Las publicaciones nuevas solo viven en esta sesión.</p>
      </header>
      <main className="layout__main">
        <UserList selectedUserId={selectedUser?.id ?? null} onSelect={setSelectedUser} />
        {selectedUser ? (
          <section className="panel panel--placeholder">
            <p className="empty">Usuario seleccionado: {selectedUser.name}</p>
          </section>
        ) : (
          <section className="panel panel--placeholder">
            <p className="empty">Elige un usuario para ver sus publicaciones.</p>
          </section>
        )}
      </main>
    </div>
  )
}

export default App
