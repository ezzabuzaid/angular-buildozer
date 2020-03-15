import { Injectable, Host } from '@angular/core';
import { Listener } from '@core/helpers/listener';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { pluck, distinctUntilKeyChanged, map, tap, share } from 'rxjs/operators';
import { merge, Subject } from 'rxjs';

@Injectable()
export class MediaHubManager extends Listener<any> {
    subscription = new Subject()

    constructor(
        private route: ActivatedRoute,
        private router: Router
    ) {
        super(null);
    }

    onQueryParamChange(param: string) {
        return this.route.queryParams
            .pipe(
                distinctUntilKeyChanged(param),
                pluck<Params, string>(param),
                share()
            );
    }

    onFolderChange() {
        return this.onQueryParamChange('folder_id');
    }

    onSearch() {
        return merge(
            // TODO: Implement typeahead operator
            this.onQueryParamChange('file'),
            this.onQueryParamChange('folder_id')
        )
            .pipe(
                map(() => ({
                    fileName: this.getQueryParam('file'),
                    folder_id: this.getCurrentFolderID()
                })));
    }

    search({ file, folder_id = this.getCurrentFolderID() }) {
        return this.router.navigate(['.'], {
            relativeTo: this.route,
            queryParams: {
                folder_id,
                file
            }
        })
    }

    getCurrentFolderID() {
        return this.getQueryParam('folder_id');
    }


    getQueryParam(param: string) {
        return this.route.snapshot.queryParamMap.get(param);
    }

}