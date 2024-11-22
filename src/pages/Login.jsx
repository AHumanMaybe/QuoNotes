import { useState } from "react";
import { doCreateUserWithEmailAndPassword, doSignInWithEmailAndPassword, doSendEmailVerification, doPassowrdReset, doSignOut } from "../firebase/auth";
import {ProfileCard, CollectionsCard, FilesCard} from "../components/ProfileComponents.jsx";
import { useAuth } from "../contexts/authContext";

function Login(props) {
    const { userLoggedIn, loading, currentUser } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [isRegistering, setIsRegistering] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!isSigningIn) {
            setIsSigningIn(true);
            try {
                const curuser = await doSignInWithEmailAndPassword(email, password);

                // if (!curuser.emailVerified) {
                //     await doSendEmailVerification(curuser)
                //     console.log('verification email sent')
                // }
                console.log(curuser.user)
                setSuccessMessage('Login successful');
            } catch (error) {
                setErrorMessage(error.message);
            } finally {
                setIsSigningIn(false);
            }
        }
    };

    const onRegister = async (e) => {
        e.preventDefault();
        if (!isSigningIn && !isRegistering) {
            setIsRegistering(true);
            try {
                const newUser = await doCreateUserWithEmailAndPassword(email, password);
                console.log(newUser.user);
                await doSendEmailVerification(newUser)
                console.log('verification email sent')
                setSuccessMessage('Registration successful - Check provided Email');
            } catch (error) {
                setErrorMessage(error.message);
            } finally {
                setIsRegistering(false);
            }
        }
    };

    const onReset = async (e) => {
        e.preventDefault();
        if (!isSigningIn && !isRegistering) {
            setIsRegistering(true)
            try {
                const reset = await doPassowrdReset(email)

                setSuccessMessage('Password Reset Email Sent!');
            } catch(error) {
                setErrorMessage(error.message)
            } finally {
                setIsRegistering(false)
            }
        }
    }

    const onSignOut = async (e) => {
        e.preventDefault();
        if (!isSigningIn && !isRegistering) {
            setIsRegistering(true)
            try{
                const signout = doSignOut()

            }catch(error){
                setErrorMessage(error.message)
            } finally {
                setIsRegistering(false)
            }
        }
    }


    if (loading) {
        return <div>Loading...</div>;
    }

//  old line 131
//  By clicking Log In, you agree to QuoNotes' <a href="quonotes.com" className="text-blue-600 px-1">Terms of Service</a> and <a href="quonotes.com" className="text-blue-600 pl-1"> Privacy Policy </a>.

    return (
        <div className="flex text-white font-inter w-full justify-center">
            {!userLoggedIn ? (
                <form onSubmit={onSubmit}>
                    <div>
                        <label className="block text-sm md:text-base">Email</label>
                        <div className="py-1">
                            <input
                                className="bg-bgd rounded h-8 w-72 sm:h-10 sm:w-96 md:h-12 md:w-160 px-1.5"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email address"
                            />
                        </div>
                    </div>
                    <div className="py-5">
                        <label className="block text-sm md:text-base">Password</label>
                        <div className="py-1">
                            <input
                                className="bg-bgd rounded h-8 w-72 sm:h-10 sm:w-96 md:h-12 md:w-160 px-1.5"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                            />
                        </div>
                    </div>
                    {errorMessage && <div className="text-red-500">{errorMessage}</div>}
                    {!errorMessage && successMessage && <div className="text-green-500">{successMessage}</div>}
                    <div className="flex justify-center">
                        <p className="text-white text-xs sm:text-sm py-2 w-72 sm:w-96 md:w-160 flex justify-center">
                            By clicking Log In, you agree to be a part of QuoNotes' Beta Test.
                        </p>
                    </div>
                    <div className="flex justify-center py-5">
                        <button className="text-white py-2 w-72 sm:w-80 bg-textcl rounded hover:bg-textclh" type="submit" disabled={isSigningIn}>
                            Log In
                        </button>
                    </div>

                    <div className="flex justify-center py-5">
                        <button className="text-black py-2 w-72 sm:w-80 bg-bgl rounded hover:bg-slate-300" onClick={onReset} disabled={isRegistering}>
                            Reset Password
                        </button>
                    </div>
                </form>
            ) : (
                <>
                    <div className="w-full h-full justify-center">
                        <div className="flex justify-center w-full">
                            <ProfileCard />
                        </div>
                        <div className="flex justify-center w-full">
                            <CollectionsCard />
                        </div>
                        <div className="flex justify-center w-full">
                            <FilesCard />
                        </div>
                        <div className="flex w-full justify-center py-5">
                            <button className="text-white content-center items-center w-64 h-12 bg-textcl rounded-lg hover:bg-textclh" onClick={onSignOut} disabled={isSigningIn}>
                                Log Out
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Login;
