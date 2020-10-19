import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from '@core/constants';
import { CACHE_DATABASE } from '@core/helpers/cache';
import { AppUtils } from '@core/helpers/utils';
import { ChatModel, ListEntityQuery, ListEntityResponse, PlainQuery, WriteResult } from '@shared/models';
import { Subject } from 'rxjs';
import { map, scan, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})

export class ChatService {
    groupsSubject = new Subject<ChatModel.Room[]>();
    conversationsSubject = new Subject<ChatModel.Room[]>();

    constructor(
        private readonly http: HttpClient,
    ) {
        this.http.get<ListEntityResponse<ChatModel.Room>>(Constants.API.CHAT.groups)
            .pipe(map(({ list }) => list))
            .subscribe(this.groupsSubject);

        this.http.get<ListEntityResponse<ChatModel.Room>>(Constants.API.CHAT.conversation)
            .pipe(map(({ list }) => list))
            .subscribe(this.conversationsSubject);
    }

    public createRoom(message: string, name: string, members: string[]) {
        return this.http.post<ChatModel.Room>(Constants.API.CHAT.rooms, { message, name, members })
            .pipe(tap((response) => {
                if (members.length === 1) {
                    this.conversationsSubject.next([new ChatModel.Room(response)]);
                }
            }));
    }

    public getGroup(users: string[]) {
        const query = users.reduce((acc, user) => acc += `members[]=${ user }&`, '');
        return this.http.get<ChatModel.Room>(`${ Constants.API.CHAT.members }?${ query }`);
    }

    public getGroups() {
        return this.groupsSubject.asObservable()
            .pipe(scan((accumlator, value) => {
                accumlator.push(...value);
                return accumlator;
            }, []));
    }

    public getConversations() {
        return this.conversationsSubject.asObservable()
            .pipe(scan((accumlator, value) => {
                accumlator.push(...value);
                return accumlator;
            }, []));
    }

    public getGroupMembers(group_id: string) {
        return this.http
            .configure({
                CACHE: {
                    category: 'test',
                    ttl: AppUtils.duration(10)
                }
            })
            .get<ListEntityResponse<ChatModel.IMember>>(`${ Constants.API.CHAT.members }/${ group_id }`)
            .pipe(map(({ list }) => list));
    }

    public fetchMessages(room: string, query: ListEntityQuery) {
        const plainQuery = new PlainQuery(query);
        return this.http.get<ListEntityResponse<ChatModel.Message>>(`${ Constants.API.CHAT.rooms }/${ room }/messages?${ plainQuery.asString }`);
    }

}
