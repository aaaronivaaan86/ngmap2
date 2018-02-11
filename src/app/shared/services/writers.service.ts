import { Injectable, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

import { Writer } from '../writer';


@Injectable()
export class WriterServices implements OnInit {

    writersObservable$: Observable<any[]>;
    private writersPath = '/writers';

    constructor( private db: AngularFireDatabase ) {}

    ngOnInit() {
    }

    getWriters(): Observable<any> {
        return this.db.list(this.writersPath).valueChanges();
    }
}
