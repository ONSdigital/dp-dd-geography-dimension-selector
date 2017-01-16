import config from '../../config';

import Details from './components/Details';
import Download from './components/Download';
import Dimension from './components/Dimension';

import DimensionBrowser from './components/dimension/Browser';
import DimensionCustomisation from './components/dimension/Customisation';
import DimensionSearch from './components/dimension/Search';
import DimensionSummary from './components/dimension/Summary';


export default [
    { path: `${config.BASE_PATH}/dataset/:id`, component: Details },
    { path: `${config.BASE_PATH}/dataset/:id/download`, component: Download },
    { path: `${config.BASE_PATH}/dataset/:id/dimensions`, component: Dimension },
    { path: `${config.BASE_PATH}/dataset/:id/dimension/:dimensionID`, component: Dimension },
    { path: `${config.BASE_PATH}/dataset/:id/dimension/:dimensionID/customise`, component: DimensionCustomisation },
    { path: `${config.BASE_PATH}/dataset/:id/dimension/:dimensionID/browse`, component: DimensionBrowser },
    { path: `${config.BASE_PATH}/dataset/:id/dimension/:dimensionID/search`, component: DimensionSearch },
    { path: `${config.BASE_PATH}/dataset/:id/dimension/:dimensionID/summary`, component: DimensionSummary },
]
