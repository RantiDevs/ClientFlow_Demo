import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { FileUploader, FilePreview } from "../ui/file-uploader";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export function MaintenanceRequest() {
  const [submitted, setSubmitted] = useState(false);
  const [attachment, setAttachment] = useState<{ file: File, url: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-300">
        <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Request Submitted!</h2>
        <p className="text-slate-500 max-w-md mt-2">
          Your maintenance ticket #TK-8839 has been created. Our team will review your request and attached images shortly.
        </p>
        <Button onClick={() => setSubmitted(false)} className="mt-8">Submit Another Request</Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Report an Issue</h2>
        <p className="text-slate-500">Submit a maintenance request for your unit.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Maintenance Details</CardTitle>
          <CardDescription>Please describe the issue in detail and attach photos if possible.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="category">Issue Category</Label>
              <Select required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plumbing">Plumbing (Leaks, Taps)</SelectItem>
                  <SelectItem value="electrical">Electrical (Lights, Power)</SelectItem>
                  <SelectItem value="ac">Air Conditioning / HVAC</SelectItem>
                  <SelectItem value="appliance">Appliances</SelectItem>
                  <SelectItem value="internet">Internet / Wi-Fi</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="priority">Urgency</Label>
              <Select required defaultValue="medium">
                <SelectTrigger>
                  <SelectValue placeholder="Select urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low (Can wait a week)</SelectItem>
                  <SelectItem value="medium">Medium (Needs attention soon)</SelectItem>
                  <SelectItem value="high">High (Emergency / Safety Hazard)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                placeholder="Please describe what happened..." 
                className="min-h-[120px]" 
                required
              />
            </div>

            <div className="space-y-3">
              <Label>Photos / Videos</Label>
              {!attachment ? (
                <FileUploader 
                  onFileSelect={(file, url) => setAttachment({ file, url })}
                  maxSizeMB={10}
                />
              ) : (
                <FilePreview 
                  file={attachment.file} 
                  previewUrl={attachment.url} 
                  onRemove={() => setAttachment(null)}
                />
              )}
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start text-sm text-yellow-800">
              <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
              <p>For life-threatening emergencies (fire, gas leak), please call emergency services immediately.</p>
            </div>

          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="ghost" type="button">Cancel</Button>
            <Button type="submit" className="bg-slate-900">Submit Request</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
