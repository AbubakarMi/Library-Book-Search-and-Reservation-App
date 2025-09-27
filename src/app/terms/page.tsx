"use client";

import { Scale, BookOpen, Clock, AlertTriangle, Users, Gavel } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 bg-primary/10 rounded-full">
              <Scale className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">Terms of Service</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Welcome to LibroReserva. These terms govern your use of our library management system.
            By using our services, you agree to be bound by these terms.
          </p>
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Important Notice */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Please read these terms carefully. By accessing or using LibroReserva, you agree to be bound by these terms.
            If you do not agree with any part of these terms, you may not use our service.
          </AlertDescription>
        </Alert>

        {/* Acceptance of Terms */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Gavel className="h-5 w-5" />
              <span>Acceptance of Terms</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              By accessing and using LibroReserva, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold text-sm mb-2">Agreement Scope</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• These terms apply to all users of the LibroReserva system</li>
                <li>• Includes students, faculty, staff, and authorized library users</li>
                <li>• Covers use of web application, mobile app, and all related services</li>
                <li>• Supersedes any prior agreements or understandings</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Service Description */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <span>Service Description</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              LibroReserva is a digital library management system that provides the following services:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Core Services</h3>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Book search and discovery</li>
                  <li>• Online reservation system</li>
                  <li>• Account management</li>
                  <li>• Notification services</li>
                  <li>• Borrowing history tracking</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Additional Features</h3>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Personalized recommendations</li>
                  <li>• Wishlist and favorites</li>
                  <li>• Due date reminders</li>
                  <li>• Mobile app access</li>
                  <li>• Offline functionality</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Responsibilities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>User Responsibilities</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Account Security</h3>
              <ul className="text-sm space-y-1 text-muted-foreground ml-4">
                <li>• Maintain the confidentiality of your account credentials</li>
                <li>• Notify us immediately of any unauthorized access</li>
                <li>• Use strong passwords and update them regularly</li>
                <li>• Do not share your account with others</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">Proper Use</h3>
              <ul className="text-sm space-y-1 text-muted-foreground ml-4">
                <li>• Use the service only for legitimate academic and research purposes</li>
                <li>• Respect reservation limits and borrowing periods</li>
                <li>• Provide accurate information when creating reservations</li>
                <li>• Report technical issues or bugs promptly</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">Prohibited Activities</h3>
              <ul className="text-sm space-y-1 text-muted-foreground ml-4">
                <li>• Creating false or misleading reservations</li>
                <li>• Attempting to circumvent system limitations</li>
                <li>• Using automated tools to make bulk reservations</li>
                <li>• Interfering with other users' access to the system</li>
                <li>• Reverse engineering or attempting to extract source code</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Library Policies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Library Policies and Procedures</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Reservation Policies</h3>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <ul className="text-sm space-y-1 text-blue-700 dark:text-blue-300">
                  <li>• Maximum of 5 active reservations per user</li>
                  <li>• Reservations expire after 3 days if not collected</li>
                  <li>• Books must be collected during library operating hours</li>
                  <li>• Valid ID required for book collection</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Borrowing Policies</h3>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <ul className="text-sm space-y-1 text-green-700 dark:text-green-300">
                  <li>• Standard loan period: 14 days for students, 28 days for faculty</li>
                  <li>• Renewals available if no other reservations exist</li>
                  <li>• Late fees apply for overdue items</li>
                  <li>• Account suspension for items overdue by 30+ days</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Notification Policies</h3>
              <ul className="text-sm space-y-1 text-muted-foreground ml-4">
                <li>• Email notifications for reservation confirmations and due dates</li>
                <li>• SMS notifications available for urgent reminders</li>
                <li>• Users responsible for maintaining current contact information</li>
                <li>• Notification preferences can be managed in account settings</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Intellectual Property */}
        <Card>
          <CardHeader>
            <CardTitle>Intellectual Property</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Our Rights</h3>
              <p className="text-sm text-muted-foreground mb-2">
                LibroReserva and its original content, features, and functionality are owned by the library and are protected by:
              </p>
              <ul className="text-sm space-y-1 text-muted-foreground ml-4">
                <li>• Copyright, trademark, and other intellectual property laws</li>
                <li>• International copyright treaties and conventions</li>
                <li>• Other proprietary rights legislation</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">User Content</h3>
              <p className="text-sm text-muted-foreground">
                By using our service, you grant us a non-exclusive, royalty-free license to use any feedback,
                suggestions, or improvements you provide to enhance the service for all users.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Limitation of Liability */}
        <Card>
          <CardHeader>
            <CardTitle>Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                Service Availability
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                While we strive to maintain service availability, LibroReserva is provided "as is" without
                warranty of any kind. We do not guarantee uninterrupted or error-free service.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Limitation Scope</h3>
              <ul className="text-sm space-y-1 text-muted-foreground ml-4">
                <li>• We are not liable for any indirect, incidental, or consequential damages</li>
                <li>• System downtime or maintenance periods are not considered service failures</li>
                <li>• Users are responsible for their own data backup and security</li>
                <li>• Physical book availability is subject to library policies and third-party factors</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Privacy and Data Protection */}
        <Card>
          <CardHeader>
            <CardTitle>Privacy and Data Protection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Your privacy is important to us. Our collection and use of personal information is governed by our{' '}
              <Link href="/privacy" className="text-primary hover:underline font-medium">
                Privacy Policy
              </Link>, which forms part of these terms.
            </p>
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">Key Privacy Points</h3>
              <ul className="text-sm space-y-1 text-muted-foreground ml-4">
                <li>• We collect only necessary information to provide library services</li>
                <li>• Your personal data is never sold to third parties</li>
                <li>• You have rights to access, correct, and delete your data</li>
                <li>• We use industry-standard security measures to protect your information</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Modifications to Terms */}
        <Card>
          <CardHeader>
            <CardTitle>Modifications to Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting.
            </p>
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold text-sm mb-2">Notification Process</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Significant changes will be announced through the application</li>
                <li>• Email notifications sent to active users for major updates</li>
                <li>• Continued use constitutes acceptance of modified terms</li>
                <li>• Users may request termination if they disagree with changes</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Termination */}
        <Card>
          <CardHeader>
            <CardTitle>Account Termination</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-sm mb-2">User-Initiated Termination</h3>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Users may close accounts at any time</li>
                  <li>• All active reservations must be resolved</li>
                  <li>• Outstanding library obligations must be cleared</li>
                  <li>• Data deletion available upon request</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-2">Service-Initiated Termination</h3>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Accounts may be suspended for policy violations</li>
                  <li>• Automatic suspension for overdue items (30+ days)</li>
                  <li>• Permanent termination for serious misuse</li>
                  <li>• Appeal process available for disputed actions</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              If you have questions about these Terms of Service, please contact us:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-sm">General Inquiries</h3>
                <p className="text-sm text-muted-foreground">terms@libroreserva.com</p>
              </div>
              <div>
                <h3 className="font-semibold text-sm">Support Center</h3>
                <Link href="/support" className="text-sm text-primary hover:underline">
                  Visit Support Center
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Governing Law */}
        <Card>
          <CardHeader>
            <CardTitle>Governing Law</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              These Terms of Service are governed by and construed in accordance with the laws of the jurisdiction
              where the library is located. Any disputes arising from these terms will be resolved through the
              appropriate legal channels in that jurisdiction.
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            By continuing to use LibroReserva, you acknowledge that you have read, understood,
            and agree to be bound by these Terms of Service.
          </p>
        </div>
      </div>
    </div>
  );
}