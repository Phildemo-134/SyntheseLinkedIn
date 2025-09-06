import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import Anthropic from '@anthropic-ai/sdk'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json({ limit: '1mb' }))

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

app.post('/api/summarize', async (req, res) => {
  try {
    const { text } = req.body ?? {}
    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: 'Missing text' })
    }

    const prompt = `Tu es un assistant qui rédige une publication LinkedIn concise, claire et engageante en français, à partir du texte fourni.\n\nExigences:\n- 1 à 2 paragraphes courts (max ~120-160 mots au total)\n- Ton professionnel, moderne, accessible\n- Pas d’exagération ni d’emojis\n- Inclure 2-4 hashtags pertinents à la fin\n\nTexte source:\n"""\n${text}\n"""\n\nRédige la publication maintenant :`

    const msg = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      messages: [
        { role: 'user', content: prompt }
      ]
    })

    const content = msg.content?.[0]
    const output = typeof content === 'object' && 'text' in content ? (content as any).text : String(msg.content)
    return res.json({ result: output })
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


