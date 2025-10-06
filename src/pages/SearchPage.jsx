import RelatedMediaList from '@components/MediaDetail/RelatedMediaList';
import SearchForm from '@components/SearchForm/SearchForm';
import useFetch from '@hooks/useFetch';
import { useState } from 'react';

const SearchPage = () => {
    const [searchFormValues, setSearchFormValue] = useState({
        mediaType: 'movie',
        genres: [],
        rating: 'All',
    });

    const [minRating, maxRating] =
        searchFormValues.rating === 'All'
            ? [0, 100]
            : searchFormValues.rating.split(' - ');

    const { data } = useFetch({
        url: `/discover/${searchFormValues.mediaType}?sort_by=popularity.desc&with_genres=${searchFormValues.genres.join(',')}&vote_average.gte=${minRating / 10}&vote_average.lte=${maxRating / 10}`,
    });

    return (
        <div className="container mt-14 flex-col lg:mt-20">
            <h3 className="text-[1.5vw] font-bold">Search</h3>
            <div className="flex gap-6">
                <div className="flex-1">
                    <SearchForm setSearchFormValue={setSearchFormValue} />
                </div>
                <div className="flex-3">
                    <RelatedMediaList mediaList={data.results || []} />
                </div>
            </div>
        </div>
    );
};

export default SearchPage;
