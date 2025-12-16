import {Input, Label} from "@heroui/react";
import { useNavigate } from "react-router-dom"
import { useState } from "react";
import { signUp, signIn} from '../scripts/userStore.ts';

const wait = (ms:number) => new Promise(resolve => setTimeout(resolve, ms));




export default function Signup() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [isLogin, setIsLogin] = useState(true);

    const toggleLogin = () => {
        setIsLogin(prev => !prev); // flips true/false
    };

    const navigate = useNavigate();
    async function animateAndRedirect() {
        await wait(2000)
        navigate('/home')
    }
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    async function signUpHandler() {
        // Clear any previous errors
        setError('');
        setLoading(true);
    
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




    return(
        <>
            <section className="h-screen w-screen gradient-1 center-children flex-col gap-4 animate-enter" style={{ "--delay": "0s"}}>
                <div className="card bg-white text-primary-500">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-15">
                        <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z" clipRule="evenodd" />
                    </svg>
                </div>
                <h1 className="text-white text-6xl font-extrabold mb-10 animate-enter" style={{ "--delay": "0s"}}>Schedify</h1>

                { isLogin && (
                    <>
                        <div className="flex flex-col animate-enter" style={{ "--delay": "0.1s"}}>
                            <Label htmlFor="input-type-email" className="text-white">Email</Label>
                            <Input id="input-type-email" type="email" className="shadow-1 h-15 bg-blue-100 inputBox "
                            value={email} onChange={(e) => setEmail(e.target.value)}/>
                        </div>
                        <div className="flex flex-col animate-enter" style={{ "--delay": "0.2s"}}>
                            <Label htmlFor="input-type-username" className="text-white">Username</Label>
                            <Input id="input-type-username" type="text" className="shadow-1 h-15 bg-blue-100 inputBox "
                            value={username} onChange={(e) => setUsername(e.target.value)}/>
                        </div>
                        <div className="flex flex-col animate-enter" style={{ "--delay": "0.3s"}}>
                            <Label htmlFor="input-type-password" className="text-white">Password</Label>
                            <Input id="input-type-password" type="password" className="shadow-1 h-15 bg-blue-100 inputBox "
                            value={password} onChange={(e) => setPassword(e.target.value)}/>
                        </div>
                    </>
                )}

                { !isLogin && (
                    <>
                        <div className="flex flex-col animate-enter" style={{ "--delay": "0.1s"}}>
                            <Label htmlFor="input-type-email" className="text-white">Email</Label>
                            <Input id="input-type-email" type="email" className="shadow-1 h-15 bg-blue-100 inputBox "
                            value={email} onChange={(e) => setEmail(e.target.value)}/>
                        </div>
                        <div className="flex flex-col animate-enter" style={{ "--delay": "0.2s"}}>
                            <Label htmlFor="input-type-password" className="text-white">Password</Label>
                            <Input id="input-type-password" type="password" className="shadow-1 h-15 bg-blue-100 inputBox "
                            value={password} onChange={(e) => setPassword(e.target.value)}/>
                        </div>
                    </>
                )}

                {isLogin ? (
                    <>
                    <button className="w-[70%] h-15 mt-10 card button bg-primary-300 text-slate-900 text-xl font-bold border animate-enter" style={{ "--delay": "0s"}}
                    onClick={signUpHandler} disabled={loading}>
                            Sign up
                    </button>
                    <button className="w-[70%] h-12 card button bg-blue-100 text-slate-600 text border border-slate-300 animate-enter" style={{ "--delay": "0.1s"}}
                    onClick={toggleLogin} disabled={loading}>
                            I have an account already
                    </button>
                    
                    </>)
                    : (
                    <>
                    <button className="w-[70%] h-15 mt-10 card button bg-primary-300 text-slate-900 text-xl font-bold border animate-enter" style={{ "--delay": "0s"}}
                    onClick={loginHandler} disabled={loading}>
                            Log in
                    </button>
                    <button className="w-[70%] h-12 card button bg-blue-100 text-slate-600 text animate-enter" style={{ "--delay": "0.1s"}}
                    onClick={toggleLogin} disabled={loading}>
                            I am new
                    </button>
                    </>)
                }

                {error && (
                    <div className="w-[70%] p-3 bg-red-100 border border-red-400 text-red-700 rounded mt-4">
                        {error}
                    </div>
                )}
            </section>
        </>
    )
}