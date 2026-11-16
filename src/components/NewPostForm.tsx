import { useId, useRef, useState, type FormEvent } from 'react'
import { validatePost, type PostFormValues } from '../utils/validatePost'

const EMPTY: PostFormValues = { title: '', body: '' }

interface NewPostFormProps {
  onSubmit: (values: PostFormValues) => Promise<void>
}

export function NewPostForm({ onSubmit }: NewPostFormProps) {
  const id = useId()
  const [values, setValues] = useState<PostFormValues>(EMPTY)
  const [touched, setTouched] = useState<Partial<Record<keyof PostFormValues, boolean>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const titleRef = useRef<HTMLInputElement>(null)
  const bodyRef = useRef<HTMLTextAreaElement>(null)

  const errors = validatePost(values)  
  const visibleError = (field: keyof PostFormValues) => (touched[field] ? errors[field] : undefined)

  function update(field: keyof PostFormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setTouched({ title: true, body: true })
    setSubmitError(null)

    if (errors.title) return titleRef.current?.focus()
    if (errors.body) return bodyRef.current?.focus()

    setSubmitting(true)
    try {
      await onSubmit({ title: values.title.trim(), body: values.body.trim() })
      setValues(EMPTY)
      setTouched({})
    } catch {
      setSubmitError('No se pudo publicar. Inténtalo de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  const titleError = visibleError('title')
  const bodyError = visibleError('body')

  return (
    <form className="post-form" onSubmit={handleSubmit} noValidate aria-labelledby={`${id}-heading`}>
      <h3 id={`${id}-heading`}>Nueva publicación</h3>
      
      <div className="field">
        <label className="field__label" htmlFor={`${id}-title`}>
          Título
        </label>
        <input
          ref={titleRef}
          id={`${id}-title`}
          name="title"
          value={values.title}
          onChange={(e) => update('title', e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, title: true }))}
          aria-invalid={Boolean(titleError)}
          aria-describedby={titleError ? `${id}-title-error` : undefined}
          disabled={submitting}
        />
        {titleError && (
          <span id={`${id}-title-error`} className="field__error">
            {titleError}
          </span>
        )}
      </div>

      <div className="field">
        <label className="field__label" htmlFor={`${id}-body`}>
          Texto
        </label>
        <textarea
          ref={bodyRef}
          id={`${id}-body`}
          name="body"
          rows={4}
          value={values.body}
          onChange={(e) => update('body', e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, body: true }))}
          aria-invalid={Boolean(bodyError)}
          aria-describedby={bodyError ? `${id}-body-error` : undefined}
          disabled={submitting}
        />
        {bodyError && (
          <span id={`${id}-body-error`} className="field__error">
            {bodyError}
          </span>
        )}
      </div>

      {submitError && (
        <p className="status status--error" role="alert">
          {submitError}
        </p>
      )}

      <button type="submit" className="button" disabled={submitting}>
        {submitting ? 'Publicando…' : 'Publicar'}
      </button>
    </form>
  )
}