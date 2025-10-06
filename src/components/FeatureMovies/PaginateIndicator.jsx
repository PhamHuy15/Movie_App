const PaginateIndicator = ({ movies, activeMovieId, setActiveMovieId }) => {
    // const handleAutoChange = () => {
    //     const currentIndex = movies.findIndex(
    //         (movie) => movie.id === activeMovieId,
    //     );
    //     const nextIndex = (currentIndex + 1) % movies.length;
    //     setActiveMovieId(movies[nextIndex].id);
    // };

    // useEffect(() => {
    //     const interval = setInterval(handleAutoChange, 5000);
    //     return () => clearInterval(interval);
    // }, [activeMovieId, movies]);

    return (
        <div className="absolute bottom-[10%] right-8">
            <ul className="flex gap-1">
                {movies.map((movie) => (
                    <li
                        onClick={() => setActiveMovieId(movie.id)}
                        key={movie.id}
                        className={`h-1 w-6 cursor-pointer transition-all duration-500 ${activeMovieId === movie.id ? 'bg-slate-100' : 'bg-slate-600'}`}
                    ></li>
                ))}
            </ul>
        </div>
    );
};

export default PaginateIndicator;
