import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  try {
    // Analytics is non-critical telemetry: if Supabase isn't configured,
    // accept the request and no-op rather than 500-ing the client.
    if (!supabase) {
      return new Response(JSON.stringify({ skipped: true }), { status: 200 });
    }

    const body = await request.json();
    const { 
      visitorId,
      sessionId,
      path, 
      referrer, 
      userAgent, 
      screenWidth, 
      screenHeight,
      viewportWidth,
      viewportHeight,
      devicePixelRatio,
      language,
      timezone,
      colorScheme,
      connectionType,
      touchEnabled,
      loadTime
    } = body;

    const { error } = await supabase
      .from('analytics')
      .insert([
        {
          visitor_id: visitorId,
          session_id: sessionId,
          path,
          referrer,
          user_agent: userAgent,
          screen_width: screenWidth,
          screen_height: screenHeight,
          viewport_width: viewportWidth,
          viewport_height: viewportHeight,
          device_pixel_ratio: devicePixelRatio,
          language,
          timezone,
          color_scheme: colorScheme,
          connection_type: connectionType,
          touch_enabled: touchEnabled,
          load_time: loadTime > 0 ? loadTime : null,
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
