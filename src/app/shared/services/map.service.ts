import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

@Injectable()
export class MapService {

  // location Geojson file
  private _url = 'assets/estados.geojson';
  private _intUrl = 'assets/paises.geojson';

  constructor(private _http: Http) { }

  // graphType = '';
  public newGraphTypeSubject = new Subject<any>();
  public newInternationalGraphType = new Subject<any>();

  getGeoJson() {
    return this._http.get(this._url)
               .map( (response: Response) => response.json());
  }

  setGraphType(data) {
    this.newGraphTypeSubject.next(data);
  }

  getIntGeoJson() {
    return this._http.get(this.  _intUrl)
               .map( (response: Response) => response.json());
  }

  setInternationalGraphType (data) {
    this.newInternationalGraphType.next(data);
  }
}
