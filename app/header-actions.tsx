"use client";

import { SignInButton, UserButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import Link from 'next/link';

export function HeaderActions() {
    return (
        <div className='flex'>
            <Unauthenticated>
                <SignInButton />
            </Unauthenticated>

            <Authenticated>
                <div className="flex justify-center items-center gap-4">
                    <div className="text-sm lg:flex-grow">
                        <Link href="/dashboard" className="block mt-4 lg:inline-block lg:mt-0 text-teal-lighter hover:text-white mr-4">
                            Dashboard
                        </Link>
                    </div>
                    <UserButton />
                </div>
            </Authenticated>

            <AuthLoading>Loading...</AuthLoading>
        </div>
    );
}