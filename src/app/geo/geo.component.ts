import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { MapType } from '../shared/mapType';
import { natListMap } from '../shared/map_options';
import { InternationalMapOptions } from '../shared/models/international_map_options';

import { MapService } from '../shared/services/map.service';

// import { baseMapStyle } from '../../assets/mapstyle';

@Component({
    selector: 'app-geo',
    templateUrl: './geo.component.html',
    styleUrls: ['./geo.component.css']
})
export class GeoComponent implements OnInit {

    natListMapVm = natListMap;
    intListMapVm = InternationalMapOptions;

    // build map var
    positions: any[];
    lat = 23.614329;
    long = 7.910156;
    zoom = 2;


    // base map style
    public mapStyle = [
        {
           'featureType': 'water',
           'elementType': 'geometry.fill',
           'stylers': [
              {
                 'color': '#8bb5ba'
              }
           ]
        },
        {
           'featureType': 'landscape.natural',
           'elementType': 'geometry.fill',
           'stylers': [
              {
                 'color': '#fff5ff'
              }
           ]
        },
        {
           'featureType': 'poi.park',
           'elementType': 'geometry.fill',
           'stylers': [
              {
                 'color': '#ffffff'
              }
           ]
        },
        {
           'featureType': 'road.highway',
           'elementType': 'geometry.fill',
           'stylers': [
              {
                 'color': '#ffffff'
              }
           ]
        },
        {
           'featureType': 'administrative.locality',
           'elementType': 'all',
           'stylers': [
              {
                 'visibility': 'off'
              }
           ]
        },
        {
           'featureType': 'administrative.province',
           'elementType': 'all',
           'stylers': [
              {
                 'visibility': 'on'
              },
              {
                 'weight': 0.1
              }
           ]
        },
        {
           'featureType': 'road',
           'elementType': 'geometry',
           'stylers': [
              {
                 'color': '#ffffff'
              }
           ]
        }
     ];

    geoJsonObject: Object;
    // Fill map var
    mapSelectedPorperty = '';
    mapSelectedNumber: number;
    color: string;

    // international map
    geoIntJsonObject: Object;
    constructor(private _mS: MapService) { }

    ngOnInit() { }

    onChange(selectedMap) {
        if (selectedMap.viewModel.mapProperty != null) {
            this.getGeoJson();
            this.mapSelectedPorperty = selectedMap.viewModel.mapProperty.toString();
            this.mapSelectedNumber = selectedMap.viewModel.mapType;
            this._mS.setGraphType(selectedMap.viewModel);

        }
    }

    // get States Goejson calling MapServie
    getGeoJson(): void {
        this._mS.getGeoJson()
            .subscribe(gj => {
                this.geoJsonObject = gj;
            });
    }

    // Set Choroplet Maps Function
    styleFunc = (feature) => {
        if (this.mapSelectedNumber === 1) {
            // if ZoneMap
            const featureZone = feature.getProperty(this.mapSelectedPorperty);
            if (featureZone === 1) {
                this.color = '#F26D78';
            } else if (featureZone === 2) {
                this.color = '#F2DB94';
            } else if (featureZone === 3) {
                this.color = '#F2E9BD';
            } else if (featureZone === 4) {
                this.color = '#9EBF95';
            } else if (featureZone === 5) {
                this.color = '#435951';
            } else {
                this.color = '#ffffff';
            }
            return {
                fillColor: this.color,
                fillOpacity: 1,
                strokeWeight: 1,
                clickable: true,
            };
        } else if (this.mapSelectedNumber === 2) {
            // if Ra Map
            const featureRa = feature.getProperty(this.mapSelectedPorperty);
            if (featureRa === 1) {
                this.color = '#8C3737';
            } else if (featureRa === 2) {
                this.color = '#BF622C';
            } else if (featureRa === 3) {
                this.color = '#D9923B';
            } else if (featureRa === 4) {
                this.color = '#D9BA82';
            } else {
                this.color = '#ffffff';
            }
            return {
                fillColor: this.color,
                fillOpacity: 1,
                strokeWeight: 1,
                clickable: true,
            };
        } else if (this.mapSelectedNumber === 3) {
            // if Rd map
            const featureRd = feature.getProperty(this.mapSelectedPorperty);
            if (featureRd === 1) {
                this.color = '#b2182b';
            } else if (featureRd === 2) {
                this.color = '#d6604d';
            } else if (featureRd === 3) {
                this.color = '#f4a582';
            } else if (featureRd === 4) {
                this.color = '#fddbc7';
            } else if (featureRd === 5) {
                this.color = '#f7f7f7';
            } else if (featureRd === 6) {
                this.color = '#d1e5f0';
            } else if (featureRd === 7) {
                this.color = '#92c5de';
            } else if (featureRd === 8) {
                this.color = '#74add1';
            } else if (featureRd === 9) {
                this.color = '#4575b4';
            } else {
                this.color = '#ffffff';
            }
            return {
                fillColor: this.color,
                fillOpacity: 1,
                strokeWeight: 1,
                clickable: true,
            };
        } else {
            // falta estilo
        }
    }

    onInternationalChange(slctCountry) {
        if (slctCountry.viewModel.mapProperty != null) {
            this.getIntGeoJson();
            this.mapSelectedPorperty = slctCountry.viewModel.mapProperty.toString();
            console.log( this.mapSelectedPorperty);

            this.mapSelectedNumber = slctCountry.viewModel.mapType;
            console.log( this.mapSelectedNumber);
            this._mS.setInternationalGraphType(slctCountry.viewModel);
        }
    }

    getIntGeoJson(): void {
        this._mS.getIntGeoJson()
            .subscribe(gj => {
                this.geoIntJsonObject = gj;
                console.log(this.geoIntJsonObject);

            });
    }

    intStyleFunc = (feature) => {

        if (this.mapSelectedNumber === 1) {
            const featureZone = feature.getProperty(this.mapSelectedPorperty);
            console.log('case 1');

            if (featureZone === 1) {
                this.color = '#F26D78';
            } else if (featureZone === 2) {
                this.color = '#F2DB94';
            } else if (featureZone === 3) {
                this.color = '#F2E9BD';
            } else if (featureZone === 4) {
                this.color = '#9EBF95';
            } else if (featureZone === 5) {
                this.color = '#435951';
            } else {
                this.color = '#ffffff';
            }
            return {
                fillColor: this.color,
                fillOpacity: 1,
                strokeWeight: 1,
                clickable: true,
            };

        } else if (this.mapSelectedNumber === 2) {
            const featureCont = feature.getProperty(this.mapSelectedPorperty);
            console.log(featureCont);
            if (featureCont === 1) {
                this.color = '#F26D78';
            } else if (featureCont === 2) {
                this.color = '#F2DB94';
            } else if (featureCont === 3) {
                this.color = '#F2E9BD';
            } else if (featureCont === 4) {
                this.color = '#9EBF95';
            } else {
                this.color = '#ffffff';
            }
            return {
                fillColor: this.color,
                fillOpacity: 1,
                strokeWeight: 1,
                clickable: true,
            };
        }

    }





}
