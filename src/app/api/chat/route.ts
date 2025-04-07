import { convertToCoreMessages, Message, streamText } from "ai";

import { withAuth } from '@/utils/auth-check'
import { openai } from "@ai-sdk/openai";
import { Pica } from "@picahq/ai";

export const POST = withAuth(async (req) => {
  try {
    const { messages, id: chatId }: { messages: Message[], id: string } = await req.json();

    const referer = req.headers.get('referer')
    const isSharePage = referer?.includes('/share/')

    if (isSharePage) {
      return new Response('Chat API is not available on share pages', {
        status: 403,
        statusText: 'Forbidden'
      })
    }


    const pica = new Pica(process.env.PICA_SECRET_KEY as string, {
      connectors: ["*"], // Pass connector keys to allow access to
      authkit: true
    });

    const system = await pica.generateSystemPrompt();

    const stream = streamText({
      model: openai("gpt-4o-mini"),
      system,
      tools: {
        ...pica.oneTool,
      },
      messages: convertToCoreMessages(messages),
      maxSteps: 20,
    });

    return (await stream).toDataStreamResponse();
  } catch (error) {
    console.error('API route error:', error)
    return new Response('Error processing your request', {
      status: 500,
      statusText: 'Internal Server Error'
    })
  }
})
