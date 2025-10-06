import React, { useState } from 'react';
import ActorInfo from './ActorInfo';

const ActorList = ({ actors }) => {
    const [isShowMore, setIsShowMore] = useState(false);

    const currentActors = isShowMore ? actors.slice(0, 32) : actors.slice(0, 4);

    return (
        <div>
            <h3 className="mb-4 text-[1.4vw] font-bold">Actor</h3>
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-4">
                {currentActors.map((actor) => (
                    <ActorInfo
                        key={actor.id}
                        id={actor.id}
                        name={actor.name}
                        character={actor.character}
                        profilePath={actor.profile_path}
                        episodeCount={actor.episodeCount}
                    />
                ))}
            </div>
            <p
                className="mt-3 cursor-pointer text-center"
                onClick={() => setIsShowMore(!isShowMore)}
            >
                <span className="rounded-3xl bg-white px-2 py-1 text-black">
                    {isShowMore ? 'Show More' : 'Show Less'}
                </span>
            </p>
        </div>
    );
};

export default ActorList;
