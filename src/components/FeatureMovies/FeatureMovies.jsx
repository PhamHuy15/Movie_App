import { useEffect, useState } from 'react';

import PaginateIndicator from './PaginateIndicator';
import Movie from './Movie';
import useFetch from '@hooks/useFetch';

const FeatureMovies = () => {
    const [activeMovieId, setActiveMovieId] = useState();

    const { data: popularMoviesResponse } = useFetch({
        url: '/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&include_video=true',
    });

    const { data: videoResponse } = useFetch(
        {
            url: `/movie/${activeMovieId}/videos`,
        },
        { enabled: !!activeMovieId },
    );

    const movies = (popularMoviesResponse.results || []).slice(0, 4);

    useEffect(() => {
        if (movies[0]?.id) {
            setActiveMovieId(movies[0].id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(movies)]);

    return (
        <div className="relative mt-14 text-white lg:mt-20">
            {movies
                .filter((movie) => activeMovieId === movie.id)
                .map((movie) => (
                    <Movie
                        key={movie.id}
                        data={movie}
                        trailerVideoKey={
                            (videoResponse?.results || []).find(
                                (video) =>
                                    video.type === 'Trailer' &&
                                    video.site === 'YouTube',
                            )?.key
                        }
                    />
                ))}
            <PaginateIndicator
                movies={movies}
                activeMovieId={activeMovieId}
                setActiveMovieId={setActiveMovieId}
            />
        </div>
    );
};

export default FeatureMovies;
