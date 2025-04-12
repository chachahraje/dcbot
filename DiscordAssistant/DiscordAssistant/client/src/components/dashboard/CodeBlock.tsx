import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = "javascript",
  title,
}) => {
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "Code copied successfully",
      });
      
      // Reset after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-card overflow-hidden rounded-lg shadow">
      {title && (
        <div className="bg-muted px-4 py-2 flex justify-between items-center">
          <span className="text-sm font-medium">{title}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={copyToClipboard}
            className="h-8 gap-1"
          >
            <Copy className="h-4 w-4" />
            {isCopied ? "Copied!" : "Copy"}
          </Button>
        </div>
      )}
      <div className="bg-[#1E1E1E] overflow-x-auto">
        <pre className="p-4 text-sm">
          <code className={`language-${language}`}>{code}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;
