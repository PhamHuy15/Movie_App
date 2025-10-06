import ImageComponent from '@components/ImageComponent';
import React from 'react';
import { Link } from 'react-router';

const ActorInfo = ({ id, name, character, profilePath, episodeCount }) => {
    return (
        <Link
            to={`/people/${id}`}
            className="rounded-lg border border-slate-300 bg-black shadow-sm"
        >
            <ImageComponent
                src={
                    profilePath &&
                    `https://image.tmdb.org/t/p/original/t/p/w276_and_h350_face${profilePath}`
                }
                alt=""
                className="w-full rounded-lg"
                width={276}
                height={350}
            />
            <div className="p-3">
                <p className="font-bold">{name}</p>
                <p>{character}</p>
                <p className="mt-1">
                    {episodeCount &&
                        (episodeCount > 1
                            ? `${episodeCount} Episodes`
                            : `${episodeCount} Episode`)}
                </p>
            </div>
        </Link>
    );
};

export default ActorInfo;
