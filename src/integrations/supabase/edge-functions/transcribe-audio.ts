
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Maximum file size in bytes (25MB - OpenAI's limit)
const MAX_FILE_SIZE = 25 * 1024 * 1024;

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
        JSON.stringify({ error: 'OpenAI API key is not configured' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Only accept POST requests
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Get the request body
    const requestData = await req.json();
    
    if (!requestData.fileData || !requestData.fileName || !requestData.fileType) {
      return new Response(
        JSON.stringify({ error: 'Missing file data, name, or type' }),
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
    
    const fileBlob = new Blob([fileData], { type: requestData.fileType });
    
    // Create a File object from the Blob
    const file = new File([fileBlob], requestData.fileName, { type: requestData.fileType });

    // Prepare the form data for OpenAI API
    const formData = new FormData();
    formData.append('file', file);
    formData.append('model', 'whisper-1');
    
    console.log(`Processing file: ${requestData.fileName}, size: ${fileData.length} bytes, type: ${requestData.fileType}`);
    
    // Call OpenAI Whisper API
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: await response.text() };
      }
      
      console.error('OpenAI API error:', errorData);
      
      // Check for specific error types
      if (response.status === 413 || (errorData.error && errorData.error.message && errorData.error.message.includes("file too large"))) {
        return new Response(
          JSON.stringify({ 
            error: { 
              message: "File too large. Maximum file size is 25MB." 
            }
          }),
          {
            status: 413,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
      
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
    const result = await response.json();
    
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
    
    return new Response(
      JSON.stringify({
        error: {
          message: 'Failed to process transcription',
          details: error.message || String(error),
        }
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
