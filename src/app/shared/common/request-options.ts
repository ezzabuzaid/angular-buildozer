export interface IRequestOptions {
    /**
     * Weather to show response message in a snackbar
     */
    SNACKBAR: boolean;
    /**
     * Indicates if the progress bar should be shown for the request latency
     */
    PROGRESS_BAR: boolean;
    /**
     * Special progress to show when using form container
     *
     * FYI, the progress bae will be shown in all form container in the same view although the another form didn't ask to
     */
    FORM_PROGRESS_BAR: boolean;
    /**
     * Returns the whole resoponse
     *
     * the default is to return only the data property from the response
     */
    FULL_RESPONSE: boolean;

    /**
     * Configure the request to be cached
     *
     * if undefined/null or not setted the request will not be cached
     */
    CACHE: ICacheOption;
}

interface ICacheOption {
    /**
     * Name of the object store that will be used to save the response
     */
    category?: string;
    // provider: InjectionToken<AsyncStorage>;
    ttl?: number;
}
