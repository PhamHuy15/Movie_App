import { lazy, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import RootLayout from '@pages/RootLayout.jsx';
import ModalProvider from '@context/ModalProvider';

const HomePage = lazy(() => import('@pages/HomePage.jsx'));
const MovieDetail = lazy(() => import('@pages/MovieDetail.jsx'));
const TvShowDetail = lazy(() => import('@pages/TvShowDetail.jsx'));
const PeoplePage = lazy(() => import('@pages/PeoplePage.jsx'));
const SearchPage = lazy(() => import('@pages/SearchPage.jsx'));

const router = createHashRouter([
    {
        element: <RootLayout />,
        children: [
            {
                path: '/',
                element: <HomePage />,
            },
            {
                path: '/movie/:id',
                element: <MovieDetail />,
            },
            {
                path: '/tv/:id',
                element: <TvShowDetail />,
            },
            {
                path: '/people/:id',
                element: <PeoplePage />,
                hydrateFallbackElement: <div>Loading…</div>,
                loader: async ({ params }) => {
                    const res = await fetch(
                        `https://api.themoviedb.org/3/person/${params.id}?append_to_response=combined_credits`,
                        {
                            headers: {
                                accept: 'application/json',
                                Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
                            },
                        },
                    );

                    return res.json();
                },
            },
            {
                path: '/search',
                element: <SearchPage />,
            },
        ],
    },
]);

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <ModalProvider>
            <RouterProvider router={router} />
        </ModalProvider>
    </StrictMode>,
);
