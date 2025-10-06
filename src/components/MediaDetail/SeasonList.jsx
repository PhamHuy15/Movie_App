import CircularProgressBar from '@components/CircularProgressBar';
import ImageComponent from '@components/ImageComponent';
import { useState } from 'react';

const SeasonList = ({ seasons = [] }) => {
    const [isShowMore, setIsShowMore] = useState(false);

    const currentSeasons = isShowMore ? seasons : seasons.slice(0, 2);
    return (
        <div className="mt-8 space-y-4 text-[1.3vw] text-white">
            <h3 className="mb-4 text-[1.4vw] font-bold">Season</h3>
            {currentSeasons.map((season) => (
                <div
                    key={season.id}
                    className="flex gap-4 rounded-lg border border-slate-200 p-3 shadow-md"
                >
                    <ImageComponent
                        src={
                            season.poster_path &&
                            `https://media.themoviedb.org/t/p/w300${season.poster_path}`
                        }
                        width={130}
                        height={195}
                        className="w-1/4 rounded-lg"
                    />

                    <div className="space-y-1">
                        <h5 className="text-[1.4vw] font-bold">
                            {season.name}
                        </h5>
                        <div className="flex items-center gap-2">
                            <p className="font-bold">Rating</p>
                            <CircularProgressBar
                                percent={Math.round(season.vote_average * 10)}
                                size={2.5}
                                strokeWidth={0.2}
                            />
                        </div>

                        <p>
                            <span className="font-bold">Related date:</span>{' '}
                            {season.air_date}
                        </p>
                        <p>{season.episode_count} Episodes</p>
                        <p>{season.overview}</p>
                    </div>
                </div>
            ))}

            <p
                className="text-center"
                onClick={() => setIsShowMore(!isShowMore)}
            >
                <span className="rounded-2xl bg-white px-2 py-1 text-black">
                    {isShowMore ? 'Show Less' : 'Show more'}
                </span>
            </p>
        </div>
    );
};

export default SeasonList;
