
import { useState } from "react";
import { FileAudio, FileVideo, Upload, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import FileUploader from "@/components/FileUploader";
import TranscriptionResult from "@/components/TranscriptionResult";

// Maximum file size in bytes (10MB - to avoid memory issues)
const MAX_FILE_SIZE = 10 * 1024 * 1024;
// Maximum chunk size for processing (2MB)
const CHUNK_SIZE = 2 * 1024 * 1024;

// Supported file formats
const SUPPORTED_FORMATS = [
  'mp3', 'mp4', 'm4a', 'wav', 'webm', 'ogg', 'flac', 'mpeg', 'mpga', 'oga'
];

const Index = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("upload");
  const [fileError, setFileError] = useState<string | null>(null);

  // Check if file format is supported
  const isFormatSupported = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    return SUPPORTED_FORMATS.includes(extension);
  };

  const handleTranscribe = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please upload an audio or video file first.",
        variant: "destructive",
      });
      return;
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: `Maximum file size is ${MAX_FILE_SIZE / (1024 * 1024)}MB. Please upload a smaller file or compress this one.`,
        variant: "destructive",
      });
      return;
    }

    // Check file format
    if (!isFormatSupported(file.name)) {
      toast({
        title: "Unsupported file format",
        description: `The file format is not supported. Please upload a file in one of these formats: ${SUPPORTED_FORMATS.join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    setIsTranscribing(true);
    setFileError(null);
    
    try {
      // Show a toast to indicate processing has started
      toast({
        title: "Processing file",
        description: "Your file is being transcribed. This may take a moment...",
      });
      
      // Convert file to ArrayBuffer
      const fileArrayBuffer = await file.arrayBuffer();
      const fileUint8Array = new Uint8Array(fileArrayBuffer);
      
      // Process in smaller chunks to avoid memory issues
      const totalChunks = Math.ceil(fileUint8Array.length / CHUNK_SIZE);
      
      // If file is small enough, send it directly
      if (totalChunks === 1) {
        const { data, error } = await supabase.functions.invoke('transcribe-audio', {
          body: {
            fileName: file.name,
            fileType: file.type || "audio/mp3", // Fallback type for mobile
            fileData: Array.from(fileUint8Array)
          }
        });

        if (error) {
          console.error("Supabase function error:", error);
          throw new Error(error.message || "Error calling transcription service");
        }

        if (data.error) {
          console.error("Transcription API error:", data.error);
          throw new Error(data.error.message || "Error during transcription");
        }

        // Set the transcription result
        setTranscription(data.transcription);
      } else {
        // For larger files, reduce the size before sending
        toast({
          title: "Optimizing file",
          description: "Your file is being optimized for transcription...",
        });
        
        // Create a smaller version of the file (first 10MB max)
        const optimizedArray = fileUint8Array.slice(0, MAX_FILE_SIZE);
        
        const { data, error } = await supabase.functions.invoke('transcribe-audio', {
          body: {
            fileName: file.name,
            fileType: file.type || "audio/mp3",
            fileData: Array.from(optimizedArray)
          }
        });

        if (error) {
          console.error("Supabase function error:", error);
          throw new Error(error.message || "Error calling transcription service");
        }

        if (data.error) {
          console.error("Transcription API error:", data.error);
          throw new Error(data.error.message || "Error during transcription");
        }

        // Set the transcription result
        setTranscription(data.transcription);
        
        // Add a note that only part of the file was transcribed
        if (file.size > MAX_FILE_SIZE) {
          setTranscription((prev) => 
            prev + "\n\n[Note: This is a partial transcription. The file was too large to process completely.]"
          );
        }
      }
      
      // Switch to the transcription tab
      setActiveTab("transcription");
      
      toast({
        title: "Transcription complete",
        description: "Your file has been successfully transcribed!",
      });
    } catch (error) {
      console.error('Transcription error:', error);
      
      // Handle specific error cases
      if (error.message?.includes("file too large") || error.message?.includes("exceeds the maximum allowed size")) {
        setFileError(`File exceeds the ${MAX_FILE_SIZE / (1024 * 1024)}MB limit. Please upload a smaller file.`);
      } else if (error.message?.includes("memory limit exceeded")) {
        setFileError("Server memory limit exceeded. Please try a smaller file.");
      } else if (error.message?.includes("Invalid file format")) {
        setFileError(`Unsupported file format. Please use one of these formats: ${SUPPORTED_FORMATS.join(', ')}`);
      }
      
      toast({
        title: "Transcription failed",
        description: error.message || "An error occurred during transcription.",
        variant: "destructive",
      });
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleFileChange = (uploadedFile: File | null) => {
    setFile(uploadedFile);
    setTranscription(null);
    setFileError(null);
    
    if (uploadedFile) {
      // Check file size immediately
      if (uploadedFile.size > MAX_FILE_SIZE) {
        setFileError(`File exceeds the ${MAX_FILE_SIZE / (1024 * 1024)}MB limit. Please upload a smaller file.`);
        toast({
          title: "File too large",
          description: `Maximum file size is ${MAX_FILE_SIZE / (1024 * 1024)}MB. Please upload a smaller file or compress this one.`,
          variant: "destructive",
        });
      } 
      // Check file format
      else if (!isFormatSupported(uploadedFile.name)) {
        setFileError(`Unsupported file format. Please use one of these formats: ${SUPPORTED_FORMATS.join(', ')}`);
        toast({
          title: "Unsupported file format",
          description: `Please upload a file in one of these formats: ${SUPPORTED_FORMATS.join(', ')}`,
          variant: "destructive",
        });
      }
      else {
        toast({
          title: "File selected",
          description: `${uploadedFile.name} is ready for transcription.`,
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="flex items-center gap-2 font-bold">
            <FileAudio className="h-6 w-6 text-primary" />
            <span className="text-xl">Whisper Transcribe</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm">
              About
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-10">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Audio & Video Transcription
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Upload your audio or video files and get accurate transcriptions powered by OpenAI's Whisper.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Maximum file size: {MAX_FILE_SIZE / (1024 * 1024)}MB
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="transcription" disabled={!transcription}>
                Transcription
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upload your file</CardTitle>
                  <CardDescription>
                    Supported formats: MP3, MP4, WAV, M4A, and more (max {MAX_FILE_SIZE / (1024 * 1024)}MB)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FileUploader 
                    onFileChange={handleFileChange} 
                    file={file}
                    acceptedFileTypes={{
                      'audio/*': ['.mp3', '.wav', '.m4a', '.flac', '.aac', '.ogg', '.oga', '.mpga'],
                      'video/*': ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.mpeg']
                    }}
                    maxFileSize={MAX_FILE_SIZE}
                  />
                  
                  {fileError && (
                    <div className="mt-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                      {fileError}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => handleFileChange(null)}
                    disabled={!file || isTranscribing}
                    type="button"
                  >
                    Clear
                  </Button>
                  <Button 
                    onClick={handleTranscribe} 
                    disabled={!file || isTranscribing || !!fileError}
                    className="gap-2"
                    type="button"
                  >
                    {isTranscribing ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Transcribing...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4" />
                        Transcribe
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="transcription" className="mt-6">
              <TranscriptionResult 
                transcription={transcription || ""} 
                fileName={file?.name || ""}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Whisper Transcribe. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Terms</a>
            <a href="#" className="hover:underline">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
