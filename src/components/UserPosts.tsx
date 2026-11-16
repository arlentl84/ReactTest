import { useCallback } from 'react'
import { createPost, getPostsByUser } from '../services/api'
import type { Post, User } from '../types'
import { useAsync } from '../hooks/useAsync'
import type { PostFormValues } from '../utils/validatePost'
import { NewPostForm } from './NewPostForm'
import { ErrorMessage, Loading } from './Status'

interface UserPostsProps {
  user: User  
  createdPosts: Post[]
  onPostCreated: (post: Post) => void
}

export function UserPosts({ user, createdPosts, onPostCreated }: UserPostsProps) {
  const loadPosts = useCallback((signal: AbortSignal) => getPostsByUser(user.id, signal), [user.id])
  const { state, retry } = useAsync(loadPosts)

  async function handleCreate(values: PostFormValues) {
    const saved = await createPost({ ...values, userId: user.id })
    onPostCreated(saved)
  }

  return (
    <section className="panel" aria-labelledby="posts-title">
      <h2 id="posts-title">Publicaciones de {user.name}</h2>

      <NewPostForm onSubmit={handleCreate} />

      {state.status === 'loading' && <Loading label="Cargando publicaciones…" />}

      {state.status === 'error' && (
        <ErrorMessage message="No se pudieron cargar las publicaciones." onRetry={retry} />
      )}

      {state.status === 'success' && (
        <PostList posts={[...createdPosts, ...state.data]} newIds={createdPosts.map((p) => p.id)} />
      )}
    </section>
  )
}

function PostList({ posts, newIds }: { posts: Post[]; newIds: number[] }) {
  if (posts.length === 0) return <p className="empty">Este usuario aún no tiene publicaciones.</p>

  return (
    <ul className="post-list" aria-label="Publicaciones">
      {posts.map((post) => (
        <li key={post.id} className="post">
          <h3 className="post__title">
            {post.title}
            {newIds.includes(post.id) && <span className="badge">Nueva</span>}
          </h3>
          <p className="post__body">{post.body}</p>
        </li>
      ))}
    </ul>
  )
}
