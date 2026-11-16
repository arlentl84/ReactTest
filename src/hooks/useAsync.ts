import { useCallback, useEffect, useState } from 'react'

export type AsyncState<T> =
  | { status: 'loading' }
  | { status: 'error'; error: Error }
  | { status: 'success'; data: T }

export function useAsync<T>(loader: (signal: AbortSignal) => Promise<T>) {
  const [state, setState] = useState<AsyncState<T>>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)  
 
  const [prevDeps, setPrevDeps] = useState({ loader, attempt })
  
  if (prevDeps.loader !== loader || prevDeps.attempt !== attempt) {
    setPrevDeps({ loader, attempt })
    setState({ status: 'loading' })
  }

  useEffect(() => {
    const controller = new AbortController()   

    loader(controller.signal).then(
      (data) => {
        if (!controller.signal.aborted) setState({ status: 'success', data })
      },
      (error: unknown) => {
        if (controller.signal.aborted) return
        setState({
          status: 'error',
          error: error instanceof Error ? error : new Error(String(error)),
        })
      },
    )

    return () => controller.abort()
  }, [loader, attempt])

  const retry = useCallback(() => setAttempt((n) => n + 1), [])

  return { state, retry }
}