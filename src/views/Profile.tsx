import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut, getCurrentUser } from '../scripts/userStore';
import { supabase } from '../lib/supabase';

type UserProfile = {
    id: string;
    username: string;
    email: string;
};

export default function Profile() {
    const navigate = useNavigate();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // State for confirmation modal
    const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

    // Fetch user profile data
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true);
                setError(null);

                // Get the authenticated user
                const { user, error: userError } = await getCurrentUser();

                if (userError || !user) {
                    setError('Unable to fetch user information. Please try logging in again.');
                    setLoading(false);
                    return;
                }

                // Get user profile from the users table
                const { data: profileData, error: profileError } = await supabase
                    .from('users')
                    .select('id, username, email')
                    .eq('id', user.id)
                    .single();

                if (profileError) {
                    console.error('Error fetching user profile:', profileError);
                    setError('Unable to load profile information.');
                } else {
                    setUserProfile(profileData);                }
            } catch (err) {
                console.error('Error in fetchUserProfile:', err);
                setError('An unexpected error occurred while loading your profile.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    // Trigger the modal instead of signing out immediately
    const handleSignOutClick = () => {
        setShowSignOutConfirm(true);
    };

    // Actual Sign Out Logic
    const confirmSignOut = async () => {
        const { error } = await signOut();
        if (error) {
            console.error('Sign out error:', error);
            setError('Failed to sign out. Please try again.');
            setShowSignOutConfirm(false); // Close modal on error
        } else {
            console.log('Successfully signed out');
            navigate('/signup');
        }
    };

    return (
        <main className="h-full w-screen bg-slate-100 flex flex-col animate-enter" style={{ "--delay": "0s" } as React.CSSProperties}>
            <section className="gradient-1 shrink-0 p-4 rounded-b-3xl h-[18%]">
                <h1 className="text-4xl font-bold text-accent-foreground animate-enter"  style={{ "--delay": "0s" } as React.CSSProperties}>Schedify</h1>
                <h1 className="text-4xl font-bold text-blue-200 ml-4 animate-enter"  style={{ "--delay": "0.1s" } as React.CSSProperties}>//Profile</h1>
            </section>
            
            <section className="flex-1 w-full p-4 flex flex-col overflow-y-auto relative">
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <div className="bg-white card p-4 rounded-2xl shadow-sm">
                    <h2 className="text-xl font-bold text-secondary-600 mb-4">Profile</h2>

                    {loading ? (
                        <div className="flex flex-col items-center gap-4 py-8">
                            <i className='pi pi-spinner spin-animation text-2xl'></i>
                            <p className='text-slate-500'>Loading profile...</p>
                        </div>
                    ) : userProfile ? (
                        <div className="flex flex-col items-center gap-4">
                            {/* Avatar placeholder */}
                            <div className="w-24 h-24 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold self-center shadow-lg">
                                {userProfile.username.charAt(0).toUpperCase()}
                            </div>

                            {/* Username */}
                            <div className="w-full max-w-xs self-center flex justify-center">
                                <div className="w-48 mx-auto bg-transparent text-center py-2 text-gray-800 font-bold text-2xl">
                                    {userProfile.username}
                                </div>
                            </div>

                            {/* Email */}
                            <div className="w-full max-w-sm self-center">
                                <label className="block text-sm font-medium text-secondary-600 mb-2">
                                    Email
                                </label>
                                <div className="input input-bordered w-full bg-slate-50 text-gray-700 border-slate-300 p-3 rounded-lg">
                                    {userProfile.email}
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="w-full border-t border-slate-100 my-4"></div>

                            {/* Sign out button - Made more distinct */}
                            <button
                                className="w-full max-w-sm bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                                onClick={handleSignOutClick}
                            >
                                <i className="pi pi-sign-out"></i>
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-4 py-8">
                            <p className="text-red-500">Unable to load profile information.</p>
                        </div>
                    )}
                </div>

                {/* Confirmation Modal Overlay */}
                {showSignOutConfirm && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-xs shadow-2xl transform transition-all scale-100">
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 mx-auto">
                            <i className="pi pi-exclamation-triangle text-red-500 text-xl"></i>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">Sign Out?</h3>
                        <p className="text-gray-600 mb-6 text-center text-sm">
                            You will be signed out. Are you sure you want to proceed?
                        </p>
                        
                        <div className="flex gap-3">
                            <button 
                                className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
                                onClick={() => setShowSignOutConfirm(false)}
                            >
                                Cancel
                            </button>
                            <button 
                                className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl shadow-lg shadow-red-500/30 transition-colors"
                                onClick={confirmSignOut}
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
                )}
            </section>
        </main>
    );
}