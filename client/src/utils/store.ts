import { createStore } from 'vuex';

export default createStore({
    state: {
        window: {
            trax: false
        },
        trax: {
            editor: false,
            alert: null,
            songs: null,
            collection: null,
            visibleCollection: [],
            collectionPages: 0,
            currentPage: 1,
        }
    },
});