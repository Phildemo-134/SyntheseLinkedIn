import { useState } from 'react'

function App() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')

  async function handleSummarize() {
    if (!input.trim()) {
      setResult('')
      return
    }
    setLoading(true)
    setError('')
    setResult('')
    try {
      const resp = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input }),
      })
      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}))
        throw new Error(data?.error || `HTTP ${resp.status}`)
      }
      const data = await resp.json()
      setResult(data.result || '')
    } catch (e: any) {
      setError(e?.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy() {
    if (!result) return
    try {
      await navigator.clipboard.writeText(result)
    } catch (e) {
      // noop
    }
  }

  const charactersCount = input.length

  return (
    <div className="min-h-screen mx-auto max-w-5xl px-6 py-10 flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold tracking-tight">
            <span className="bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">Synthèse LinkedIn</span>
          </h1>
          <span className="text-xs text-slate-500">v0.1</span>
        </div>
        <p className="text-sm text-slate-400">Générez une publication claire et concise à partir d'un texte.</p>
      </header>

      <main className="rounded-2xl border border-slate-800 bg-slate-900/40 shadow-xl shadow-slate-950/40 backdrop-blur-sm divide-y divide-slate-800">
        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 md:gap-8">
          <section className="flex flex-col gap-3">
            <label htmlFor="source" className="text-sm font-medium text-slate-200">Texte source</label>
            <textarea
              id="source"
              className="w-full rounded-xl border border-slate-700/70 bg-slate-950/60 text-slate-100 p-4 resize-y shadow-inner placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600/40 focus:border-slate-600"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Collez votre article ou texte ici..."
              rows={12}
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">{charactersCount.toLocaleString()} caractères</span>
              <div className="flex gap-2">
                <button
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3.5 py-2 text-white shadow-sm shadow-blue-950/30 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600/40 disabled:opacity-60 disabled:cursor-not-allowed"
                  onClick={handleSummarize}
                  disabled={!input.trim() || loading}
                >
                  {loading && (
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                  )}
                  <span>Synthétiser</span>
                </button>
                <button
                  className="inline-flex items-center rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-slate-100 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-600/40 disabled:opacity-60 disabled:cursor-not-allowed"
                  onClick={() => { setInput(''); setResult(''); setError('') }}
                  disabled={!input && !result && !error}
                >
                  Effacer
                </button>
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-200">Publication</label>
              <div className="flex items-center gap-2">
                <button
                  className="inline-flex items-center rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs text-slate-200 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-600/40 disabled:opacity-60 disabled:cursor-not-allowed"
                  onClick={handleCopy}
                  disabled={!result}
                  title="Copier"
                >
                  Copier
                </button>
              </div>
            </div>
            <div className="min-h-48 rounded-xl border border-slate-700/70 bg-slate-950/50 text-slate-100 p-4 whitespace-pre-wrap">
              {loading ? (
                <div className="space-y-2">
                  <div className="h-3 w-2/3 animate-pulse rounded bg-slate-700/60"></div>
                  <div className="h-3 w-5/6 animate-pulse rounded bg-slate-700/50"></div>
                  <div className="h-3 w-3/4 animate-pulse rounded bg-slate-700/40"></div>
                </div>
              ) : error ? (
                <div className="text-sm text-red-400">Erreur: {error}</div>
              ) : (
                result || <span className="text-sm text-slate-400">Le résumé apparaîtra ici.</span>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default App
