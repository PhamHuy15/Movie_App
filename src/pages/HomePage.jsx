import FeatureMovies from '../components/FeatureMovies/FeatureMovies';
import MediaList from '../components/MediaList/MediaList';
import { TOP_RATES_TABS, TRENDING_TABS } from '../libs/constants';

function App() {
    return (
        <div>
            <FeatureMovies />
            <MediaList title="Trending" tabs={TRENDING_TABS} />
            <MediaList title="Top Rated" tabs={TOP_RATES_TABS} />
        </div>
    );
}

export default App;
