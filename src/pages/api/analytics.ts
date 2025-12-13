import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { path, referrer, userAgent, screenWidth, screenHeight } = body;

    const { error } = await supabase
      .from('analytics')
      .insert([
        {
          path,
          referrer,
          user_agent: userAgent,
          screen_width: screenWidth,
          screen_height: screenHeight,
          timestamp: new Date().toISOString(),
        },
      ]);

    if (error) {
      console.error('Supabase error:', error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e) {
    console.error('Analytics error:', e);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
};
