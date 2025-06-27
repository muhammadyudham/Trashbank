import { AxiosInstance } from 'axios';
import { route as ziggyRoute } from 'ziggy-js';

declare module 'ziggy-js';

declare global {
    interface Window {
        axios: AxiosInstance;
    }

    var route: typeof ziggyRoute;
}
