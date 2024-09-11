"use client";

import { SignInButton, UserButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";

export function HeaderActions() {
    return (
        <div className='flex container space-between'>
            <Unauthenticated>
                <SignInButton />
            </Unauthenticated>

            <Authenticated>
                <UserButton />
            </Authenticated>

            <AuthLoading>Loading...</AuthLoading>
        </div>
    );
}