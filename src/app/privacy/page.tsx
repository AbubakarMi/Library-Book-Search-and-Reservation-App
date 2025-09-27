"use client";

import { Shield, Lock, Eye, Database, Mail, Phone } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 bg-primary/10 rounded-full">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            At LibroReserva, we are committed to protecting your privacy and ensuring the security of your personal information. This policy explains how we collect, use, and protect your data.
          </p>
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="h-5 w-5" />
              <span>Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              LibroReserva is a library management system that helps you search, reserve, and manage book borrowings.
              We collect only the information necessary to provide our services and never sell your personal data to third parties.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Lock className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <h3 className="font-semibold text-sm">Secure</h3>
                <p className="text-xs text-muted-foreground">Your data is encrypted and protected</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Database className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <h3 className="font-semibold text-sm">Minimal</h3>
                <p className="text-xs text-muted-foreground">We collect only what's necessary</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Shield className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                <h3 className="font-semibold text-sm">Transparent</h3>
                <p className="text-xs text-muted-foreground">Clear policies and practices</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Information We Collect */}
        <Card>
          <CardHeader>
            <CardTitle>Information We Collect</CardTitle>
            <CardDescription>
              We collect information to provide and improve our library services.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Account Information</h3>
              <ul className="text-sm space-y-1 text-muted-foreground ml-4">
                <li>• Name and student/staff ID</li>
                <li>• Email address</li>
                <li>• Phone number (optional)</li>
                <li>• Academic department or role</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">Usage Information</h3>
              <ul className="text-sm space-y-1 text-muted-foreground ml-4">
                <li>• Search queries and book interactions</li>
                <li>• Reservation and borrowing history</li>
                <li>• Login times and device information</li>
                <li>• Feature usage and preferences</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">Technical Information</h3>
              <ul className="text-sm space-y-1 text-muted-foreground ml-4">
                <li>• IP address and browser information</li>
                <li>• Device type and operating system</li>
                <li>• Cookies and local storage data</li>
                <li>• Performance and error logs</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Information */}
        <Card>
          <CardHeader>
            <CardTitle>How We Use Your Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Service Provision</h3>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Process book reservations and loans</li>
                  <li>• Send notifications about due dates</li>
                  <li>• Provide personalized recommendations</li>
                  <li>• Maintain your account and preferences</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Service Improvement</h3>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Analyze usage patterns and trends</li>
                  <li>• Improve search and recommendation algorithms</li>
                  <li>• Debug and fix technical issues</li>
                  <li>• Develop new features and services</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Sharing */}
        <Card>
          <CardHeader>
            <CardTitle>Data Sharing and Disclosure</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                We DO NOT sell your personal data
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300">
                Your personal information is never sold to third parties for marketing or commercial purposes.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Limited Sharing</h3>
              <p className="text-sm text-muted-foreground mb-2">
                We may share your information only in these specific circumstances:
              </p>
              <ul className="text-sm space-y-1 text-muted-foreground ml-4">
                <li>• With library staff to process reservations and manage lending</li>
                <li>• With technical service providers who help maintain our systems</li>
                <li>• When required by law or to protect rights and safety</li>
                <li>• With your explicit consent for specific purposes</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card>
          <CardHeader>
            <CardTitle>Data Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              We implement industry-standard security measures to protect your information:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Technical Safeguards</h3>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Encryption in transit and at rest</li>
                  <li>• Secure authentication systems</li>
                  <li>• Regular security audits and updates</li>
                  <li>• Access controls and monitoring</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Operational Safeguards</h3>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Staff training on data protection</li>
                  <li>• Limited access on need-to-know basis</li>
                  <li>• Regular backup and recovery procedures</li>
                  <li>• Incident response protocols</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card>
          <CardHeader>
            <CardTitle>Your Rights and Choices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              You have the following rights regarding your personal information:
            </p>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-sm">Access and Portability</h3>
                  <p className="text-sm text-muted-foreground">Request a copy of your personal data</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-sm">Correction</h3>
                  <p className="text-sm text-muted-foreground">Update or correct inaccurate information</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-sm">Deletion</h3>
                  <p className="text-sm text-muted-foreground">Request deletion of your account and data</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-sm">Notification Preferences</h3>
                  <p className="text-sm text-muted-foreground">Control email and push notifications</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cookies and Tracking */}
        <Card>
          <CardHeader>
            <CardTitle>Cookies and Tracking</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              We use cookies and similar technologies to enhance your experience:
            </p>
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-sm">Essential Cookies</h3>
                <p className="text-sm text-muted-foreground">Required for basic functionality like login and security</p>
              </div>
              <div>
                <h3 className="font-semibold text-sm">Preference Cookies</h3>
                <p className="text-sm text-muted-foreground">Remember your settings and preferences</p>
              </div>
              <div>
                <h3 className="font-semibold text-sm">Analytics Cookies</h3>
                <p className="text-sm text-muted-foreground">Help us understand usage patterns (anonymized)</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              You can manage cookie preferences in your browser settings or through our{' '}
              <Link href="/settings" className="text-primary hover:underline">
                Settings page
              </Link>.
            </p>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              If you have questions about this privacy policy or want to exercise your rights, please contact us:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">privacy@libroreserva.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Support</p>
                  <Link href="/support" className="text-sm text-primary hover:underline">
                    Visit Support Center
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            This privacy policy is effective as of the date listed above and may be updated periodically.
            We will notify users of significant changes through the app or via email.
          </p>
        </div>
      </div>
    </div>
  );
}