import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

import popcornLog from './assets/logo/popcorn.png';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="fixed left-0 right-0 top-0 z-50 flex h-14 items-center justify-between bg-stone-950 px-8 text-white lg:h-20">
            <div className="flex items-center gap-4 lg:gap-6">
                <Link to="/">
                    <img src={popcornLog} alt="" className="w-10 sm:w-12" />
                </Link>

                <Link
                    to="/search?mediaType=movie"
                    className="text-lg hover:text-red-500 lg:text-xl"
                >
                    Movie
                </Link>
                <Link
                    to="/search?mediaType=tv"
                    className="text-lg hover:text-red-500 lg:text-xl"
                >
                    TV Show
                </Link>
            </div>
            <div>
                <Link to="/search">
                    <FontAwesomeIcon
                        icon={faMagnifyingGlass}
                        className="size-4 cursor-pointer"
                    />
                </Link>
            </div>
        </header>
    );
};

export default Header;
