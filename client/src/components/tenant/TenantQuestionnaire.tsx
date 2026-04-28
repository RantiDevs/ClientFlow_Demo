import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Checkbox } from "../ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { toast } from "sonner";
import { CheckCircle2, User, Home, GraduationCap, Briefcase, Phone, FileText } from "lucide-react";

interface TenantQuestionnaireProps {
  onComplete: () => void;
}

export function TenantQuestionnaire({ onComplete }: TenantQuestionnaireProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [studentStatus, setStudentStatus] = useState<"student" | "non-student" | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    // Section A
    fullName: "",
    phoneNumber: "",
    email: "",
    gender: "",
    
    // Section B
    roomNumber: "",
    moveInDate: "",
    hasRoommate: "no",
    gymSubscription: false,

    // Section C (Student)
    institutionName: "",
    courseOfStudy: "",
    levelYear: "",

    // Section D (Non-Student)
    occupation: "",
    organizationName: "",

    // Section E
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyRelationship: "",

    // Section F
    consent: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleCheckboxChange = (key: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [key]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic Validation
    if (!formData.consent) {
        toast.error("Please provide your consent to proceed.");
        return;
    }

    if (!studentStatus) {
        toast.error("Please select if you are a student or non-student.");
        return;
    }

    setIsSubmitting(true);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("Profile updated successfully!");
      onComplete();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8">
      <Card className="w-full max-w-3xl bg-white border-none shadow-2xl rounded-3xl overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-[#DDA04E] rounded-full blur-3xl opacity-20"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">Complete Your Profile</h1>
            <p className="text-slate-400">Welcome to Pavilion. Please provide us with some details to help us serve you better.</p>
          </div>
        </div>

        <div className="max-h-[70vh] overflow-y-auto">
            <form onSubmit={handleSubmit}>
            <CardContent className="p-8 space-y-8">
                
                {/* SECTION A: BASIC INFORMATION */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[#DDA04E] mb-2">
                        <User className="h-5 w-5" />
                        <h3 className="font-bold text-slate-900 tracking-wide uppercase text-sm">Section A: Basic Information</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input id="fullName" placeholder="John Doe" value={formData.fullName} onChange={handleInputChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="gender">Gender</Label>
                            <Select onValueChange={(val) => handleSelectChange("gender", val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phoneNumber">Phone Number</Label>
                            <Input id="phoneNumber" placeholder="+1 (555) 000-0000" value={formData.phoneNumber} onChange={handleInputChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleInputChange} required />
                        </div>
                    </div>
                </div>

                <Separator className="bg-slate-100" />

                {/* SECTION B: TENANCY DETAILS */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[#DDA04E] mb-2">
                        <Home className="h-5 w-5" />
                        <h3 className="font-bold text-slate-900 tracking-wide uppercase text-sm">Section B: Tenancy Details</h3>
                    </div>
                    
                    <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <Label className="text-base font-semibold">Are you a Student or Non-Student?</Label>
                        <RadioGroup 
                            className="flex flex-col sm:flex-row gap-4 mt-2"
                            value={studentStatus || ""} 
                            onValueChange={(val: "student" | "non-student") => setStudentStatus(val)}
                        >
                            <div className={`flex items-center space-x-2 border rounded-lg p-3 w-full transition-all ${studentStatus === 'student' ? 'border-[#DDA04E] bg-[#DDA04E]/5' : 'border-slate-200 bg-white'}`}>
                                <RadioGroupItem value="student" id="r-student" className="text-[#DDA04E] border-slate-300" />
                                <Label htmlFor="r-student" className="flex items-center gap-2 cursor-pointer w-full"><GraduationCap className="h-4 w-4 text-slate-500" /> Student</Label>
                            </div>
                            <div className={`flex items-center space-x-2 border rounded-lg p-3 w-full transition-all ${studentStatus === 'non-student' ? 'border-[#DDA04E] bg-[#DDA04E]/5' : 'border-slate-200 bg-white'}`}>
                                <RadioGroupItem value="non-student" id="r-non-student" className="text-[#DDA04E] border-slate-300" />
                                <Label htmlFor="r-non-student" className="flex items-center gap-2 cursor-pointer w-full"><Briefcase className="h-4 w-4 text-slate-500" /> Non-Student</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <div className="space-y-2">
                            <Label htmlFor="roomNumber">Room / Unit Number</Label>
                            <Input id="roomNumber" placeholder="e.g. 304" value={formData.roomNumber} onChange={handleInputChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="moveInDate">Date of Move-In</Label>
                            <Input id="moveInDate" type="date" value={formData.moveInDate} onChange={handleInputChange} required />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        <div className="space-y-2">
                            <Label>Will you have a Roommate?</Label>
                            <RadioGroup 
                                className="flex gap-4"
                                value={formData.hasRoommate}
                                onValueChange={(val) => handleSelectChange("hasRoommate", val)}
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="yes" id="roommate-yes" className="text-[#DDA04E]" />
                                    <Label htmlFor="roommate-yes">Yes</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="no" id="roommate-no" className="text-[#DDA04E]" />
                                    <Label htmlFor="roommate-no">No</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        
                        <div className="space-y-2">
                            <Label>Will you subscribe to the gym facility?</Label>
                            <RadioGroup 
                                className="flex gap-4"
                                value={formData.gymSubscription ? "yes" : "no"}
                                onValueChange={(val) => handleCheckboxChange("gymSubscription", val === "yes")}
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="yes" id="gym-yes" className="text-[#DDA04E]" />
                                    <Label htmlFor="gym-yes">Yes</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="no" id="gym-no" className="text-[#DDA04E]" />
                                    <Label htmlFor="gym-no">No</Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </div>
                </div>

                {/* SECTION C: STUDENT INFORMATION */}
                {studentStatus === 'student' && (
                    <>
                        <Separator className="bg-slate-100" />
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                            <div className="flex items-center gap-2 text-[#DDA04E] mb-2">
                                <GraduationCap className="h-5 w-5" />
                                <h3 className="font-bold text-slate-900 tracking-wide uppercase text-sm">Section C: Student Information</h3>
                            </div>
                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="institutionName">Institution Name</Label>
                                    <Input id="institutionName" placeholder="University Name" value={formData.institutionName} onChange={handleInputChange} required />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="courseOfStudy">Course of Study</Label>
                                        <Input id="courseOfStudy" placeholder="e.g. Computer Science" value={formData.courseOfStudy} onChange={handleInputChange} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="levelYear">Level / Year</Label>
                                        <Select onValueChange={(val) => handleSelectChange("levelYear", val)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Level" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="100">100 Level / Year 1</SelectItem>
                                                <SelectItem value="200">200 Level / Year 2</SelectItem>
                                                <SelectItem value="300">300 Level / Year 3</SelectItem>
                                                <SelectItem value="400">400 Level / Year 4</SelectItem>
                                                <SelectItem value="500">500 Level / Year 5</SelectItem>
                                                <SelectItem value="postgrad">Postgraduate</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* SECTION D: NON-STUDENT INFORMATION */}
                {studentStatus === 'non-student' && (
                    <>
                        <Separator className="bg-slate-100" />
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                            <div className="flex items-center gap-2 text-[#DDA04E] mb-2">
                                <Briefcase className="h-5 w-5" />
                                <h3 className="font-bold text-slate-900 tracking-wide uppercase text-sm">Section D: Non-Student Information</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="occupation">Occupation</Label>
                                    <Input id="occupation" placeholder="e.g. Software Engineer" value={formData.occupation} onChange={handleInputChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="organizationName">Organization / Business Name</Label>
                                    <Input id="organizationName" placeholder="Company Name" value={formData.organizationName} onChange={handleInputChange} required />
                                </div>
                            </div>
                        </div>
                    </>
                )}

                <Separator className="bg-slate-100" />

                {/* SECTION E: EMERGENCY CONTACT */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[#DDA04E] mb-2">
                        <Phone className="h-5 w-5" />
                        <h3 className="font-bold text-slate-900 tracking-wide uppercase text-sm">Section E: Emergency Contact</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="emergencyContactName">Contact Name</Label>
                            <Input id="emergencyContactName" placeholder="Full Name" value={formData.emergencyContactName} onChange={handleInputChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="emergencyRelationship">Relationship</Label>
                            <Input id="emergencyRelationship" placeholder="e.g. Parent, Sibling" value={formData.emergencyRelationship} onChange={handleInputChange} required />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="emergencyContactPhone">Contact Phone Number</Label>
                            <Input id="emergencyContactPhone" placeholder="+1 (555) 000-0000" value={formData.emergencyContactPhone} onChange={handleInputChange} required />
                        </div>
                    </div>
                </div>

                <Separator className="bg-slate-100" />

                {/* SECTION F: CONSENT */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[#DDA04E] mb-2">
                        <FileText className="h-5 w-5" />
                        <h3 className="font-bold text-slate-900 tracking-wide uppercase text-sm">Section F: Consent</h3>
                    </div>
                    <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <Checkbox 
                            id="consent" 
                            checked={formData.consent}
                            onCheckedChange={(checked) => handleCheckboxChange("consent", checked as boolean)}
                            className="mt-1 data-[state=checked]:bg-[#DDA04E] data-[state=checked]:border-[#DDA04E]"
                        />
                        <div className="grid gap-1.5 leading-none">
                            <Label htmlFor="consent" className="text-sm font-medium leading-normal cursor-pointer text-slate-700">
                                I confirm that the information provided is accurate and understand that it will be used for Pavilion management purposes.
                            </Label>
                        </div>
                    </div>
                </div>

            </CardContent>
            
            <CardFooter className="bg-slate-50 p-6 flex justify-end border-t border-slate-100">
                <Button 
                    type="submit" 
                    className="bg-[#DDA04E] hover:bg-[#c48b3d] text-slate-900 font-bold px-8 py-6 rounded-xl text-lg shadow-xl shadow-[#DDA04E]/20"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>Processing...</>
                    ) : (
                        <>Submit</>
                    )}
                </Button>
            </CardFooter>
            </form>
        </div>
      </Card>
    </div>
  );
}
