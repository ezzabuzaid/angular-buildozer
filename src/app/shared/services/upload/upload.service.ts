import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from '@core/constants';
import { ListEntityResponse, MediaModel, PlainQuery } from '@shared/models';
import { map } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class UploadsService {

    constructor(
        private readonly http: HttpClient
    ) { }

    uploadImage(file: File, folder: string) {
        const fd = new FormData();
        fd.append('upload', file);
        return this.http.post<MediaModel.CreateFileResponse>(`${ Constants.API.UPLOADS.base }/${ folder }`, fd);
    }

    createFolder(name: string) {
        return this.http.post<MediaModel.CreateFileResponse>(Constants.API.UPLOADS.folders, { name });
    }

    deleteFolder(folder_id: string) {
        return this.http.delete(`${ Constants.API.UPLOADS.folders }/${ folder_id }`);
    }

    deleteFile(file_id: string) {
        return this.http.delete(`${ Constants.API.UPLOADS.base }/${ file_id }`);
    }

    updateFile(id: string, file: Partial<MediaModel.IFile>) {
        return this.http.patch(`${ Constants.API.UPLOADS.base }/${ id }`, file);
    }

    updateFolder(folder: Partial<MediaModel.Folder>) {
        return this.http.patch(`${ Constants.API.UPLOADS.folders }/${ folder._id }`, folder);
    }

    getFolders() {
        return this.http.get<ListEntityResponse<MediaModel.Folder>>(Constants.API.UPLOADS.folders)
            .pipe(map(({ list }) => list));
    }

    getUserFolders() {
        return this.http
            .configure({ CACHE: null })
            .get<ListEntityResponse<MediaModel.Folder>>(`${ Constants.API.UPLOADS.folders }/user`)
            .pipe(map(({ list }) => list));
    }

    getSharedFolders() {
        return this.http
            .configure({ CACHE: null })
            .get<ListEntityResponse<MediaModel.Folder>>(`${ Constants.API.UPLOADS.folders }/user/shared`)
            .pipe(map(({ list }) => list));
    }

    public searchForFiles(query: MediaModel.FileSearchQuery) {
        const plainQuery = new PlainQuery(query);
        return this.http.get<ListEntityResponse<MediaModel.File>>(`${ Constants.API.UPLOADS.search }?${ plainQuery.asString }`)
            .pipe(map((data) => {
                data.list = data.list.map(file => new MediaModel.File(file));
                return data;
            }));
    }

    getTags() {
        return this.http
            .configure({ CACHE: {} })
            .get<MediaModel.Tag[]>(`${ Constants.API.UPLOADS.tags }`);
    }

}
