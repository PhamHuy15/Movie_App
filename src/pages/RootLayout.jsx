import { Outlet } from 'react-router';
import Header from '../Header';
import { Suspense } from 'react';
import Loading from '@components/Loading';

const RootLayout = () => {
    return (
        <div>
            <Header />
            <Suspense fallback={<Loading />}>
                <Outlet />
            </Suspense>
        </div>
    );
};

export default RootLayout;
