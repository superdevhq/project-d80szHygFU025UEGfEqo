
import React, { useState, useEffect } from 'react';
import { updateOpenAIApiKey, getOpenAIApiKey } from '@/lib/lib';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { logMessage } from '@/utils/logger';

export const OpenAIKeyManager: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  useEffect(() => {
    // Load the saved API key on component mount
    const savedKey = getOpenAIApiKey();
    if (savedKey && savedKey !== 'your-default-key-here') {
      setApiKey(savedKey);
      setIsSaved(true);
    }
  }, []);

  const handleSaveKey = () => {
    try {
      updateOpenAIApiKey(apiKey);
      setIsSaved(true);
      logMessage('OpenAI API key updated successfully', 'info');
      
      // Reset the saved state after 3 seconds
      setTimeout(() => {
        setIsSaved(false);
      }, 3000);
    } catch (error) {
      logMessage(`Failed to update API key: ${(error as Error).message}`, 'error');
    }
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>OpenAI API Key</CardTitle>
        <CardDescription>
          Update your OpenAI API key for this application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <Input
            type={isVisible ? 'text' : 'password'}
            placeholder="Enter your OpenAI API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="flex-1"
          />
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleVisibility}
            title={isVisible ? 'Hide API key' : 'Show API key'}
          >
            {isVisible ? '👁️' : '👁️‍🗨️'}
          </Button>
        </div>
        {isSaved && (
          <p className="text-green-500 mt-2 text-sm">API key saved successfully!</p>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSaveKey} 
          disabled={!apiKey || apiKey.trim() === ''}
          className="w-full"
        >
          Save API Key
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OpenAIKeyManager;
