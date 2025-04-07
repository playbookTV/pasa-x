import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Loader2 } from 'lucide-react';

interface GenerateCoverLetterWidgetProps {
  onBack: () => void;
  onGenerate: (customization: string) => void;
  isLoading?: boolean;
  jobTitle?: string;
  jobCompany?: string;
}

export const GenerateCoverLetterWidget: React.FC<GenerateCoverLetterWidgetProps> = ({
  onBack,
  onGenerate,
  isLoading = false,
  jobTitle = '',
  jobCompany = ''
}) => {
  const [customization, setCustomization] = useState('');
  const [role, setRole] = useState(jobTitle || '');
  const [company, setCompany] = useState(jobCompany || '');

  const handleGenerate = () => {
    onGenerate(customization);
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-bold">Generate Cover Letter</CardTitle>
          <Button variant="ghost" size="sm" onClick={onBack}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 12H5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 19L5 12L12 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="role">Job Title</Label>
          <Input
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Software Engineer"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Acme Corp"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="customization">Customization (optional)</Label>
          <Textarea
            id="customization"
            value={customization}
            onChange={(e) => setCustomization(e.target.value)}
            placeholder="Add specific achievements or points you want highlighted in your cover letter..."
            className="min-h-[100px]"
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button
          className="w-full"
          onClick={handleGenerate}
          disabled={isLoading || !role || !company}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Cover Letter'
          )}
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          We'll use your saved resume and the job details to create a personalized cover letter.
        </p>
      </CardFooter>
    </Card>
  );
};

