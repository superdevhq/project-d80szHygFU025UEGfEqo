
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Maximum file size in bytes (10MB - to avoid memory issues)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Supported formats by OpenAI Whisper API
const SUPPORTED_FORMATS = ['flac', 'm4a', 'mp3', 'mp4', 'mpeg', 'mpga', 'oga', 'ogg', 'wav', 'webm'];

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
    
    // Get the original file extension
    const originalExtension = requestData.fileName.split('.').pop().toLowerCase();
    
    // Check if the original extension is supported by OpenAI
    if (!SUPPORTED_FORMATS.includes(originalExtension)) {
      return new Response(
        JSON.stringify({ 
          error: { 
            message: `Unsupported file format: .${originalExtension}. Supported formats: ${SUPPORTED_FORMATS.join(', ')}` 
          }
        }),
        {
          status: 415, // Unsupported Media Type
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    // Map file extensions to MIME types
    const mimeTypeMap = {
      'mp3': 'audio/mpeg',
      'mp4': 'video/mp4',
      'mpeg': 'video/mpeg',
      'mpga': 'audio/mpeg',
      'm4a': 'audio/mp4',
      'wav': 'audio/wav',
      'webm': 'audio/webm',
      'ogg': 'audio/ogg',
      'oga': 'audio/ogg',
      'flac': 'audio/flac'
    };
    
    // Get the correct MIME type for this file
    const mimeType = mimeTypeMap[originalExtension] || 'audio/mpeg';
    
    // Create a blob with the file data using the correct MIME type
    const fileBlob = new Blob([fileData], { type: mimeType });
    
    // Create a File object with the original filename and extension
    const file = new File([fileBlob], requestData.fileName, { type: mimeType });

    // Prepare the form data for OpenAI API
    const formData = new FormData();
    formData.append('file', file);
    formData.append('model', 'whisper-1');
    
    console.log(`Processing file: ${requestData.fileName}, size: ${fileData.length} bytes, type: ${mimeType}, extension: ${originalExtension}`);
    
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
      
      // If we get a format error, try with a different approach
      if (errorData?.error?.message?.includes("Invalid file format")) {
        console.log("Trying alternative approach with MP3 format...");
        
        // Try with explicit MP3 format
        const mp3Blob = new Blob([fileData], { type: 'audio/mpeg' });
        const mp3FileName = requestData.fileName.split('.')[0] + '.mp3';
        const mp3File = new File([mp3Blob], mp3FileName, { type: 'audio/mpeg' });
        
        const retryFormData = new FormData();
        retryFormData.append('file', mp3File);
        retryFormData.append('model', 'whisper-1');
        
        try {
          const retryResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${openaiApiKey}`,
            },
            body: retryFormData,
          });
          
          if (retryResponse.ok) {
            const retryResult = await retryResponse.json();
            return new Response(
              JSON.stringify({
                success: true,
                transcription: retryResult.text,
                duration: retryResult.duration,
              }),
              {
                status: 200,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              }
            );
          } else {
            // If retry also fails, return the original error
            console.error("Retry with MP3 format also failed");
          }
        } catch (retryError) {
          console.error("Error during retry:", retryError);
        }
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
