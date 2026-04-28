import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { MapPin, ArrowRight, Building, CheckCircle2 } from "lucide-react";
import { PROJECTS } from "../../lib/data";
import { ProjectDetails } from "./ProjectDetails";

export function Portfolio() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  if (selectedProjectId) {
    const project = PROJECTS.find(p => p.id === selectedProjectId);
    return project ? (
      <ProjectDetails project={project} onBack={() => setSelectedProjectId(null)} />
    ) : (
      <div>Project not found</div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">My Portfolio</h2>
        <p className="text-slate-500">Manage and track your real estate investments.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {PROJECTS.map((project) => (
          <Card key={project.id} className="overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
            <div className="h-48 w-full overflow-hidden relative">
              <img 
                src={project.image} 
                alt={project.name} 
                className="h-full w-full object-cover transition-transform hover:scale-105 duration-500" 
              />
              <div className="absolute top-3 right-3">
                <Badge 
                  variant={project.status === "Active" ? "default" : "secondary"}
                  className={project.status === "Active" ? "bg-teal-500 hover:bg-teal-600" : ""}
                >
                  {project.status}
                </Badge>
              </div>
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{project.name}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    {project.location}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Type</span>
                  <span className="font-medium">{project.type}</span>
                </div>
                
                {project.progress < 100 ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Construction</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                ) : (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Occupancy</span>
                    <span className="font-medium">{project.occupancy}%</span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Total Units</span>
                  <span className="font-medium">{project.totalUnits}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50 p-4">
              <Button onClick={() => setSelectedProjectId(project.id)} className="w-full bg-slate-900 hover:bg-slate-800">
                View Details <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
