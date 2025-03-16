
import React, { useState } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { 
  PlayIcon, 
  PlayCircleIcon, 
  SaveIcon, 
  DownloadIcon, 
  CodeIcon, 
  RotateCwIcon,
  ClipboardIcon,
  CloudIcon
} from "lucide-react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";

interface ETLPipelineDesignerProps {
  mode: "prompt" | "visual";
}

const ETLPipelineDesigner: React.FC<ETLPipelineDesignerProps> = ({ mode }) => {
  const [pipeline, setPipeline] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  
  const form = useForm({
    defaultValues: {
      prompt: "",
      source: "azure_blob_storage",
      destination: "azure_sql",
      transformations: "clean"
    }
  });

  const handleGenerate = async (values: any) => {
    setIsGenerating(true);
    
    // In a real implementation, this would call an API
    // For demo purposes, we'll simulate the response
    setTimeout(() => {
      const exampleJson = generateMockADFJson(values);
      setGeneratedCode(exampleJson);
      setIsGenerating(false);
    }, 1500);
  };

  const generateMockADFJson = (values: any) => {
    const jsonExample = `{
  "name": "Pipeline_${Date.now()}",
  "properties": {
    "activities": [
      {
        "name": "Copy_${values.source.replace('azure_', '')}_to_${values.destination.replace('azure_', '')}",
        "type": "Copy",
        "dependsOn": [],
        "policy": {
          "timeout": "7.00:00:00",
          "retry": 0,
          "retryIntervalInSeconds": 30,
          "secureOutput": false,
          "secureInput": false
        },
        "userProperties": [],
        "typeProperties": {
          "source": {
            "type": "${values.source.includes('blob') ? 'BlobSource' : 'AzureSqlSource'}"
          },
          "sink": {
            "type": "${values.destination.includes('sql') ? 'AzureSqlSink' : 'BlobSink'}"
          },
          "enableStaging": false
        }
      },
      ${values.transformations.includes('clean') ? `{
        "name": "DataCleaning",
        "type": "DataFlow",
        "dependsOn": [
          {
            "activity": "Copy_${values.source.replace('azure_', '')}_to_${values.destination.replace('azure_', '')}",
            "dependencyConditions": [ "Succeeded" ]
          }
        ],
        "typeProperties": {
          "dataflow": {
            "name": "CleaningDataFlow"
          }
        }
      }` : ''}
    ]
  }
}`;
    return jsonExample;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    // In a real app, you would show a toast notification here
    console.log("Copied to clipboard");
  };

  return (
    <div className="bg-card border rounded-lg shadow-sm">
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-6">ETL Pipeline Designer</h2>
        
        {mode === "prompt" && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleGenerate)} className="space-y-6">
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Describe your ETL pipeline</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="E.g., Load CSV files from Azure Blob Storage, remove duplicates and null values, then load to Azure SQL Database" 
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Describe what you want to do in plain English
                    </FormDescription>
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="source"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Source System</FormLabel>
                      <FormControl>
                        <select 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                        >
                          <option value="azure_blob_storage">Azure Blob Storage</option>
                          <option value="azure_data_lake">Azure Data Lake</option>
                          <option value="azure_sql">Azure SQL Database</option>
                          <option value="azure_cosmos_db">Azure Cosmos DB</option>
                        </select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="destination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination System</FormLabel>
                      <FormControl>
                        <select 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                        >
                          <option value="azure_sql">Azure SQL Database</option>
                          <option value="azure_synapse">Azure Synapse</option>
                          <option value="azure_data_lake">Azure Data Lake</option>
                          <option value="power_bi">Power BI Dataset</option>
                        </select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="transformations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transformations</FormLabel>
                    <FormControl>
                      <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      >
                        <option value="clean">Clean Data (Remove nulls, duplicates)</option>
                        <option value="aggregate">Aggregate Data</option>
                        <option value="filter">Filter Records</option>
                        <option value="join">Join with Reference Data</option>
                      </select>
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full" disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <RotateCwIcon className="mr-2 h-4 w-4 animate-spin" />
                    Generating Pipeline...
                  </>
                ) : (
                  <>
                    <PlayCircleIcon className="mr-2 h-4 w-4" />
                    Generate Pipeline
                  </>
                )}
              </Button>
            </form>
          </Form>
        )}
        
        {mode === "visual" && (
          <div className="text-center py-8">
            <CloudIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">Visual Designer Coming Soon</h3>
            <p className="text-muted-foreground">
              Our drag-and-drop visual ETL designer is under development. 
              Please use the prompt-based generator for now.
            </p>
          </div>
        )}
        
        {generatedCode && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Generated Pipeline (Azure Data Factory)</h3>
              <Button variant="outline" size="sm" onClick={copyToClipboard}>
                <ClipboardIcon className="h-4 w-4 mr-2" />
                Copy JSON
              </Button>
            </div>
            
            <div className="bg-muted rounded-md p-4 relative overflow-auto max-h-[400px]">
              <pre className="text-sm">
                <code>{generatedCode}</code>
              </pre>
            </div>
            
            <div className="flex justify-end gap-4 mt-4">
              <Button variant="outline">
                <DownloadIcon className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="default">
                <CloudIcon className="h-4 w-4 mr-2" />
                Deploy to Azure
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ETLPipelineDesigner;
