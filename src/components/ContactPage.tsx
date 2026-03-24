/*Jonathan Torres wrote all 242 lines of code for this file */
import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";
import { toast } from "sonner@2.0.3";

/* API URL */
const API_URL = import.meta.env.VITE_API_URL;

//remove later
console.log("API_URL =", API_URL);

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Here you would typically send the form data to a backend
    console.log("Contact form submitted:", formData);
    
    // Show success message
    toast.success("Thank you for contacting us! We'll get back to you soon.");
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: ""
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl text-gray-900 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have a question or feedback? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg text-gray-900 mb-1">Email</h3>
                  <p className="text-sm text-gray-600">support@calcura.com</p>
                  <p className="text-sm text-gray-600">hello@calcura.com</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg text-gray-900 mb-1">Phone</h3>
                  <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
                  <p className="text-xs text-gray-500 mt-1">Mon-Fri, 9AM-5PM EST</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg text-gray-900 mb-1">Office</h3>
                  <p className="text-sm text-gray-600">
                    123 Finance Street<br />
                    Suite 400<br />
                    New York, NY 10001
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-green-50 to-blue-50">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg text-gray-900 mb-2">Quick Response</h3>
                  <p className="text-sm text-gray-600">
                    We typically respond to all inquiries within 24 hours during business days.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              <h2 className="text-2xl text-gray-900 mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john.doe@example.com"
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number (Optional)</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="message">
                    Message <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help you..."
                    className="mt-1 min-h-[200px]"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Please include as much detail as possible so we can better assist you.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button 
                    type="submit" 
                    className="bg-green-600 hover:bg-green-700 gap-2"
                  >
                    <Send size={18} />
                    Send Message
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setFormData({ name: "", email: "", phone: "", message: "" })}
                  >
                    Clear Form
                  </Button>
                </div>
              </form>
            </Card>

            {/* FAQ Section */}
            <Card className="p-8 mt-6">
              <h3 className="text-xl text-gray-900 mb-4">Frequently Asked Questions</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-gray-900 mb-1">How quickly will I receive a response?</h4>
                  <p className="text-sm text-gray-600">
                    We aim to respond to all inquiries within 24 hours during business days (Monday-Friday).
                  </p>
                </div>
                <div>
                  <h4 className="text-gray-900 mb-1">Is Calcura really free?</h4>
                  <p className="text-sm text-gray-600">
                    Yes! Calcura is completely free with no hidden fees or subscription costs.
                  </p>
                </div>
                <div>
                  <h4 className="text-gray-900 mb-1">How is my data protected?</h4>
                  <p className="text-sm text-gray-600">
                    We use industry-standard encryption and security measures to protect your financial data. Visit our Privacy Policy for more details.
                  </p>
                </div>
                <div>
                  <h4 className="text-gray-900 mb-1">Can I suggest new features?</h4>
                  <p className="text-sm text-gray-600">
                    Absolutely! We love hearing from our users. Use this contact form to share your ideas and feature requests.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
