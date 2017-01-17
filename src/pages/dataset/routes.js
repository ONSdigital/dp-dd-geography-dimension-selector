import config from '../../config';

import Details from './components/Details';
import Download from './components/Download';
import Dimension from './components/Dimension';

export default [
    { path: `${config.BASE_PATH}/dataset/:id`, component: Details },
    { path: `${config.BASE_PATH}/dataset/:id/download`, component: Download },
    { path: `${config.BASE_PATH}/dataset/:id/dimensions`, component: Dimension },
    { path: `${config.BASE_PATH}/dataset/:id/dimension/:dimensionID`, component: Dimension }
]
