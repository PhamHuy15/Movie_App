import { useParams } from 'react-router';

import Loading from '@components/Loading';
import Banner from '@components/MediaDetail/Banner';
import ActorList from '@components/MediaDetail/ActorList';
import RelatedMediaList from '@/components/MediaDetail/RelatedMediaList';
import TvShowInformation from '@components/MediaDetail/TvShowInformation';

import useFetch from '@hooks/useFetch';
import SeasonList from '@components/MediaDetail/SeasonList';

const TvShowDetail = () => {
    const { id } = useParams();

    const { data: tvInfo, isLoading } = useFetch({
        url: `/tv/${id}?append_to_response=content_ratings,aggregate_credits,videos`,
    });

    const {
        data: recommendationsResponse,
        isLoading: isRecommendationLoading,
    } = useFetch({
        url: `/tv/${id}/recommendations`,
    });

    const relatedTvShow = (recommendationsResponse.results || []).slice(0, 12);

    if (isLoading) {
        return <Loading />;
    }

    console.log({ tvInfo });

    const certification = (tvInfo.content_ratings?.results || []).find(
        (result) => result.iso_3166_1 === 'US',
    )?.rating;

    const crews = (tvInfo.aggregate_credits?.crew || [])
        .filter((crew) => {
            const jobs = (crew.jobs || []).map((j) => j.job);

            return ['Director', 'Writer'].some((job) =>
                jobs.find((j) => j === job),
            );
        })
        .slice(0, 10)
        .map((crew) => ({
            id: crew.id,
            job: crew.jobs[0].job,
            name: crew.name,
        }));

    return (
        <div>
            <Banner
                title={tvInfo.name}
                backdropPath={tvInfo.backdrop_path}
                posterPath={tvInfo.poster_path}
                releaseDate={tvInfo.first_air_date}
                genres={tvInfo.genres}
                voteAverage={tvInfo.vote_average}
                overview={tvInfo.overview}
                certification={certification}
                crews={crews}
                trailerVideoKey={
                    (tvInfo.videos?.results || []).find(
                        (video) => video.type === 'Trailer',
                    )?.key
                }
            />
            <div className="gap-6 bg-black text-[1.2vw] text-white">
                <div className="container">
                    <div className="flex-2">
                        <ActorList
                            actors={(tvInfo.aggregate_credits?.cast || []).map(
                                (actor) => ({
                                    ...actor,
                                    character: actor.roles[0]?.character,
                                    episodeCount: actor.roles[0]?.episode_count,
                                }),
                            )}
                        />

                        <SeasonList
                            seasons={(tvInfo.seasons || []).reverse()}
                        />

                        <RelatedMediaList
                            mediaList={relatedTvShow}
                            isLoading={isRecommendationLoading}
                            title="More Like This"
                            className="mt-6"
                        />
                    </div>
                    <div className="flex-1">
                        <TvShowInformation tvInfo={tvInfo} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TvShowDetail;
