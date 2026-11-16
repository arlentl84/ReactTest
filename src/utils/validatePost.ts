export interface PostFormValues {
  title: string
  body: string
}

export type PostFormErrors = Partial<Record<keyof PostFormValues, string>>

export function validatePost(values: PostFormValues): PostFormErrors {
  const errors: PostFormErrors = {}
  if (!values.title.trim()) errors.title = 'El título es obligatorio.'
  if (!values.body.trim()) errors.body = 'El texto es obligatorio.'
  return errors
}