import { AuthForm } from '@/components/auth/auth-form';
export default function Page() {
    return (
        <div className="grid min-h-screen place-items-center px-5 py-24">
            <AuthForm register />
        </div>
    );
}
