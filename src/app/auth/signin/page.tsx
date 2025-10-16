'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function SignInPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSignUp, setIsSignUp] = useState(false);
    const { signIn, signUp } = useAuth();
    const router = useRouter();

    // Password validation
    const hasMinLength = password.length >= 12;
    const hasCapitalLetter = /[A-Z]/.test(password);
    const hasNumericChar = /[0-9]/.test(password);
    const isPasswordValid = hasMinLength && hasCapitalLetter && hasNumericChar;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            if (isSignUp) {
                await signUp(email, password);
            } else {
                await signIn(email, password);
            }
            router.push('/');
        } catch (err: any) {
            setError(err.message || `Failed to ${isSignUp ? 'create account' : 'sign in'}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#191919] flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        {isSignUp ? 'Create Account' : 'Welcome back'}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {isSignUp ? 'Sign up to start creating your isekai stories' : 'Sign in to continue creating your isekai stories'}
                    </p>
                </div>

                <div className="bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-800 rounded-lg p-8">
                    {/* Tab switcher */}
                    <div className="flex mb-6 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <button
                            type="button"
                            onClick={() => setIsSignUp(false)}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                                !isSignUp
                                    ? 'bg-white dark:bg-[#252525] text-gray-900 dark:text-gray-100 shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                            }`}
                        >
                            Sign In
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsSignUp(true)}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                                isSignUp
                                    ? 'bg-white dark:bg-[#252525] text-gray-900 dark:text-gray-100 shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                            }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Email address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="you@example.com"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Enter your password"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                            />
                            {isSignUp && (
                                <div className="mt-3 space-y-2">
                                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Password requirements:</p>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs ${hasMinLength ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                                {hasMinLength ? '✓' : '○'} At least 12 characters
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs ${hasCapitalLetter ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                                {hasCapitalLetter ? '✓' : '○'} One capital letter
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs ${hasNumericChar ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                                {hasNumericChar ? '✓' : '○'} One numeric character
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading || !email || !password || (isSignUp && !isPasswordValid)}
                            className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (isSignUp ? 'Creating account...' : 'Signing in...') : (isSignUp ? 'Create Account' : 'Sign In')}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
