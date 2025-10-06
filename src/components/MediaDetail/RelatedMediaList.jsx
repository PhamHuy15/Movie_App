import Loading from '@components/Loading';
import MediaCard from '@components/MediaCard';

const RelatedMediaList = ({ mediaList = [], isLoading, title, className }) => {
    return (
        <div className={className}>
            {title && <h4 className="mb-4 text-[1.4vw] font-bold">{title}</h4>}

            {isLoading ? (
                <Loading />
            ) : (
                <div className="grid grid-cols-3 gap-4 sm:grid-cols-4">
                    {mediaList.map((media) => (
                        <MediaCard
                            key={media.id}
                            id={media.id}
                            title={media.title || media.name}
                            poster={media.poster_path}
                            point={media.vote_average}
                            releaseDate={
                                media.release_date || media.first_air_date
                            }
                            MediaType={media.media_type}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default RelatedMediaList;
