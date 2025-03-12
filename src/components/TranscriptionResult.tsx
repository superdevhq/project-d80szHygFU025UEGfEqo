
import { useState } from "react";
import { Copy, Download, FileAudio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface TranscriptionResultProps {
  transcription: string;
  fileName: string;
}

const TranscriptionResult = ({ transcription, fileName }: TranscriptionResultProps) => {
  const { toast } = useToast();
  const [editedTranscription, setEditedTranscription] = useState(transcription);

  const handleCopy = () => {
    navigator.clipboard.writeText(editedTranscription);
    toast({
      title: "Copied to clipboard",
      description: "The transcription has been copied to your clipboard.",
    });
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([editedTranscription], { type: "text/plain" });
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
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="rounded-md bg-primary/10 p-2">
          <FileAudio className="h-6 w-6 text-primary" />
        </div>
        <div>
          <CardTitle>Transcription Result</CardTitle>
          <p className="text-sm text-muted-foreground">
            {fileName || "Your file"} • {new Date().toLocaleString()}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <Textarea
          value={editedTranscription}
          onChange={(e) => setEditedTranscription(e.target.value)}
          className="min-h-[300px] font-medium"
          placeholder="Transcription will appear here..."
        />
      </CardContent>
      <CardFooter className="flex justify-between">
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

export default TranscriptionResult;
