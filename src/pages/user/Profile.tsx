
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { Loader2, User, CreditCard, LogOut } from 'lucide-react';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const UserProfile = () => {
  const { user, profile, subscription, signOut, updateProfile, loading } = useAuth();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: profile?.full_name || '',
    },
    values: {
      fullName: profile?.full_name || '',
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    await updateProfile({ full_name: data.fullName });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
          
          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Account Information
                </CardTitle>
                <CardDescription>
                  Manage your account details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="space-y-2">
                      <FormLabel>Email</FormLabel>
                      <Input value={user?.email || ''} disabled />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : 'Update Profile'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="outline" onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Subscription Details
                </CardTitle>
                <CardDescription>
                  Manage your subscription
                </CardDescription>
              </CardHeader>
              <CardContent>
                {subscription ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-muted-foreground">Plan:</div>
                      <div className="font-medium capitalize">{subscription.plan}</div>
                      
                      <div className="text-muted-foreground">Status:</div>
                      <div className="font-medium capitalize">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          subscription.status === 'active' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                          {subscription.status}
                        </span>
                      </div>
                      
                      <div className="text-muted-foreground">Billing:</div>
                      <div className="font-medium capitalize">{subscription.billing_cycle}</div>
                      
                      <div className="text-muted-foreground">Amount:</div>
                      <div className="font-medium">${subscription.amount}</div>
                      
                      <div className="text-muted-foreground">Start Date:</div>
                      <div className="font-medium">
                        {new Date(subscription.start_date).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => window.location.href = '/subscription'}
                    >
                      Manage Subscription
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-6 space-y-4">
                    <p className="text-muted-foreground">
                      You don't have an active subscription.
                    </p>
                    <Button onClick={() => window.location.href = '/subscription'}>
                      View Plans
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
