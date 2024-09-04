declare module '@copilotkit/react-textarea' {
    import React from 'react';
  
    // Define the structure for autosuggestionsConfig prop
    interface AutosuggestionsConfig {
      textareaPurpose: string;
      chatApiConfigs: {
        suggestionsApiConfig: {
          forwardedParams: {
            max_tokens: number;
            stop: string[];
          };
        };
      };
    }
  
    export interface CopilotTextareaProps {
      className?: string;
      placeholder?: string;
      autosuggestionsConfig?: AutosuggestionsConfig;
      disableBranding?: boolean;
      value?: string;
      onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
      disabled?: boolean;
      rows?: number;
      cols?: number;
      [key: string]: any;  // Allow additional props
    }
  
    const CopilotTextarea: React.FC<CopilotTextareaProps>;
  
    export default CopilotTextarea;
  }
  