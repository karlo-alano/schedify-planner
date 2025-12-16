import { signOut } from '../scripts/userStore';

export default function Profile() {
    const signOutHandler = async () => {
        const { error } = await signOut();
        if (error) {
            console.error('Sign out error:', error);
        } else {
            console.log('Successfully signed out');
            // You might want to redirect to login page here
            // window.location.href = '/login';
        }
    };

    return(
        <>
            <button onClick={signOutHandler}>Signout</button>
        </>
    );
}