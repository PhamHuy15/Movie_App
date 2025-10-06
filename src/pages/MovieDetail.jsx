import { useParams } from 'react-router';

import Loading from '@components/Loading';
import Banner from '@components/MediaDetail/Banner';
import ActorList from '@components/MediaDetail/ActorList';
import RelatedMediaList from '@/components/MediaDetail/RelatedMediaList';
import MovieInformation from '@components/MediaDetail/MovieInformation';

import useFetch from '@hooks/useFetch';

const MovieDetail = () => {
    const { id } = useParams();

    const { data: movieInfo, isLoading } = useFetch({
        url: `/movie/${id}?append_to_response=release_dates,credits,videos`,
    });

    const { data: recommendationsResponse, isLoading: isRelatedMovieLoading } =
        useFetch({
            url: `/movie/${id}/recommendations`,
        });

    const relatedMovie = (recommendationsResponse.results || []).slice(0, 12);

    if (isLoading) {
        return <Loading />;
    }

    const certification = (
        (movieInfo.release_dates?.results || []).find(
            (result) => result.iso_3166_1 === 'US',
        )?.release_dates || []
    ).find((releaseDate) => releaseDate.certification)?.certification;

    const crews = (movieInfo.credits?.crew || [])
        .filter((crew) =>
            ['Director', 'Screenplay', 'Writer'].includes(crew.job),
        )
        .map((crew) => ({ id: crew.id, job: crew.job, name: crew.name }));

    return (
        <div>
            <Banner
                title={movieInfo.title}
                backdropPath={movieInfo.backdrop_path}
                posterPath={movieInfo.poster_path}
                releaseDate={movieInfo.release_date}
                genres={movieInfo.genres}
                voteAverage={movieInfo.vote_average}
                overview={movieInfo.overview}
                certification={certification}
                crews={crews}
                trailerVideoKey={
                    (movieInfo.videos?.results || []).find(
                        (video) => video.type === 'Trailer',
                    )?.key
                }
            />
            <div className="gap-6 bg-black text-[1.2vw] text-white">
                <div className="container">
                    <div className="flex-2">
                        <ActorList actors={movieInfo.credits?.cast || []} />
                        <RelatedMediaList
                            mediaList={relatedMovie}
                            isLoading={isRelatedMovieLoading}
                            title="More Like This"
                            className="mt-6"
                        />
                    </div>
                    <div className="flex-1">
                        <MovieInformation movieInfo={movieInfo} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetail;
