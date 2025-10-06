import { useForm } from 'react-hook-form';
import { useEffect } from 'react';

import FormField from './FormField';
import MediaTypeInput from './FormInputs/MediaTypeInput';
import GenresInput from './FormInputs/GenresInput';
import RatingInput from './FormInputs/RatingInput';
import { useSearchParams } from 'react-router-dom';

const SearchForm = ({ setSearchFormValue }) => {
    const [searchParams] = useSearchParams();
    const mediaType = searchParams.get('mediaType');

    const { handleSubmit, control, watch } = useForm({
        defaultValues: {
            mediaType: ['tv', 'movie'].includes(mediaType)
                ? mediaType
                : 'movie',
            genres: [],
            rating: 'All',
        },
    });

    const onSubmit = (data) => {
        console.log({ data });
    };

    const formValues = watch();

    useEffect(() => {
        setSearchFormValue(formValues);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(formValues)]);

    return (
        <div className="rounded-lg border p-4">
            <form
                action=""
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
            >
                <FormField
                    name="mediaType"
                    label="Media Type"
                    control={control}
                    Component={MediaTypeInput}
                />

                <FormField
                    name="genres"
                    label="Genres"
                    control={control}
                    Component={GenresInput}
                />

                <FormField
                    name="rating"
                    label="Rating"
                    control={control}
                    Component={RatingInput}
                />
            </form>
        </div>
    );
};

export default SearchForm;
