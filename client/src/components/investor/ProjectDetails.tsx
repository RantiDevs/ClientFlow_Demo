import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Progress } from "../ui/progress";
import { ArrowLeft, CheckCircle2, Circle, Clock, Download, FileText, Hammer } from "lucide-react";
import { TRANSACTIONS, DOCUMENTS } from "../../lib/data";

interface ProjectDetailsProps {
  project: any;
  onBack: () => void;
}

export function ProjectDetails({ project, onBack }: ProjectDetailsProps) {
  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack} className="pl-0 hover:bg-transparent hover:text-teal-600">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Portfolio
      </Button>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{project.name}</h1>
          <p className="text-slate-500 flex items-center mt-1">
            {project.location} • {project.type}
          </p>
        </div>
        <Badge className="text-sm px-3 py-1 bg-teal-500 hover:bg-teal-600">
          {project.status}
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="financials">Financials</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Project Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Overall Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-3" />
                </div>
                
                {project.milestones && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-slate-900">Milestones</h4>
                    <div className="space-y-3">
                      {project.milestones.map((milestone: any, idx: number) => (
                        <div key={idx} className="flex items-center text-sm">
                          {milestone.completed ? (
                            <CheckCircle2 className="mr-3 h-5 w-5 text-teal-500" />
                          ) : (
                            <Circle className="mr-3 h-5 w-5 text-slate-300" />
                          )}
                          <span className={milestone.completed ? "text-slate-900" : "text-slate-400"}>
                            {milestone.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-xs text-slate-500 uppercase font-semibold">Total Units</span>
                    <p className="text-lg font-medium">{project.totalUnits}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-slate-500 uppercase font-semibold">Occupancy Rate</span>
                    <p className="text-lg font-medium">{project.occupancy}%</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-slate-500 uppercase font-semibold">Est. ROI</span>
                    <p className="text-lg font-medium text-teal-600">{project.roi > 0 ? `${project.roi}%` : "TBD"}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-slate-500 uppercase font-semibold">Last Valuation</span>
                    <p className="text-lg font-medium">₦1,000.2B</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financials" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Rental Income Log</CardTitle>
                <CardDescription>Recent rental payments and payouts</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download CSV
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {TRANSACTIONS.filter(t => t.type === 'income').map((t) => (
                    <TableRow key={t.id}>
                      <TableCell>{t.date}</TableCell>
                      <TableCell>{t.description}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {t.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium text-slate-900">
                        +₦{t.amount}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Expense Log</CardTitle>
                <CardDescription>Maintenance, repairs, and management fees</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {TRANSACTIONS.filter(t => t.type === 'expense').map((t) => (
                    <TableRow key={t.id}>
                      <TableCell>{t.date}</TableCell>
                      <TableCell>{t.description}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">Maintenance</Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium text-red-600">
                        ₦{Math.abs(t.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {DOCUMENTS.map((doc) => (
              <Card key={doc.id} className="flex items-center p-4 hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="h-10 w-10 rounded bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{doc.name}</p>
                  <p className="text-xs text-slate-500">{doc.date} • {doc.size}</p>
                </div>
                <Button variant="ghost" size="icon">
                  <Download className="h-4 w-4 text-slate-400" />
                </Button>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
