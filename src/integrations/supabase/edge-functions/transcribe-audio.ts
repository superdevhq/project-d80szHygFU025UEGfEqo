
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Maximum file size in bytes (10MB - to avoid memory issues)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // Get environment variables
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ error: { message: 'OpenAI API key is not configured' } }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Only accept POST requests
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: { message: 'Method not allowed' } }),
        {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Get the request body
    let requestData;
    try {
      requestData = await req.json();
    } catch (e) {
      return new Response(
        JSON.stringify({ error: { message: 'Invalid JSON in request body' } }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    if (!requestData.fileData || !requestData.fileName) {
      return new Response(
        JSON.stringify({ error: { message: 'Missing file data or name' } }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Convert the array back to Uint8Array
    const fileData = new Uint8Array(requestData.fileData);
    
    // Check file size
    if (fileData.length > MAX_FILE_SIZE) {
      return new Response(
        JSON.stringify({ 
          error: { 
            message: `File size (${fileData.length} bytes) exceeds the maximum allowed size (${MAX_FILE_SIZE} bytes)` 
          }
        }),
        {
          status: 413, // Payload Too Large
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    // Create a blob with the file data - always use mp3 MIME type for OpenAI
    const fileBlob = new Blob([fileData], { type: 'audio/mpeg' });
    
    // Create a File object from the Blob with .mp3 extension to ensure compatibility
    const fileName = requestData.fileName.split('.')[0] + '.mp3';
    const file = new File([fileBlob], fileName, { type: 'audio/mpeg' });

    // Prepare the form data for OpenAI API
    const formData = new FormData();
    formData.append('file', file);
    formData.append('model', 'whisper-1');
    
    console.log(`Processing file: ${fileName}, size: ${fileData.length} bytes, type: audio/mpeg`);
    
    // Call OpenAI Whisper API
    let response;
    try {
      response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
        },
        body: formData,
      });
    } catch (e) {
      console.error('Error calling OpenAI API:', e);
      return new Response(
        JSON.stringify({ 
          error: { 
            message: 'Error connecting to OpenAI API. Please try again later.' 
          }
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        try {
          errorData = { message: await response.text() };
        } catch (textError) {
          errorData = { message: `HTTP error ${response.status}` };
        }
      }
      
      console.error('OpenAI API error:', errorData);
      
      return new Response(
        JSON.stringify({ 
          error: errorData 
        }),
        {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Get the transcription result
    let result;
    try {
      result = await response.json();
    } catch (e) {
      console.error('Error parsing OpenAI response:', e);
      return new Response(
        JSON.stringify({ 
          error: { 
            message: 'Error parsing transcription result' 
          }
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    // Return the transcription
    return new Response(
      JSON.stringify({
        success: true,
        transcription: result.text,
        duration: result.duration,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error processing transcription:', error);
    
    // Check if this is a memory error
    const errorMessage = error.message || String(error);
    if (errorMessage.includes('memory') || errorMessage.includes('allocation')) {
      return new Response(
        JSON.stringify({
          error: {
            message: 'Server memory limit exceeded. Please try a smaller file.',
            details: errorMessage
          }
        }),
        {
          status: 507, // Insufficient Storage
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    return new Response(
      JSON.stringify({
        error: {
          message: 'Failed to process transcription',
          details: errorMessage,
        }
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
