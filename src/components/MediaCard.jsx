import { Link } from 'react-router';

import CircularProgressBar from '@components/CircularProgressBar';
import ImageComponent from '@components/ImageComponent';

const MediaCard = ({ title, poster, point, releaseDate, MediaType, id }) => {
    return (
        <Link
            to={MediaType === 'tv' ? `/tv/${id}` : `/movie/${id}`}
            className={'rounded-lg border border-slate-800'}
        >
            <div className="relative">
                {MediaType === 'tv' && (
                    <p className="absolute right-1 top-1 rounded bg-black p-1 text-sm font-bold text-white shadow-md">
                        TV Show
                    </p>
                )}

                <ImageComponent
                    src={
                        poster && `https://image.tmdb.org/t/p/original${poster}`
                    }
                    alt=""
                    className="w-full rounded-lg"
                    width={210}
                    height={300}
                />
                <div className="relative -top-[1.5vw] px-4">
                    <CircularProgressBar
                        percent={Math.round(point * 10)}
                        strokeColor={
                            point >= 8 ? 'green' : point >= 5 ? 'orange' : 'red'
                        }
                    />
                    <h4 className="mt-2 font-bold">{title}</h4>
                    <p className="text-slate-300">{releaseDate}</p>
                </div>
            </div>
        </Link>
    );
};

export default MediaCard;
