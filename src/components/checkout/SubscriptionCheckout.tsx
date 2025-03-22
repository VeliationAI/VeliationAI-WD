
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { CreditCard, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface SubscriptionCheckoutProps {
  selectedPlan: string;
  billingCycle: string;
  amount: number;
}

const paymentSchema = z.object({
  cardNumber: z.string().min(16, 'Card number must be at least 16 digits').max(19),
  cardName: z.string().min(2, 'Cardholder name is required'),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, 'Expiry date must be in MM/YY format'),
  cvv: z.string().regex(/^[0-9]{3,4}$/, 'CVV must be 3-4 digits'),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

const SubscriptionCheckout: React.FC<SubscriptionCheckoutProps> = ({ 
  selectedPlan,
  billingCycle,
  amount 
}) => {
  const { createSubscription, user } = useAuth();
  const [isProcessing, setIsProcessing] = React.useState(false);

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardNumber: '',
      cardName: '',
      expiryDate: '',
      cvv: '',
    },
  });

  const onSubmit = async (data: PaymentFormValues) => {
    try {
      if (!user) {
        toast.error('You must be logged in to create a subscription');
        return;
      }

      setIsProcessing(true);
      
      // In a real app, this would process payment with a payment provider
      // For this demo, we'll simulate a successful payment
      setTimeout(async () => {
        await createSubscription(selectedPlan, billingCycle, amount);
        setIsProcessing(false);
      }, 2000);
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment processing failed. Please try again.');
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    // Limit to 16 digits
    const limited = digits.substring(0, 16);
    // Format with spaces every 4 digits
    return limited.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    form.setValue('cardNumber', formatted);
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    
    form.setValue('expiryDate', value);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Complete Your Subscription</CardTitle>
        <CardDescription>Enter your payment details to subscribe to the {selectedPlan} plan</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 space-y-2">
          <div className="flex justify-between">
            <span>Selected Plan:</span>
            <span className="font-semibold capitalize">{selectedPlan}</span>
          </div>
          <div className="flex justify-between">
            <span>Billing Cycle:</span>
            <span className="font-semibold capitalize">{billingCycle}</span>
          </div>
          <div className="flex justify-between">
            <span>Amount:</span>
            <span className="font-semibold">${amount.toFixed(2)} {billingCycle === 'monthly' ? '/month' : billingCycle === 'quarterly' ? '/quarter' : '/year'}</span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="cardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Number</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="1234 5678 9012 3456" 
                      {...field} 
                      onChange={handleCardNumberChange}
                      maxLength={19}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="cardName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cardholder Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiry Date</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="MM/YY" 
                        {...field} 
                        onChange={handleExpiryDateChange}
                        maxLength={5}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cvv"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CVV</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="123" 
                        {...field} 
                        maxLength={4}
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700" 
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Subscribe Now
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground text-center w-full">
          Your subscription includes a 7-day free trial. Cancel anytime.
        </p>
      </CardFooter>
    </Card>
  );
};

export default SubscriptionCheckout;
