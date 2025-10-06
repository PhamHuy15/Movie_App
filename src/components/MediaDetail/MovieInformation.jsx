import { currencyFormatter } from '@libs/utils';

const MovieInformation = ({ movieInfo }) => {
    return (
        <div>
            <p className="mb-4 text-[1.4vw] font-bold">Information</p>

            <div className="mb-4">
                <h4 className="font-bold">Original Name</h4>
                <p>{movieInfo.title}</p>
            </div>

            <div className="mb-4">
                <h4 className="font-bold">Original Country</h4>
                <p>
                    {(movieInfo.origin_country || []).map((countryCode) => (
                        <img
                            key={countryCode}
                            src={`https://flagcdn.com/48x36/${countryCode.toLowerCase()}.png`}
                            className="mr-1 mt-1 w-[1.4vw]"
                        />
                    ))}
                </p>
            </div>

            <div className="mb-4">
                <h4 className="font-bold">Status</h4>
                <p>{movieInfo.status}</p>
            </div>

            <div className="mb-4">
                <h4 className="font-bold">Budget</h4>
                <p>{currencyFormatter(movieInfo.budget)}</p>
            </div>

            <div className="mb-4">
                <h4 className="font-bold">Revenue</h4>
                <p>{currencyFormatter(movieInfo.revenue)}</p>
            </div>
        </div>
    );
};

export default MovieInformation;
