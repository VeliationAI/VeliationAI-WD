
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: any | null;
  subscription: any | null;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  fetchProfile: () => Promise<void>;
  updateProfile: (updates: any) => Promise<void>;
  createSubscription: (plan: string, billingCycle: string, amount: number) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [subscription, setSubscription] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event);
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          fetchProfile();
          fetchSubscription();
        } else {
          setProfile(null);
          setSubscription(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile();
        fetchSubscription();
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async () => {
    try {
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchSubscription = async () => {
    try {
      if (!user) return;

      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is the code for "no rows returned"
        console.error('Error fetching subscription:', error);
        return;
      }

      setSubscription(data || null);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        }
      });

      if (error) throw error;

      toast.success('Signup successful! Please check your email for verification.');
      navigate('/auth/signin');
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during signup');
      console.error('Error signing up:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success('Successfully signed in!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during sign in');
      console.error('Error signing in:', error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success('Successfully signed out');
      navigate('/auth/signin');
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during sign out');
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: any) => {
    try {
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Profile updated successfully!');
      await fetchProfile();
    } catch (error: any) {
      toast.error(error.message || 'Error updating profile');
      console.error('Error updating profile:', error);
    }
  };

  const createSubscription = async (plan: string, billingCycle: string, amount: number) => {
    try {
      if (!user) {
        toast.error('You must be logged in to create a subscription');
        return;
      }

      const { data, error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user.id,
          plan: plan,
          status: 'active',
          billing_cycle: billingCycle,
          amount: amount,
        })
        .select();

      if (error) throw error;

      toast.success(`Successfully subscribed to ${plan} plan!`);
      setSubscription(data[0]);
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Error creating subscription');
      console.error('Error creating subscription:', error);
    }
  };

  const value = {
    session,
    user,
    profile,
    subscription,
    signUp,
    signIn,
    signOut,
    loading,
    fetchProfile,
    updateProfile,
    createSubscription,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
