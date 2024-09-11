'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from "next/image";
import { Authenticated, Unauthenticated } from 'convex/react';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { SignInButton, UserButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { HeaderActions } from './header-actions';


export function Header() {
    const [logo, setLogo] = useState<string>('/logos/logo2.png');
    useEffect(() => {
        const randomLogo = `/logos/logo${Math.floor(Math.random() * 4) + 1}.png`;
        setLogo(randomLogo);
    }, []);

    return (
        <nav className="flex items-center justify-between flex-wrap bg-teal p-6">
            <div className="flex items-center flex-no-shrink text-white mr-6">
                <Link href="/" className="flex items-center gap-4 text-2xl">
                    <Image
                        src={logo}
                        width={40}
                        height={40}
                        className="rounded"
                        alt="an image of a brain"
                    />
                    Data Sanctuary
                </Link>
            </div>
            <div className="block lg:hidden">
                <button className="flex items-center px-3 py-2 border rounded text-teal-lighter border-teal-light hover:text-white hover:border-white">
                    <svg className="h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" /></svg>
                </button>
            </div>

            <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
                <Authenticated>
                    <div className="text-sm lg:flex-grow">
                        <Link href="/dashboard" className="block mt-4 lg:inline-block lg:mt-0 text-teal-lighter hover:text-white mr-4">
                            Dashboard
                        </Link>
                    </div>
                </Authenticated>
                <div className='flex gap-4'>
                    <ModeToggle />
                    <HeaderActions />
                </div>
            </div>
        </nav>
    );
}
