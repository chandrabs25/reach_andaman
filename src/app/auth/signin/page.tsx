// Path: .\src\app\auth\signin\page.tsx
'use client';

import React, { useState } from 'react'; // Import React for types
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { Mail, Lock, User, Facebook } from 'lucide-react'; // Removed Github as it wasn't used

// --- Define interface for expected API error response ---
interface ApiErrorResponse {
  message?: string; // Message property is optional
  // Add other potential error properties if your API sends them
}
// --- End Define Interface ---

export default function SignIn() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isLogin) {
      // Login logic remains the same...
      console.log(`Attempting login for: ${email}`);
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      console.log("Sign-in result:", result);

      if (result?.error) {
        if (result.error === 'CredentialsSignin') {
           setError('Invalid email or password.');
        } else {
           setError(result.error);
        }
        console.error("Sign-in error:", result.error);
        setLoading(false);
      } else if (result?.ok && !result?.error) {
         window.location.href = '/';
      } else {
          setError('An unknown error occurred during sign in.');
          setLoading(false);
      }

    } else {
      // Handle registration
      console.log(`Attempting registration for: ${email}`);
      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });

        // Parse JSON regardless of response.ok to potentially get error messages
        const data = await response.json(); // data is initially unknown
        console.log("Registration response:", data);

        if (!response.ok) {
          // --- FIX: Assert type of 'data' here ---
          const errorData = data as ApiErrorResponse; // Assert data as our error type
          // Use message from API response if available and is a string
          const errorMessage = typeof errorData?.message === 'string'
                             ? errorData.message
                             : `Registration failed with status: ${response.status}`;
          throw new Error(errorMessage);
          // --- End of FIX ---
        }

        // Auto login after successful registration
        console.log(`Registration successful, attempting auto-login for: ${email}`);
        const loginResult = await signIn('credentials', {
          redirect: false,
          email,
          password,
        });

        console.log("Auto-login result:", loginResult);
        if (loginResult?.ok && !loginResult?.error) {
           window.location.href = '/';
        } else {
           setError(loginResult?.error || 'Registration successful, but auto-login failed. Please log in manually.');
           setLoading(false);
           // Optional: Redirect to login page
           // setTimeout(() => { window.location.href = '/auth/signin?registered=true'; }, 3000);
        }

      } catch (err) {
        console.error("Registration error:", err);
        setError(err instanceof Error ? err.message : 'An unknown registration error occurred.');
        setLoading(false);
      }
    }
  };

  const handleSocialLogin = (provider: string) => {
     console.log(`Initiating ${provider} login`);
    signIn(provider, { callbackUrl: '/' });
  };

  // Rest of the component's return statement remains the same...
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* ... (rest of JSX unchanged) ... */}

       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
           {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

           {/* Form and other elements */}
           <form className="space-y-6" onSubmit={handleSubmit}>
              {/* ... form inputs ... */}
                 {!isLogin && (
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    {/* ... name input ... */}
                     <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                          id="name" name="name" type="text" required value={name}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                          className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="John Doe"
                        />
                      </div>
                  </div>
                )}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email address
                    </label>
                     {/* ... email input ... */}
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                          id="email" name="email" type="email" autoComplete="email" required value={email}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                          className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="you@example.com"
                        />
                      </div>
                </div>
                 <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    {/* ... password input ... */}
                     <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                          id="password" name="password" type="password" autoComplete={isLogin ? "current-password" : "new-password"} required value={password}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                          className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                </div>
                 {/* ... remember me / forgot password ... */}
                 {isLogin && (
                    <div className="flex items-center justify-between">
                        {/* ... remember me checkbox ... */}
                         <div className="flex items-center">
                            <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"/>
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900"> Remember me </label>
                          </div>
                         {/* ... forgot password link ... */}
                          <div className="text-sm">
                             <Link href="/auth/forgot-password" className="font-medium text-blue-600 hover:text-blue-500"> Forgot your password? </Link>
                           </div>
                    </div>
                )}
                 {/* ... submit button ... */}
                 <div>
                    <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
                         {/* ... loading state ... */}
                         {loading ? 'Processing...' : isLogin ? 'Sign in' : 'Sign up'}
                     </button>
                 </div>
           </form>
           {/* ... social login buttons ... */}
             <div className="mt-6">
               {/* ... separator ... */}
                 <div className="relative">
                     <div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="w-full border-t border-gray-300"></div></div>
                     <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Or continue with</span></div>
                   </div>
                {/* ... social buttons grid ... */}
                 <div className="mt-6 grid grid-cols-2 gap-3">
                    <div> <button onClick={() => handleSocialLogin('google')} className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"> {/* Google SVG */} <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" /></svg> </button> </div>
                     <div> <button onClick={() => handleSocialLogin('facebook')} className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"> {/* Facebook Icon */} <Facebook className="w-5 h-5 text-[#1877F2]" /> </button> </div>
                   </div>
             </div>
        </div>
      </div>

    </div>
  );
}