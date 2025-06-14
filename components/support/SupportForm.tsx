'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  full_name?: string;
}

interface SupportFormProps {
  user?: User | null;
}

const SUPPORT_TYPES = [
  { value: 'technical', label: 'Technical Issue' },
  { value: 'billing', label: 'Billing Question' },
  { value: 'feature', label: 'Feature Request' },
  { value: 'bug', label: 'Bug Report' },
  { value: 'other', label: 'Other' },
];

export function SupportForm({ user }: SupportFormProps) {
  const [formData, setFormData] = useState({
    name: user?.full_name || '',
    email: user?.email || '',
    type: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAuthenticated = !!user;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Aquí implementarías la lógica para enviar el formulario
      // Por ejemplo, una llamada a tu API
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId: user?.id,
        }),
      });

      if (response.ok) {
        toast.success('Support request sent successfully! We\'ll get back to you soon.');
        // Reset form if not authenticated
        if (!isAuthenticated) {
          setFormData({
            name: '',
            email: '',
            type: '',
            subject: '',
            message: '',
          });
        } else {
          // Only reset non-user fields for authenticated users
          setFormData(prev => ({
            ...prev,
            type: '',
            subject: '',
            message: '',
          }));
        }
      } else {
        throw new Error('Failed to send support request');
      }
    } catch (error) {
      toast.error('Failed to send support request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Support</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={isAuthenticated}
                required
                className={isAuthenticated ? 'bg-muted' : ''}
              />
              {isAuthenticated && (
                <p className="text-xs text-muted-foreground">
                  This field is auto-filled from your account
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={isAuthenticated}
                required
                className={isAuthenticated ? 'bg-muted' : ''}
              />
              {isAuthenticated && (
                <p className="text-xs text-muted-foreground">
                  This field is auto-filled from your account
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type of Issue</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleInputChange('type', value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select the type of issue" />
              </SelectTrigger>
              <SelectContent>
                {SUPPORT_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              type="text"
              value={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              placeholder="Brief description of your issue"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Please provide detailed information about your issue..."
              rows={6}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Sending...' : 'Send Support Request'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}