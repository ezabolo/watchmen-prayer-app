import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

const subscriptionSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postal: z.string().optional(),
  wantsNewsletter: z.boolean().default(true),
  wantsPrayerEvents: z.boolean().default(false),
});

type SubscriptionData = z.infer<typeof subscriptionSchema>;

export default function SubscriptionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<SubscriptionData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postal: '',
      wantsNewsletter: true,
      wantsPrayerEvents: false,
    },
  });

  const onSubmit = async (data: SubscriptionData) => {
    setIsSubmitting(true);
    try {
      const response = await apiRequest('POST', '/api/subscribe', data);
      const result = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        form.reset();
        toast({
          title: "Subscription Successful!",
          description: result.verified 
            ? result.message
            : "Please check your email to verify your subscription.",
        });
      } else {
        throw new Error(result.message || 'Subscription failed');
      }
    } catch (error) {
      toast({
        title: "Subscription Failed",
        description: error instanceof Error ? error.message : "There was an error with your subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-green-50 border border-green-200 rounded-lg text-center">
        <div className="text-green-600 text-4xl mb-4">✓</div>
        <h3 className="text-xl font-semibold text-green-800 mb-2">
          Thank You for Subscribing!
        </h3>
        <p className="text-green-700 mb-4">
          Please check your email to verify your subscription and start receiving updates from Prayer Watchman.
        </p>
        <Button 
          onClick={() => setIsSuccess(false)}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          Subscribe Another Email
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-8">
        <p className="text-gray-700 text-base mb-2">
          Sign up for our email list to join with
        </p>
        <p className="text-gray-900 font-semibold text-base">
          Prayer Watchman in spreading the gospel to unreached people.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm text-gray-700 mb-2">
              First Name*
            </label>
            <Input
              id="firstName"
              type="text"
              {...form.register('firstName')}
              className="w-full h-12 border-gray-300 rounded-md"
              disabled={isSubmitting}
            />
            {form.formState.errors.firstName && (
              <p className="text-red-600 text-sm mt-1">{form.formState.errors.firstName.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm text-gray-700 mb-2">
              Last Name*
            </label>
            <Input
              id="lastName"
              type="text"
              {...form.register('lastName')}
              className="w-full h-12 border-gray-300 rounded-md"
              disabled={isSubmitting}
            />
            {form.formState.errors.lastName && (
              <p className="text-red-600 text-sm mt-1">{form.formState.errors.lastName.message}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm text-gray-700 mb-2">
            Email Address*
          </label>
          <Input
            id="email"
            type="email"
            {...form.register('email')}
            className="w-full h-12 border-gray-300 rounded-md"
            disabled={isSubmitting}
          />
          {form.formState.errors.email && (
            <p className="text-red-600 text-sm mt-1">{form.formState.errors.email.message}</p>
          )}
        </div>

        {/* Email Preferences */}
        <div>
          <label className="block text-sm text-gray-700 mb-3">
            Email Preferences*
          </label>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="wantsNewsletter"
                checked={form.watch('wantsNewsletter')}
                onCheckedChange={(checked) => form.setValue('wantsNewsletter', !!checked)}
                disabled={isSubmitting}
                className="w-4 h-4"
              />
              <label 
                htmlFor="wantsNewsletter" 
                className="text-sm text-gray-700"
              >
                Prayer Watchman Newsletter
              </label>
            </div>
            <div className="flex items-center space-x-3">
              <Checkbox
                id="wantsPrayerEvents"
                checked={form.watch('wantsPrayerEvents')}
                onCheckedChange={(checked) => form.setValue('wantsPrayerEvents', !!checked)}
                disabled={isSubmitting}
                className="w-4 h-4"
              />
              <label 
                htmlFor="wantsPrayerEvents" 
                className="text-sm text-gray-700"
              >
                Prayer Watchman Events
              </label>
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div>
          <p className="text-sm text-gray-700 mb-4">
            Add your address below if you would like to be added to our print mailing list.
          </p>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="addressLine1" className="block text-sm text-gray-700 mb-2">
                Address Line 1
              </label>
              <Input
                id="addressLine1"
                type="text"
                {...form.register('addressLine1')}
                className="w-full h-12 border-gray-300 rounded-md"
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <label htmlFor="addressLine2" className="block text-sm text-gray-700 mb-2">
                Address Line 2
              </label>
              <Input
                id="addressLine2"
                type="text"
                {...form.register('addressLine2')}
                className="w-full h-12 border-gray-300 rounded-md"
                disabled={isSubmitting}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm text-gray-700 mb-2">
                  City
                </label>
                <Input
                  id="city"
                  type="text"
                  {...form.register('city')}
                  className="w-full h-12 border-gray-300 rounded-md"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label htmlFor="state" className="block text-sm text-gray-700 mb-2">
                  State
                </label>
                <Input
                  id="state"
                  type="text"
                  {...form.register('state')}
                  className="w-full h-12 border-gray-300 rounded-md"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label htmlFor="postal" className="block text-sm text-gray-700 mb-2">
                  Postal
                </label>
                <Input
                  id="postal"
                  type="text"
                  {...form.register('postal')}
                  className="w-full h-12 border-gray-300 rounded-md"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            disabled={isSubmitting || (!form.watch('wantsNewsletter') && !form.watch('wantsPrayerEvents'))}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-base font-semibold rounded-md h-14"
          >
            {isSubmitting ? 'Signing Up...' : 'Sign Up for Newsletter'}
          </Button>
        </div>

        {(!form.watch('wantsNewsletter') && !form.watch('wantsPrayerEvents')) && (
          <p className="text-amber-600 text-sm text-center">
            Please select at least one email preference to continue.
          </p>
        )}
      </form>
    </div>
  );
}