
import { HttpResponse } from '@angular/common/http';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { AsyncCollection, AsyncDatabase, IndexedDB, LocalStorage, SessionStorage, SyncDatabase } from '@ezzabuzaid/document-storage';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppUtils } from '../utils';

export const CACHE_DATABASE = new InjectionToken<AsyncDatabase>('INDEXED_DB_CACHE_DATABASE', {
    providedIn: 'root',
    factory: () => new AsyncDatabase(new IndexedDB('cache'))
});

export const MEMORY_CACHE_DATABASE = new InjectionToken<SyncDatabase>('LOCAL_CACHE_DATABASE', {
    providedIn: 'root',
    factory: () => new SyncDatabase(new LocalStorage('cache'))
});

export class HttpCacheEntry {
    constructor(
        public url: string,
        public value: HttpResponse<any>,
        public ttl: number
    ) { }
}

@Injectable({
    providedIn: 'root'
})
export class HttpCacheHelper {
    // TODO: implement caching strategies
    private collection: AsyncCollection<HttpCacheEntry> = null;

    constructor(
        @Inject(CACHE_DATABASE) private storage: AsyncDatabase,
    ) { }

    public populate(name: string) {
        this.collection = this.storage.collection<HttpCacheEntry>(name);
    }

    public set(uri: string, value: HttpResponse<any>, ttl: number) {
        return this.collection.set(new HttpCacheEntry(uri, value, ttl));
    }

    public get(url: string) {
        return from(this.collection.get((entry) => entry.url === url))
            .pipe(
                map((response) => AppUtils.dateElapsed(response?.ttl ?? 0) ? null : response),
                map(response => response && new HttpResponse(response.value)),
            );
    }

    public clear() {
        return this.collection.clear();
    }

}
