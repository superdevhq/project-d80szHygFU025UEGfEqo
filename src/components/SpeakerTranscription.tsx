
import { useState } from "react";
import { Copy, Download, FileAudio, MessageSquare, User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface SpeakerTranscriptionProps {
  transcription: string;
  fileName: string;
  rawTranscription?: string;
}

const SpeakerTranscription = ({ 
  transcription, 
  fileName,
  rawTranscription 
}: SpeakerTranscriptionProps) => {
  const { toast } = useToast();
  const [showRaw, setShowRaw] = useState(false);

  // Parse the transcription to identify speakers and their text
  const parseSpeakerContent = () => {
    // If there's no transcription, return empty array
    if (!transcription) return [];
    
    // Split by new lines and group by speaker
    const lines = transcription.split('\n').filter(line => line.trim() !== '');
    const speakerContent: { speaker: string; text: string; }[] = [];
    
    lines.forEach(line => {
      // Check if line starts with "Speaker X:" pattern
      const speakerMatch = line.match(/^(Speaker \d+|דובר \d+):\s*(.*)/i);
      
      if (speakerMatch) {
        const [, speaker, text] = speakerMatch;
        speakerContent.push({ 
          speaker: speaker.trim(), 
          text: text.trim() 
        });
      } else {
        // If no speaker pattern, add to previous speaker or create a new entry
        if (speakerContent.length > 0) {
          speakerContent[speakerContent.length - 1].text += ' ' + line.trim();
        } else {
          speakerContent.push({ 
            speaker: 'Unknown', 
            text: line.trim() 
          });
        }
      }
    });
    
    return speakerContent;
  };

  const speakerContent = parseSpeakerContent();
  
  // Get unique speakers for color coding
  const uniqueSpeakers = Array.from(new Set(speakerContent.map(item => item.speaker)));
  
  // Generate a color for each speaker
  const getSpeakerColor = (speaker: string) => {
    const speakerIndex = uniqueSpeakers.indexOf(speaker);
    const colors = [
      'bg-blue-100 border-blue-300 text-blue-800',
      'bg-green-100 border-green-300 text-green-800',
      'bg-purple-100 border-purple-300 text-purple-800',
      'bg-amber-100 border-amber-300 text-amber-800',
      'bg-rose-100 border-rose-300 text-rose-800',
      'bg-cyan-100 border-cyan-300 text-cyan-800',
    ];
    
    return colors[speakerIndex % colors.length];
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(showRaw ? (rawTranscription || transcription) : transcription);
    toast({
      title: "Copied to clipboard",
      description: "The transcription has been copied to your clipboard.",
    });
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const content = showRaw ? (rawTranscription || transcription) : transcription;
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${fileName.split(".")[0]}-transcription.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Downloaded",
      description: "The transcription has been downloaded as a text file.",
    });
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-4 bg-muted/50">
        <div className="rounded-md bg-primary/10 p-2">
          <Users className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <CardTitle>Transcription with Speaker Identification</CardTitle>
          <p className="text-sm text-muted-foreground">
            {fileName || "Your file"} • {new Date().toLocaleString()}
          </p>
        </div>
        {rawTranscription && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowRaw(!showRaw)}
            className="gap-2"
          >
            {showRaw ? <Users className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
            {showRaw ? "Show Speakers" : "Show Raw Text"}
          </Button>
        )}
      </CardHeader>
      
      <CardContent className="p-0">
        {showRaw ? (
          <div className="p-6">
            <p className="whitespace-pre-wrap font-medium">
              {rawTranscription || transcription}
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {speakerContent.map((item, index) => (
              <div key={index} className="flex p-4 gap-3">
                <div className={cn(
                  "flex-shrink-0 rounded-full w-8 h-8 flex items-center justify-center border",
                  getSpeakerColor(item.speaker)
                )}>
                  <User className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className={cn(
                    "text-sm font-medium mb-1 px-2 py-0.5 rounded-md inline-block",
                    getSpeakerColor(item.speaker)
                  )}>
                    {item.speaker}
                  </div>
                  <p className="text-base">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between bg-muted/50 border-t">
        <Button variant="outline" onClick={handleCopy} className="gap-2">
          <Copy className="h-4 w-4" />
          Copy
        </Button>
        <Button onClick={handleDownload} className="gap-2">
          <Download className="h-4 w-4" />
          Download
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SpeakerTranscription;
