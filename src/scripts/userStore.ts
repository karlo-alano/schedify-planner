import { supabase } from '../lib/supabase.ts';
import type { AuthError, AuthResponse, User, Session } from '@supabase/supabase-js';

// Signup/Registration method
export async function signUp(email: string, password: string, username: string): Promise<{ data: AuthResponse['data'] | null; error: AuthError | null }> {
  try {
    // First, sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      throw authError;
    }

    // If signup successful and user exists, insert into custom users table
    if (authData.user) {
      const { error: insertError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            username,
            email,
          },
        ]);

      if (insertError) {
        console.error('Error inserting user data:', insertError);
        // Note: Auth user was created but custom user data failed
        // You might want to handle this case differently
      }
    }

    return { data: authData, error: null };
  } catch (error) {
    console.error('Signup error:', error);
    return { data: null, error: error as AuthError };
  }
}

// Login method
export async function signIn(email: string, password: string): Promise<{ data: AuthResponse['data'] | null; error: AuthError | null }> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error('Login error:', error);
    return { data: null, error: error as AuthError };
  }
}

// Logout method
export async function signOut(): Promise<{ error: AuthError | null }> {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    return { error: null };
  } catch (error) {
    console.error('Logout error:', error);
    return { error: error as AuthError };
  }
}

// Get current user
export async function getCurrentUser(): Promise<{ user: User | null; error: AuthError | null }> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      throw error;
    }

    return { user, error: null };
  } catch (error) {
    console.error('Get current user error:', error);
    return { user: null, error: error as AuthError };
  }
}

// Get current session
export async function getCurrentSession(): Promise<{ session: Session | null; error: AuthError | null }> {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      throw error;
    }

    return { session, error: null };
  } catch (error) {
    console.error('Get current session error:', error);
    return { session: null, error: error as AuthError };
  }
}