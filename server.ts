import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import Anthropic from '@anthropic-ai/sdk'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json({ limit: '1mb' }))

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const prompt = (article: string) => {
  return `Tu es un expert en copywriting LinkedIn et storytelling.
  Ta tâche consiste à transformer l'article suivant en publications LinkedIn captivantes, engageantes et percutantes,
  fidèles au ton et au style de l'auteur de l'article.

  Consignes:
  - Synthétise les idées principales de l'article sans le dénaturer
  - Commence par une phrase forte ou une question intrigante pour capter l'attention.
  - Privilégie des phrases courtes, des sauts de ligne et éventuellement des emojis pertinents pour dynamiser le texte.
  - Termine par une phrase qui invite à l'action (poser une question, inviter à commenter/partager).
  - Rajoute un lien vers mon blog http://monblog.com quand pertinent.
  - Joins 5 à 8 hashtags pertinents et tendances liés au contenu.

  Format de sortie STRICTEMENT JSON (pas de texte hors JSON, pas de code fences) avec la structure suivante:
  {
    "title": string,
    "summaries": [string, string, string],
  }
  Contraintes:
  - "title": court, percutant (max 80 caractères)
  - "summaries": 3 variantes ~200 caractères chacune

  L'article est le suivant:
  ${article}`
}


app.post('/api/summarize', async (req, res) => {
  try {
    const { text } = req.body ?? {}
    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: 'Missing text' })
    }

    const msg = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [
        { role: 'user', content: prompt(text) }
      ]
    })

    const content = msg.content?.[0]
    const raw = typeof content === 'object' && 'text' in content ? (content as any).text : String(msg.content)

    // Try to extract strict JSON from the model output
    const sanitize = (s: string) => {
      const withoutFences = s.replace(/^```(?:json)?\n?/i, '').replace(/\n?```\s*$/i, '')
      const start = withoutFences.indexOf('{')
      const end = withoutFences.lastIndexOf('}')
      if (start === -1 || end === -1 || end <= start) return null
      return withoutFences.slice(start, end + 1).trim()
    }

    let title = ''
    let summaries: string[] = []
    try {
      const jsonCandidate = sanitize(raw) ?? raw
      const obj = JSON.parse(jsonCandidate)
      if (typeof obj?.title === 'string') title = obj.title
      if (Array.isArray(obj?.summaries)) {
        summaries = obj.summaries.filter((s: any) => typeof s === 'string').slice(0, 3)
      }
    } catch {
      // leave parsed fields empty; frontend will fallback to raw
    }

    if (title && summaries.length === 3) {
      return res.json({ title, summaries, raw })
    }
    return res.json({ raw })
  } catch (err: any) {
    const message = err?.message || 'Unknown error'
    return res.status(500).json({ error: message })
  }
})

const port = process.env.PORT ? Number(process.env.PORT) : 8787
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${port}`)
})


