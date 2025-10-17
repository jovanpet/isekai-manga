'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
    User,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signUp: (email: string, password: string) => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('AuthProvider: Setting up auth state listener');
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            console.log('AuthProvider: Auth state changed:', user ? 'User logged in' : 'No user');
            setUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const signUp = async (email: string, password: string): Promise<void> => {
        try {
            console.log('AuthContext: Attempting to create account');
            const result = await createUserWithEmailAndPassword(auth, email, password);
            console.log('AuthContext: Account created successfully', result.user.uid);
        } catch (error: any) {
            console.error('Error creating account:', error);
            throw new Error(error.message || 'Failed to create account');
        }
    };

    const signIn = async (email: string, password: string): Promise<void> => {
        try {
            console.log('AuthContext: Attempting to sign in');
            const result = await signInWithEmailAndPassword(auth, email, password);
            console.log('AuthContext: Signed in successfully', result.user.uid);
        } catch (error: any) {
            console.error('Error signing in:', error);
            throw new Error(error.message || 'Failed to sign in');
        }
    };

    const signOut = async (): Promise<void> => {
        try {
            await firebaseSignOut(auth);
        } catch (error: any) {
            console.error('Error signing out:', error);
            throw new Error(error.message || 'Failed to sign out');
        }
    };

    const value: AuthContextType = {
        user,
        loading,
        signUp,
        signIn,
        signOut,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
