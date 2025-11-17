import { NextResponse } from "next/server"

interface TranslateRequestBody {
  texts: string[]
  to: string
  from?: string
}

async function translateWithAzure(texts: string[], to: string, from?: string) {
  const key = process.env.AZURE_TRANSLATOR_KEY
  const region = process.env.AZURE_TRANSLATOR_REGION
  const endpoint = process.env.AZURE_TRANSLATOR_ENDPOINT || "https://api.cognitive.microsofttranslator.com"
  if (!key || !region) return null

  const params = new URLSearchParams({ "api-version": "3.0", to })
  if (from) params.append("from", from)

  const body = texts.map((t) => ({ Text: t }))

  const res = await fetch(`${endpoint}/translate?${params.toString()}`, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": key,
      "Ocp-Apim-Subscription-Region": region,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Azure translation error: ${text}`)
  }

  const data = (await res.json()) as Array<{ translations: Array<{ to: string; text: string }> }>
  return data.map((d) => d.translations?.[0]?.text ?? "")
}

async function translateWithOpenAI(texts: string[], to: string, from?: string) {
  const key = process.env.OPENAI_API_KEY
  if (!key) return null

  const system = `You are a translation engine. Translate the provided strings to the target language. Preserve numbers, punctuation, placeholders, and emojis. Respond ONLY with a JSON object of the form {"translations": ["...", "...", ...]} where the array has the same length and order as the input.`
  const user = JSON.stringify({ target: to, source: from || "auto", strings: texts })

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0,
      response_format: { type: "json_object" },
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`OpenAI translation error: ${text}`)
  }

  const data = await res.json()
  const content = data?.choices?.[0]?.message?.content
  let parsed: any
  try {
    parsed = JSON.parse(content)
  } catch (e) {
    parsed = null
  }
  const arr: string[] | undefined = parsed?.translations
  if (!Array.isArray(arr)) throw new Error("Invalid OpenAI translation response schema")
  return arr
}

export async function POST(req: Request) {
  try {
    const { texts, to, from } = (await req.json()) as TranslateRequestBody

    if (!Array.isArray(texts) || !to) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    let translations: string[] | null = null

    try {
      translations = await translateWithAzure(texts, to, from)
    } catch (e) {
      // continue to fallback
    }

    if (!translations) {
      try {
        translations = await translateWithOpenAI(texts, to, from)
      } catch (e) {
        // no further fallback
      }
    }

    if (!translations) {
      return NextResponse.json({ error: "No translation provider configured or provider failed" }, { status: 500 })
    }

    return NextResponse.json({ translations })
  } catch (err) {
    return NextResponse.json({ error: "Translation failed" }, { status: 500 })
  }
}
