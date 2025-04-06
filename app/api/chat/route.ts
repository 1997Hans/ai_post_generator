import { generateGeminiPost } from '@/app/actions/generateGeminiPost';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    return generateGeminiPost({
      topic: body.topic || body.messages?.[body.messages.length - 1]?.content,
      tone: body.tone || 'friendly',
      platform: body.platform || 'instagram',
      visualStyle: body.visualStyle || 'realistic',
      maxLength: body.maxLength || 280,
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to process your request',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
} 