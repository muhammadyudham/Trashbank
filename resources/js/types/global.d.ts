import { AxiosInstance } from 'axios';
import { Config, route as ziggyRoute, Router } from 'ziggy-js';

declare module 'ziggy-js' {
    interface ZiggyConfig extends Config {
        // Jika Anda memiliki rute kustom atau bindings, definisikan di sini
        // routes: {
        //     'dashboard': [],
        //     'profile.edit': [],
        //     // ... dan seterusnya
        // };
    }
}

declare global {
    interface Window {
        axios: AxiosInstance;
        // Ini adalah deklarasi global untuk objek Ziggy yang mungkin ada di Window
        Ziggy: Config & { routes: { [key: string]: { uri: string, methods: string[], bindings?: { [key: string]: string }, parameters?: { [key: string]: string } } } };
    }

    // Deklarasi fungsi `route` global yang bisa dipanggil
    var route: typeof ziggyRoute;
}