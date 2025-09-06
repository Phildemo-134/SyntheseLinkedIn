import { useState } from 'react'

function App() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<string>('')

  function handleSummarize() {
    if (!input.trim()) {
      setResult('')
      return
    }
    const normalized = input.trim().replace(/\s+/g, ' ')
    const max = 220
    const preview = normalized.slice(0, max)
    setResult(`Résumé: ${preview}${normalized.length > max ? '…' : ''}`)
  }

  return (
    <div className="min-h-screen mx-auto max-w-5xl p-6 flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Synthèse LinkedIn</h1>
        <p className="text-sm text-slate-400">Générez une publication à partir d'un texte</p>
      </header>

      <main className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
        <section className="flex flex-col gap-2">
          <label htmlFor="source" className="font-semibold">Texte source</label>
          <textarea
            id="source"
            className="w-full rounded-lg border border-slate-700 bg-slate-900 text-slate-100 p-3 resize-y focus:outline-none focus:ring-2 focus:ring-slate-600"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Collez votre article ou texte ici..."
            rows={10}
          />
          <div className="flex gap-2">
            <button className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-2 text-white hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed" onClick={handleSummarize} disabled={!input.trim()}>
              Synthétiser
            </button>
            <button className="inline-flex items-center rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100 hover:bg-slate-700 disabled:opacity-60 disabled:cursor-not-allowed" onClick={() => { setInput(''); setResult('') }} disabled={!input && !result}>
              Effacer
            </button>
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <label className="font-semibold">Publication</label>
          <div className="min-h-40 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 p-3">
            {result || 'Le résumé apparaîtra ici.'}
          </div>
        </section>
      </main>

      <footer className="flex justify-end text-xs text-slate-500">
        <span>v0.1</span>
      </footer>
    </div>
  )
}

export default App
