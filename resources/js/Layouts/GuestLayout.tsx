import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-green-50 px-2">
            <div>
                <Link href="/">
                    <ApplicationLogo className="w-16 h-16 sm:w-20 sm:h-20 fill-current text-green-700" />
                </Link>
            </div>
            <div className="w-full max-w-xs sm:max-w-md mt-6 px-4 sm:px-6 py-4 bg-green-100 shadow-md overflow-hidden sm:rounded-lg border border-green-300">
                {children}
            </div>
        </div>
    );
}
