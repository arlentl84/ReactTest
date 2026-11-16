import type { NewPost, Post, User } from './types'

export const API_URL = 'https://jsonplaceholder.typicode.com'

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }

  async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, init)
  if (!response.ok) {
    throw new ApiError(response.status, `La API respondió ${response.status} en ${path}`)
  }
  return (await response.json()) as T
 }

 export function getUsers(signal?: AbortSignal): Promise<User[]> {
  return request<User[]>('/users', { signal })
}

export function getPostsByUser(userId: number, signal?: AbortSignal): Promise<Post[]> {
  return request<Post[]>(`/users/${userId}/posts`, { signal })
}

export function createPost(post: NewPost): Promise<Post> {
  return request<Post>('/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    body: JSON.stringify(post),
  })
}
}