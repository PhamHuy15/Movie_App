import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { groupBy } from 'lodash';

import CircularProgressBar from '../CircularProgressBar';
import ImageComponent from '@components/ImageComponent';
import { useModalContext } from '@context/ModalProvider';

const Banner = ({
    title,
    backdropPath,
    posterPath,
    crews,
    certification,
    releaseDate,
    genres,
    voteAverage,
    overview,
    trailerVideoKey,
}) => {
    const groupCrews = groupBy(crews, 'job');

    if (!title) return null;

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { openPopup } = useModalContext();

    return (
        <div className="relative mt-14 overflow-hidden bg-black text-white shadow-sm shadow-slate-800 lg:mt-20">
            <ImageComponent
                src={
                    backdropPath &&
                    `https://image.tmdb.org/t/p/original/${backdropPath}`
                }
                alt=""
                className="w-aspect-video absolute inset-0 w-full object-cover brightness-[0.2]"
                width={1024}
                height={576}
            />
            <div className="relative mx-auto flex max-w-screen-xl gap-6 px-6 py-10 lg:gap-8">
                <div className="flex-1">
                    <ImageComponent
                        src={
                            posterPath &&
                            `https://image.tmdb.org/t/p/w600_and_h900_bestv2${posterPath}`
                        }
                        alt=""
                        width={600}
                        height={900}
                        className="w-full"
                    />
                </div>
                <div className="flex-2 text-white">
                    <p className="mb-2 text-[2vw] font-bold">{title}</p>
                    <div className="flex items-center gap-4">
                        <span className="border border-gray-400 p-1 text-gray-400">
                            {certification}
                        </span>
                        <p>{releaseDate}</p>
                        <p>
                            {(genres || [])
                                .map((genre) => genre.name)
                                .join(', ')}
                        </p>
                    </div>
                    <div className="mt-4 flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <CircularProgressBar
                                percent={Math.round((voteAverage || 0) * 10)}
                                size={3.5}
                                strokeWidth={0.3}
                                strokeColor={
                                    voteAverage >= 8
                                        ? 'green'
                                        : voteAverage >= 5
                                          ? 'orange'
                                          : 'red'
                                }
                            />
                            Rating
                        </div>
                        <button
                            className="border border-transparent p-2 hover:border-gray-400"
                            onClick={() => {
                                openPopup(
                                    <iframe
                                        title="Trailer"
                                        src={`https://www.youtube.com/embed/${trailerVideoKey}`}
                                        className="aspect-video w-[50vw]"
                                    />,
                                );
                            }}
                        >
                            <FontAwesomeIcon className="mr-1" icon={faPlay} />
                            Trailer
                        </button>
                    </div>
                    <div className="mt-4">
                        <p className="mb-2 text-[1.3vw] font-bold">Overview</p>
                        <p>{overview}</p>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                        {Object.keys(groupCrews).map((job) => (
                            <div key={job}>
                                <p className="font-bold">{job}</p>
                                <p>
                                    {groupCrews[job]
                                        .map((job) => job.name)
                                        .join(', ')}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Banner;
