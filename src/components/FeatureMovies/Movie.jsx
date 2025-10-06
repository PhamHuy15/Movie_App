import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import ImageComponent from '@components/ImageComponent';
import { useModalContext } from '@context/ModalProvider';
import { Link } from 'react-router';

const Movie = ({ data, trailerVideoKey }) => {
    const { id, backdrop_path, title, release_date, overview } = data;

    const { openPopup } = useModalContext();

    return (
        <>
            <ImageComponent
                src={
                    backdrop_path &&
                    `https://image.tmdb.org/t/p/original/${backdrop_path}`
                }
                className="aspect-video w-full object-cover brightness-50"
                width={1200}
                height={800}
                alt=""
            />

            <div className="absolute bottom-[10%] left-8 w-1/2 sm:w-1/3">
                <p className="mb-2 font-bold sm:text-[2vw]">{title}</p>

                <div>
                    <p className="mb-1 inline-block border border-gray-400 p-1 text-gray-400">
                        GP13
                    </p>
                    <p className="mt-2 text-[1.2vw]">{release_date}</p>
                </div>
                <div>
                    <div className="mt-4 hidden text-[1.2vw] sm:block">
                        <p className="mb-2 font-bold">Overview</p>
                        <p>{overview}</p>
                    </div>
                    <div className="mt-4 flex gap-2">
                        <button
                            onClick={() => {
                                openPopup(
                                    <iframe
                                        title="Trailer"
                                        src={`https://www.youtube.com/embed/${trailerVideoKey}`}
                                        className="aspect-video w-[50vw]"
                                    />,
                                );
                            }}
                            className="rounded bg-white px-4 py-2 text-[10px] text-black lg:text-lg"
                        >
                            <FontAwesomeIcon icon={faPlay} />
                            Trailer
                        </button>

                        <Link to={`/movie/${id}`}>
                            <button className="rounded bg-slate-300/35 px-4 py-2 text-[10px] text-white lg:text-lg">
                                View Detail
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Movie;
