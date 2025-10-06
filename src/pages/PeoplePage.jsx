import ImageComponent from '@components/ImageComponent';
import RelatedMediaList from '@components/MediaDetail/RelatedMediaList';
import { GENRES_MAPPING } from '@libs/constants';
import { useLoaderData } from 'react-router-dom';

const PeoplePage = () => {
    const peopleInfo = useLoaderData();

    console.log(peopleInfo);

    return (
        <div className="bg-black text-[1.2vw] text-white">
            <div className="container mt-14 lg:mt-20">
                <div className="flex-1">
                    <ImageComponent
                        src={
                            peopleInfo.profile_path &&
                            `https://image.tmdb.org/t/p/w600_and_h900_bestv2${peopleInfo.profile_path}`
                        }
                        width={600}
                        height={900}
                        className="mb-6 shadow-sm shadow-slate-300"
                    />

                    <div>
                        <h4 className="mb-6 font-bold text-[1.3w]">
                            Personal Info
                        </h4>
                        <div className="space-y-4">
                            <div>
                                <p className="font-bold">Know</p>
                                <p>{peopleInfo.known_for_department}</p>
                            </div>

                            <div>
                                <p className="font-bold">Gender</p>
                                <p>{GENRES_MAPPING[peopleInfo.gender]}</p>
                            </div>

                            <div>
                                <p className="font-bold">Place of birth</p>
                                <p>{peopleInfo.place_of_birth}</p>
                            </div>

                            <div>
                                <p className="font-bold">Birthday</p>
                                <p>{peopleInfo.birthday}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-2">
                    <h3 className="mb-6 text-[1.5vw] font-bold">
                        {peopleInfo.name}
                    </h3>
                    <div className="mb-6">
                        <p className="mb-4 text-[1.4vw] font-bold">Biography</p>

                        <p>{peopleInfo.biography}</p>
                    </div>

                    <div>
                        <RelatedMediaList
                            mediaList={peopleInfo.combined_credits?.cast || []}
                            title="Know For"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PeoplePage;
