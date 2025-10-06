const TvShowInformation = ({ tvInfo }) => {
    return (
        <div>
            <p className="mb-4 text-[1.4vw] font-bold">Information</p>

            <div className="mb-4">
                <h4 className="font-bold">Original Name</h4>
                <p>{tvInfo.original_name}</p>
            </div>

            <div className="mb-4">
                <h4 className="font-bold">Original Country</h4>
                <p>
                    {(tvInfo.origin_country || []).map((countryCode) => (
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
                <p>{tvInfo.status}</p>
            </div>

            <div className="mb-4">
                <h4 className="mb-2 font-bold">Network</h4>
                <p>
                    {(tvInfo.networks || []).map((network) => (
                        <img
                            key={network.id}
                            src={`https://media.themoviedb.org/t/p/h30${network.logo_path}`}
                        />
                    ))}
                </p>
            </div>
        </div>
    );
};

export default TvShowInformation;
