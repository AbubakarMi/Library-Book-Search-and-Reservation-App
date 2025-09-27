"use client";

import { useState } from 'react';
import { HelpCircle, Mail, Phone, MessageCircle, Search, BookOpen, AlertCircle, Clock, ChevronDown, ChevronRight, Send } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
}

const faqs: FAQ[] = [
  {
    id: '1',
    question: 'How do I reserve a book?',
    answer: 'To reserve a book, search for it using the search bar, click on the book you want, and then click the "Reserve" button. You\'ll receive a confirmation email and notification when the book is ready for pickup.',
    category: 'reservations',
    tags: ['reserve', 'booking', 'search']
  },
  {
    id: '2',
    question: 'How long can I keep a reserved book?',
    answer: 'Students can borrow books for 14 days, while faculty and staff can borrow for 28 days. You can renew books online if no one else has reserved them.',
    category: 'borrowing',
    tags: ['duration', 'renewal', 'deadline']
  },
  {
    id: '3',
    question: 'What happens if I return a book late?',
    answer: 'Late fees apply for overdue books. The fee is ₦50 per day for students and ₦100 per day for faculty/staff. If a book is more than 30 days overdue, your account may be suspended.',
    category: 'borrowing',
    tags: ['late fees', 'overdue', 'suspension']
  },
  {
    id: '4',
    question: 'How do I reset my password?',
    answer: 'Click "Forgot Password" on the login page, enter your email address, and you\'ll receive a 6-digit code to reset your password. The code expires in 15 minutes.',
    category: 'account',
    tags: ['password', 'reset', 'login']
  },
  {
    id: '5',
    question: 'Can I cancel a reservation?',
    answer: 'Yes, you can cancel reservations from your dashboard under "My Reservations" as long as the book hasn\'t been prepared for pickup yet.',
    category: 'reservations',
    tags: ['cancel', 'reservation', 'dashboard']
  },
  {
    id: '6',
    question: 'Why am I not receiving notifications?',
    answer: 'Check your notification settings in your account preferences. Also ensure your email address is correct and check your spam folder. For push notifications, make sure you\'ve granted browser permissions.',
    category: 'technical',
    tags: ['notifications', 'email', 'push', 'settings']
  },
  {
    id: '7',
    question: 'How many books can I reserve at once?',
    answer: 'You can have a maximum of 5 active reservations at any time. This includes both pending reservations and books ready for pickup.',
    category: 'reservations',
    tags: ['limit', 'maximum', 'multiple']
  },
  {
    id: '8',
    question: 'Is there a mobile app?',
    answer: 'Yes! You can install LibroReserva as a Progressive Web App (PWA) on your mobile device. Look for the "Install" prompt when visiting the site, or use the install option in your browser menu.',
    category: 'technical',
    tags: ['mobile', 'app', 'pwa', 'install']
  }
];

export default function SupportPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openFAQs, setOpenFAQs] = useState<string[]>([]);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    category: '',
    subject: '',
    message: ''
  });
  const { toast } = useToast();

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'reservations', label: 'Reservations' },
    { value: 'borrowing', label: 'Borrowing' },
    { value: 'account', label: 'Account' },
    { value: 'technical', label: 'Technical' }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFAQ = (id: string) => {
    setOpenFAQs(prev =>
      prev.includes(id) ? prev.filter(faqId => faqId !== id) : [...prev, id]
    );
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 24 hours.",
      duration: 5000,
    });
    setContactForm({ name: '', email: '', category: '', subject: '', message: '' });
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 bg-primary/10 rounded-full">
              <HelpCircle className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">Support Center</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get help with LibroReserva. Find answers to common questions, report issues,
            or contact our support team directly.
          </p>
        </div>

        {/* Quick Help Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="text-center">
              <BookOpen className="h-8 w-8 mx-auto text-blue-500 mb-2" />
              <CardTitle className="text-lg">Getting Started</CardTitle>
              <CardDescription>New to LibroReserva? Learn the basics</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button variant="outline" className="w-full">
                View Tutorial
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="text-center">
              <AlertCircle className="h-8 w-8 mx-auto text-orange-500 mb-2" />
              <CardTitle className="text-lg">Report Issue</CardTitle>
              <CardDescription>Found a bug or having problems?</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button variant="outline" className="w-full">
                Report Problem
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="text-center">
              <Clock className="h-8 w-8 mx-auto text-green-500 mb-2" />
              <CardTitle className="text-lg">Service Status</CardTitle>
              <CardDescription>Check system status and uptime</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600">All Systems Operational</span>
              </div>
              <Button variant="outline" className="w-full">
                View Status
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Support Content */}
        <Tabs defaultValue="faq" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="faq">Frequently Asked Questions</TabsTrigger>
            <TabsTrigger value="contact">Contact Support</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Find quick answers to the most common questions about LibroReserva.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search and Filter */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search FAQs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* FAQ List */}
                <div className="space-y-2">
                  {filteredFAQs.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <HelpCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No FAQs found matching your search.</p>
                      <p className="text-sm">Try different keywords or contact support.</p>
                    </div>
                  ) : (
                    filteredFAQs.map((faq) => (
                      <Collapsible key={faq.id}>
                        <CollapsibleTrigger
                          className="flex items-center justify-between w-full p-4 text-left bg-muted/50 hover:bg-muted rounded-lg transition-colors"
                          onClick={() => toggleFAQ(faq.id)}
                        >
                          <div className="flex-1">
                            <h3 className="font-medium">{faq.question}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {categories.find(c => c.value === faq.category)?.label}
                              </Badge>
                            </div>
                          </div>
                          {openFAQs.includes(faq.id) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </CollapsibleTrigger>
                        <CollapsibleContent className="p-4 bg-background border border-t-0 rounded-b-lg">
                          <p className="text-muted-foreground">{faq.answer}</p>
                          <div className="flex flex-wrap gap-1 mt-3">
                            {faq.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Contact Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Send us a Message</CardTitle>
                  <CardDescription>
                    Can't find what you're looking for? Send us a message and we'll get back to you.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={contactForm.name}
                          onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={contactForm.email}
                          onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={contactForm.category}
                        onValueChange={(value) => setContactForm(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technical">Technical Issue</SelectItem>
                          <SelectItem value="account">Account Problem</SelectItem>
                          <SelectItem value="reservation">Reservation Issue</SelectItem>
                          <SelectItem value="general">General Question</SelectItem>
                          <SelectItem value="feature">Feature Request</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        value={contactForm.subject}
                        onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        rows={4}
                        value={contactForm.message}
                        onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                        placeholder="Please describe your issue or question in detail..."
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Other Ways to Reach Us</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Email Support</p>
                        <p className="text-sm text-muted-foreground">support@libroreserva.com</p>
                        <p className="text-xs text-muted-foreground">Response within 24 hours</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Library Desk</p>
                        <p className="text-sm text-muted-foreground">(555) 123-4567</p>
                        <p className="text-xs text-muted-foreground">Mon-Fri 9AM-6PM, Sat 10AM-4PM</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <MessageCircle className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Live Chat</p>
                        <p className="text-sm text-muted-foreground">Available during library hours</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          Start Chat
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Response Times</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">General Questions</span>
                      <Badge variant="secondary">24 hours</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Technical Issues</span>
                      <Badge variant="secondary">12 hours</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Urgent/Critical</span>
                      <Badge variant="default">2 hours</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Account Issues</span>
                      <Badge variant="secondary">6 hours</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">User Guide</CardTitle>
                  <CardDescription>Complete guide to using LibroReserva</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• Getting started</li>
                    <li>• Searching for books</li>
                    <li>• Making reservations</li>
                    <li>• Managing your account</li>
                  </ul>
                  <Button variant="outline" className="w-full mt-4">
                    View Guide
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Video Tutorials</CardTitle>
                  <CardDescription>Step-by-step video guides</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• How to reserve a book</li>
                    <li>• Setting up notifications</li>
                    <li>• Using the mobile app</li>
                    <li>• Managing preferences</li>
                  </ul>
                  <Button variant="outline" className="w-full mt-4">
                    Watch Videos
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Policies</CardTitle>
                  <CardDescription>Library rules and regulations</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li>• <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link></li>
                    <li>• <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link></li>
                    <li>• Borrowing policies</li>
                    <li>• Late fee structure</li>
                  </ul>
                  <Button variant="outline" className="w-full mt-4">
                    View Policies
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* System Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>System Requirements</CardTitle>
                <CardDescription>
                  Minimum requirements for optimal LibroReserva experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Supported Browsers</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Chrome 90+ (Recommended)</li>
                      <li>• Firefox 88+</li>
                      <li>• Safari 14+</li>
                      <li>• Edge 90+</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Mobile Devices</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• iOS 14+ (Safari, Chrome)</li>
                      <li>• Android 8+ (Chrome, Firefox)</li>
                      <li>• PWA installation supported</li>
                      <li>• Offline functionality available</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}