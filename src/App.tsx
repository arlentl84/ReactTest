import { useState, useCallback } from 'react'
import type { User, Post } from './types'
import { UserList } from './components/UserList'
import { UserPosts } from './components/UserPosts'

function App() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)   
  const [createdPosts, setCreatedPosts] = useState<Post[]>([])

  const handlePostCreated = useCallback((post: Post) => {    
    const local = { ...post, id: crypto.randomUUID() as unknown as number }
    setCreatedPosts((prev) => [local, ...prev])
  }, [])

   const userCreatedPosts = selectedUser
    ? createdPosts.filter((p) => p.userId === selectedUser.id)
    : []

  return (
    <div className="layout">
      <header className="layout__header">
        <h1>Usuarios y publicaciones</h1>
        <p>Datos de JSONPlaceholder. Las publicaciones nuevas solo viven en esta sesión.</p>
      </header>
      <main className="layout__main">
        <UserList selectedUserId={selectedUser?.id ?? null} onSelect={setSelectedUser} />
        {selectedUser ? (
          <UserPosts
            key={selectedUser.id}
            user={selectedUser}
            createdPosts={userCreatedPosts}
            onPostCreated={handlePostCreated}
          />
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
