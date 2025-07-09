import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  Share2,
  Upload,
  CheckCircle,
  Rocket,
  Users,
  Heart,
} from "lucide-react";

interface FormData {
  name: string;
  phone: string;
  email: string;
  college: string;
  screenshot: File | null;
}

export default function TechForGirlsRegistration() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    college: "",
    screenshot: null,
  });

  const [clickCount, setClickCount] = useState(0);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const savedCount = parseInt(localStorage.getItem("shareCount") || "0");
    const submitted = localStorage.getItem("formSubmitted") === "true";
    setClickCount(savedCount);
    setHasSubmitted(submitted);
  }, []);

  const handleShare = () => {
    if (clickCount < 5) {
      const message = encodeURIComponent(
        "Hey! Join Tech For Girls Community 🚀 Empowering women in technology! https://techforgirls.example.com"
      );
      window.open(`https://wa.me/?text=${message}`, "_blank");

      const newCount = clickCount + 1;
      setClickCount(newCount);
      localStorage.setItem("shareCount", newCount.toString());

      toast({
        title: "Thanks for sharing! 🎉",
        description: `${
          5 - newCount
        } more shares needed to unlock registration.`,
      });

      if (newCount >= 5) {
        toast({
          title: "Awesome! 🚀",
          description: "You've completed all shares! Now you can register.",
        });
      }
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, screenshot: file }));
      toast({
        title: "Screenshot uploaded! 📸",
        description: "File ready for submission.",
      });
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result?.toString().split(",")[1];
        resolve(base64Data || "");
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (hasSubmitted) {
      toast({
        title: "Already submitted! ✅",
        description: "You've already registered successfully.",
        variant: "destructive",
      });
      return;
    }

    if (clickCount < 5) {
      toast({
        title: "Share required! 🔄",
        description: "Please complete 5 shares before submitting.",
        variant: "destructive",
      });
      return;
    }

    if (
      !formData.name ||
      !formData.phone ||
      !formData.email ||
      !formData.college ||
      !formData.screenshot
    ) {
      toast({
        title: "Missing information! 📝",
        description: "Please fill in all fields and upload a screenshot.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const base64Screenshot = await fileToBase64(formData.screenshot);

      const submitFormData = new FormData();
      submitFormData.append("name", formData.name);
      submitFormData.append("phone", formData.phone);
      submitFormData.append("email", formData.email);
      submitFormData.append("college", formData.college);
      submitFormData.append("screenshot", base64Screenshot);

      const submitUrl =
        "https://script.google.com/macros/s/AKfycbxI6_c-E8VWBbIkODtLslVy_KPMiKjR9efFf_p-at2ky16fxOrEXgUuQRYIEP4riKT6/exec";

      const response = await fetch(submitUrl, {
        method: "POST",
        body: submitFormData,
      });

      const result = await response.text();

      if (result.includes("Success")) {
        toast({
          title: "Registration successful! 🎉",
          description: "Welcome to Tech for Girls community!",
        });
        localStorage.setItem("formSubmitted", "true");
        setHasSubmitted(true);
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      console.error("Submit Error:", error);
      toast({
        title: "Submission failed! ❌",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressValue = Math.min((clickCount / 5) * 100, 100);
  const isFormUnlocked = clickCount >= 5;

  return (
    <div className="min-h-screen flex items-center justify-center">
      {/* Desktop Layout */}
      <div
        className="hidden lg:flex w-full max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden relative"
        style={{ height: "100vh" }}
      >
        {/* Left Side - Form (Scrollable, Hide Scrollbar) */}
        <div
          className="flex-1 p-8 lg:p-12 overflow-y-auto h-full scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <style>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          <Card className="border-0 shadow-none bg-transparent">
            <CardHeader className="text-center space-y-4 px-0">
              <div className="flex items-center justify-center gap-2 text-3xl">
                <Rocket className="h-8 w-8 text-primary" />
                <span className="font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                  Tech for Girls
                </span>
              </div>
              <CardTitle className="text-2xl">Registration Form</CardTitle>
              <CardDescription className="text-base">
                Join our amazing community of women in tech! 💜
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 px-0">
              {/* Share Progress Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-accent" />
                  <span className="font-medium">
                    Share Progress: {clickCount}/5
                  </span>
                </div>

                <Progress value={progressValue} className="h-3" />

                <Button
                  onClick={handleShare}
                  disabled={clickCount >= 5}
                  variant="share"
                  size="lg"
                  className="w-full"
                >
                  {clickCount >= 5 ? (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      Sharing Complete!
                    </>
                  ) : (
                    <>
                      <Share2 className="h-5 w-5" />
                      Share on WhatsApp ({5 - clickCount} left)
                    </>
                  )}
                </Button>

                {clickCount >= 5 && (
                  <div className="text-center p-3 bg-success/10 rounded-lg border border-success/20">
                    <div className="flex items-center justify-center gap-2 text-success font-medium">
                      <CheckCircle className="h-4 w-4" />
                      Great! You can now register below ⬇️
                    </div>
                  </div>
                )}
              </div>

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    disabled={!isFormUnlocked || hasSubmitted}
                    className="tech-input"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Your phone number"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    disabled={!isFormUnlocked || hasSubmitted}
                    className="tech-input"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    disabled={!isFormUnlocked || hasSubmitted}
                    className="tech-input"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="college">College / Department</Label>
                  <Input
                    id="college"
                    type="text"
                    placeholder="Your college or department"
                    value={formData.college}
                    onChange={(e) =>
                      handleInputChange("college", e.target.value)
                    }
                    disabled={!isFormUnlocked || hasSubmitted}
                    className="tech-input"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="screenshot">Upload Screenshot</Label>
                  <div className="relative">
                    <Input
                      ref={fileInputRef}
                      id="screenshot"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={!isFormUnlocked || hasSubmitted}
                      className="tech-input cursor-pointer"
                      required
                    />
                    <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                  {formData.screenshot && (
                    <p className="text-sm text-success">
                      ✅ {formData.screenshot.name}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={!isFormUnlocked || hasSubmitted || isSubmitting}
                  variant={hasSubmitted ? "success" : "gradient"}
                  size="lg"
                  className="w-full"
                >
                  {hasSubmitted ? (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      Registration Complete!
                    </>
                  ) : isSubmitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Heart className="h-5 w-5" />
                      Join Tech for Girls!
                    </>
                  )}
                </Button>
              </form>

              {hasSubmitted && (
                <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="flex items-center justify-center gap-2 text-primary font-medium mb-2">
                    <Users className="h-5 w-5" />
                    Welcome to the community!
                  </div>
                  <p className="text-sm text-muted-foreground">
                    You'll receive further instructions via email soon.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Constant Full-Screen Image */}
        <div className="w-1/2 h-full bg-gradient-to-br from-purple-400 via-purple-500 to-indigo-600 relative overflow-hidden">
          <img
            src="/tech-girl-2.png"
            alt="Tech Girl"
            className="absolute inset-0 w-full h-full object-cover object-center"
            style={{ zIndex: 1, pointerEvents: "none", userSelect: "none" }}
          />
        </div>
      </div>

      {/* Mobile Layout */}
      <Card className="lg:hidden w-full max-w-md gradient-card glow-effect border-0 m-4">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-3xl">
            <Rocket className="h-8 w-8 text-primary" />
            <span className="font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Tech for Girls
            </span>
          </div>
          <CardTitle className="text-2xl">Registration Form</CardTitle>
          <CardDescription className="text-base">
            Join our amazing community of women in tech! 💜
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Share Progress Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-accent" />
              <span className="font-medium">
                Share Progress: {clickCount}/5
              </span>
            </div>

            <Progress value={progressValue} className="h-3" />

            <Button
              onClick={handleShare}
              disabled={clickCount >= 5}
              variant="share"
              size="lg"
              className="w-full"
            >
              {clickCount >= 5 ? (
                <>
                  <CheckCircle className="h-5 w-5" />
                  Sharing Complete!
                </>
              ) : (
                <>
                  <Share2 className="h-5 w-5" />
                  Share on WhatsApp ({5 - clickCount} left)
                </>
              )}
            </Button>

            {clickCount >= 5 && (
              <div className="text-center p-3 bg-success/10 rounded-lg border border-success/20">
                <div className="flex items-center justify-center gap-2 text-success font-medium">
                  <CheckCircle className="h-4 w-4" />
                  Great! You can now register below ⬇️
                </div>
              </div>
            )}
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your full name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                disabled={!isFormUnlocked || hasSubmitted}
                className="tech-input"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Your phone number"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                disabled={!isFormUnlocked || hasSubmitted}
                className="tech-input"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={!isFormUnlocked || hasSubmitted}
                className="tech-input"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="college">College / Department</Label>
              <Input
                id="college"
                type="text"
                placeholder="Your college or department"
                value={formData.college}
                onChange={(e) => handleInputChange("college", e.target.value)}
                disabled={!isFormUnlocked || hasSubmitted}
                className="tech-input"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="screenshot">Upload Screenshot</Label>
              <div className="relative">
                <Input
                  ref={fileInputRef}
                  id="screenshot"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={!isFormUnlocked || hasSubmitted}
                  className="tech-input cursor-pointer"
                  required
                />
                <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
              {formData.screenshot && (
                <p className="text-sm text-success">
                  ✅ {formData.screenshot.name}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={!isFormUnlocked || hasSubmitted || isSubmitting}
              variant={hasSubmitted ? "success" : "gradient"}
              size="lg"
              className="w-full"
            >
              {hasSubmitted ? (
                <>
                  <CheckCircle className="h-5 w-5" />
                  Registration Complete!
                </>
              ) : isSubmitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Submitting...
                </>
              ) : (
                <>
                  <Heart className="h-5 w-5" />
                  Join Tech for Girls!
                </>
              )}
            </Button>
          </form>

          {hasSubmitted && (
            <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-center justify-center gap-2 text-primary font-medium mb-2">
                <Users className="h-5 w-5" />
                Welcome to the community!
              </div>
              <p className="text-sm text-muted-foreground">
                You'll receive further instructions via email soon.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
