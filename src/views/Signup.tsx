import React from "react";
import { Input, Label } from "@heroui/react";
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react";
import { signUp, signIn } from '../scripts/userStore.ts';

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Icons
const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-slate-400">
        <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
        <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
    </svg>
);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-slate-400">
        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
    </svg>
);

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-slate-400">
        <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
    </svg>
);

const EyeIcon = ({ visible, onClick }: { visible: boolean; onClick: () => void }) => (
    <button type="button" onClick={onClick} className="focus:outline-none">
        {visible ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-slate-400 hover:text-slate-600">
                <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12 3.75c4.97 0 9.188 3.223 10.677 7.697.492 1.568-.492 3.125-1.077 4.54a12.042 12.042 0 0 1-5.187 5.14c-1.28.535-2.68.813-4.413.813-1.732 0-3.132-.278-4.413-.813a12.042 12.042 0 0 1-5.187-5.14c-.585-1.415-1.57-2.972-1.077-4.54Zm9.263 7.02c1.078.438 2.378.683 3.414.683 1.036 0 2.336-.245 3.414-.683a10.542 10.542 0 0 0 4.54-4.502c.328-.885.82-1.895.413-2.946-.407-1.05-1.72-2.327-3.033-3.07a10.543 10.543 0 0 0-5.334-1.433 10.543 10.543 0 0 0-5.334 1.433c-1.313.743-2.626 2.02-3.033 3.07-.407 1.05.085 2.06.413 2.946a10.542 10.542 0 0 0 4.54 4.502Z" clipRule="evenodd" />
            </svg>
        ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-slate-400 hover:text-slate-600">
                <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.188 3.223 10.677 7.697.492 1.568-.492 3.125-1.077 4.54a12.042 12.042 0 0 1-5.187 5.14c-1.28.535-2.68.813-4.413.813a11.954 11.954 0 0 1-2.98-.376l-1.353-1.353a10.543 10.543 0 0 0 4.333.356c1.036 0 2.336-.245 3.414-.683a10.542 10.542 0 0 0 4.54-4.502c.328-.885.82-1.895.413-2.946-.407-1.05-1.72-2.327-3.033-3.07a10.543 10.543 0 0 0-5.334-1.433 10.543 10.543 0 0 0-5.334 1.433c-1.313.743-2.626 2.02-3.033 3.07-.407 1.05.085 2.06.413 2.946a10.542 10.542 0 0 0 4.54 4.502Z" />
            </svg>
        )}
    </button>
);


// Password Strength Indicator Component
const PasswordStrengthIndicator = ({ strength }: { strength: { score: number; feedback: string[] } }) => {
    const getStrengthColor = (score: number) => {
        if (score === 0) return 'bg-gray-200';
        if (score <= 2) return 'bg-red-500';
        if (score <= 3) return 'bg-yellow-500';
        if (score <= 4) return 'bg-blue-500';
        return 'bg-green-500';
    };

    const getStrengthText = (score: number) => {
        if (score === 0) return '';
        if (score <= 2) return 'Weak';
        if (score <= 3) return 'Fair';
        if (score <= 4) return 'Good';
        return 'Strong';
    };

    const getStrengthWidth = (score: number) => {
        if (score === 0) return '0%';
        return `${(score / 5) * 100}%`;
    };

    return (
        <div className="mt-3 transition-all duration-300 ease-in-out">
            <div className="flex items-center gap-2 mb-1">
                <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-500 ease-out ${getStrengthColor(strength.score)}`}
                        style={{ width: getStrengthWidth(strength.score) }}
                    ></div>
                </div>
                <span className="text-xs font-semibold text-slate-500 w-12 text-right">
                    {getStrengthText(strength.score)}
                </span>
            </div>
            {strength.feedback.length > 0 && (
                <div className="bg-slate-50 p-2 rounded-lg mt-2 border border-slate-100">
                    <ul className="text-[10px] text-slate-500 space-y-1">
                        {strength.feedback.map((item, index) => (
                            <li key={index} className="flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-red-400"></span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default function Signup() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLogin, setIsLogin] = useState(true);

    const toggleLogin = () => {
        setIsLogin(prev => !prev);
        // Clear terms acceptance when switching modes
        setAcceptTerms(false);
        // Clear any terms-related errors
        setFieldErrors(prev => ({ ...prev, terms: '' }));
        setError('');
    };

    const navigate = useNavigate();
    async function animateAndRedirect() {
        await wait(1500)
        navigate('/home')
    }
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Validation states
    const [fieldErrors, setFieldErrors] = useState({
        email: '',
        username: '',
        password: '',
        terms: ''
    });
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        feedback: [] as string[]
    });

    // Validation functions
    const validateEmail = (email: string): string => {
        if (!email.trim()) {
            return 'Email is required';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return 'Please enter a valid email address';
        }
        return '';
    };

    const validateUsername = (username: string, isRequired: boolean = true): string => {
        if (isRequired && !username.trim()) {
            return 'Username is required';
        }
        if (username.trim().length > 0) {
            if (username.trim().length < 6) {
                return 'Username must be at least 6 characters';
            }
            if (username.trim().length > 25) {
                return 'Username cannot exceed 25 characters';
            }
        }
        return '';
    };

    const checkPasswordStrength = (password: string) => {
        let score = 0;
        const feedback: string[] = [];

        if (password.length === 0) {
            setPasswordStrength({ score: 0, feedback: [] });
            return;
        }

        // Length check
        if (password.length < 6) {
            feedback.push('Use at least 6 characters');
        } else if (password.length >= 8) {
            score += 1;
        }

        // Lowercase check
        if (!/[a-z]/.test(password)) {
            feedback.push('Add lowercase letters');
        } else {
            score += 1;
        }

        // Uppercase check
        if (!/[A-Z]/.test(password)) {
            feedback.push('Add uppercase letters');
        } else {
            score += 1;
        }

        // Number check
        if (!/\d/.test(password)) {
            feedback.push('Add numbers');
        } else {
            score += 1;
        }

        // Special character check
        if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
            feedback.push('Add special characters');
        } else {
            score += 1;
        }

        setPasswordStrength({ score, feedback });
    };

    // Real-time validation
    useEffect(() => {
        if (email) {
             const emailError = validateEmail(email);
             setFieldErrors(prev => ({ ...prev, email: emailError }));
        }
    }, [email]);

    useEffect(() => {
        if (username) {
            const usernameError = validateUsername(username, !isLogin); // Only required if not login
            setFieldErrors(prev => ({ ...prev, username: usernameError }));
        }
    }, [username, isLogin]);

    useEffect(() => {
        checkPasswordStrength(password);
        // Basic password validation for error display
        let passwordError = '';
        if (password && password.length < 6) {
            passwordError = 'Password must be at least 6 characters';
        } else {
            passwordError = '';
        }
        // Only show error if user has started typing
        if (password.length > 0) {
            setFieldErrors(prev => ({ ...prev, password: passwordError }));
        }
    }, [password]);

    async function signUpHandler() {
        setError('');
        setLoading(true);

        // Client-side validation
        const emailError = validateEmail(email);
        const usernameError = validateUsername(username, true);
        let passwordError = '';
        let termsError = '';

        if (!password.trim()) {
            passwordError = 'Password is required';
        } else if (password.length < 6) {
            passwordError = 'Password must be at least 6 characters';
        }

        if (!acceptTerms) {
            termsError = 'You must accept the Terms and Conditions';
        }

        setFieldErrors({
            email: emailError,
            username: usernameError,
            password: passwordError,
            terms: termsError
        });

        // Check if there are any validation errors
        if (emailError || usernameError || passwordError || termsError) {
            setLoading(false);
            return;
        }

        try {
            const result = await signUp(email, password, username);

            if (result.error) {
                // Handle different types of errors
                if (result.error.message.includes('already registered')) {
                    setError('An account with this email already exists. Try logging in instead.');
                } else if (result.error.message.includes('Password')) {
                    setError('Password should be at least 6 characters long.');
                } else {
                    setError(result.error.message || 'Failed to create account. Please try again.');
                }
                return;
            }

            // Success - show success message and redirect
            console.log('Account created successfully!');
            await animateAndRedirect();

        } catch (err) {
            console.error('Unexpected error:', err);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    }
    
    // Add this login handler
    async function loginHandler() {
        // Clear any previous errors
        setError('');
        setLoading(true);

        // Client-side validation
        const emailError = validateEmail(email);
        let passwordError = '';

        if (!password.trim()) {
            passwordError = 'Password is required';
        }

        setFieldErrors({
            email: emailError,
            username: '', // Not required for login
            password: passwordError,
            terms: '' // Not required for login
        });

        // Check if there are any validation errors
        if (emailError || passwordError) {
            setLoading(false);
            return;
        }

        try {
            const result = await signIn(email, password);

            if (result.error) {
                if (result.error.message.includes('Invalid login credentials')) {
                    setError('Invalid email or password. Please check your credentials.');
                } else {
                    setError(result.error.message || 'Failed to sign in. Please try again.');
                }
                return;
            }

            // Success - redirect to home
            console.log('Logged in successfully!');
            await animateAndRedirect();

        } catch (err) {
            console.error('Unexpected error:', err);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="h-screen w-screen gradient-1 flex items-center justify-center p-4 overflow-hidden">
            <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 animate-enter flex flex-col gap-6 relative overflow-hidden" style={{ "--delay": "0s" } as React.CSSProperties}>
                
                {/* Header */}
                <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-9 h-9 text-white">
                            <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Schedify</h1>
                    <p className="text-slate-500 font-medium">
                        {isLogin ? 'Welcome back!' : 'Create your account'}
                    </p>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium flex items-center gap-2 animate-pulse">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0">
                            <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                        </svg>
                        {error}
                    </div>
                )}

                {/* Form Container */}
                <div className="flex flex-col gap-4">
                    
                    {/* Username Field - Only show if signing up */}
                    {!isLogin && (
                        <div className="flex flex-col gap-1.5 animate-enter" style={{ "--delay": "0.1s" } as React.CSSProperties}>
                            <Label htmlFor="input-type-username" className="text-slate-600 font-semibold text-sm ml-1">Username</Label>
                            <Input
                                id="input-type-username"
                                type="text"
                                placeholder="johndoe123"
                                startContent={<UserIcon />}
                                className={`h-12 bg-slate-50 border-2 rounded-xl text-slate-800 focus:bg-white transition-colors ${fieldErrors.username ? 'border-red-400 bg-red-50' : 'border-slate-100 hover:border-slate-300'}`}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            {fieldErrors.username && (
                                <small className="text-red-500 text-xs font-semibold ml-1">{fieldErrors.username}</small>
                            )}
                        </div>
                    )}

                    {/* Email Field */}
                    <div className="flex flex-col gap-1.5 animate-enter" style={{ "--delay": isLogin ? "0s" : "0.2s" } as React.CSSProperties}>
                        <Label htmlFor="input-type-email" className="text-slate-600 font-semibold text-sm ml-1">Email</Label>
                        <Input
                            id="input-type-email"
                            type="email"
                            placeholder="you@example.com"
                            startContent={<MailIcon />}
                            className={`h-12 bg-slate-50 border-2 rounded-xl text-slate-800 focus:bg-white transition-colors ${fieldErrors.email ? 'border-red-400 bg-red-50' : 'border-slate-100 hover:border-slate-300'}`}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {fieldErrors.email && (
                            <small className="text-red-500 text-xs font-semibold ml-1">{fieldErrors.email}</small>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="flex flex-col gap-1.5 animate-enter" style={{ "--delay": isLogin ? "0.1s" : "0.3s" } as React.CSSProperties}>
                        <Label htmlFor="input-type-password" className="text-slate-600 font-semibold text-sm ml-1">Password</Label>
                        <div className="relative">
                            <Input
                                id="input-type-password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                startContent={<LockIcon />}
                                endContent={<EyeIcon visible={showPassword} onClick={() => setShowPassword(!showPassword)} />}
                                className={`w-full h-12 bg-slate-50 border-2 rounded-xl text-slate-800 focus:bg-white transition-colors ${fieldErrors.password ? 'border-red-400 bg-red-50' : 'border-slate-100 hover:border-slate-300'}`}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        
                        {!isLogin && <PasswordStrengthIndicator strength={passwordStrength} />}
                        
                        {fieldErrors.password && (
                            <small className="text-red-500 text-xs font-semibold ml-1">{fieldErrors.password}</small>
                        )}
                    </div>

                    {/* Terms Checkbox - Only show if signing up */}
                    {!isLogin && (
                        <div className="animate-enter mt-2" style={{ "--delay": "0.4s" } as React.CSSProperties}>
                            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                                <input
                                    type="checkbox"
                                    id="terms-checkbox"
                                    checked={acceptTerms}
                                    onChange={(e) => setAcceptTerms(e.target.checked)}
                                    className="mt-0.5 w-5 h-5 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="terms-checkbox" className="text-slate-600 text-xs leading-relaxed">
                                    I agree to the{' '}
                                    <button
                                        type="button"
                                        className="text-blue-600 font-bold hover:underline"
                                        onClick={() => alert('Terms...')}
                                    >
                                        Terms
                                    </button>
                                    {' '}and{' '}
                                    <button
                                        type="button"
                                        className="text-blue-600 font-bold hover:underline"
                                        onClick={() => alert('Privacy...')}
                                    >
                                        Privacy Policy
                                    </button>
                                </label>
                            </div>
                            {fieldErrors.terms && (
                                <small className="text-red-500 text-xs font-semibold ml-1 block mt-1">{fieldErrors.terms}</small>
                            )}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button 
                        className="w-full h-12 mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2"
                        onClick={isLogin ? loginHandler : signUpHandler} 
                        disabled={loading}
                    >
                        {loading && <i className="pi pi-spinner spin-animation text-white"></i>}
                        {loading ? (isLogin ? 'Signing in...' : 'Creating Account...') : (isLogin ? 'Log In' : 'Sign Up')}
                    </button>
                </div>

                {/* Footer Toggle */}
                <div className="mt-2 text-center">
                    <p className="text-slate-500 text-sm">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button 
                            className="ml-2 text-blue-600 font-bold hover:text-blue-700 transition-colors"
                            onClick={toggleLogin}
                            disabled={loading}
                        >
                            {isLogin ? "Sign Up" : "Log In"}
                        </button>
                    </p>
                </div>
            </div>
        </section>
    );
}