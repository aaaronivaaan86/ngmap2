import { Component, OnInit, Pipe, ViewChild, ElementRef } from '@angular/core';
import { MapService } from '../shared/services/map.service';
import { WriterServices } from '../shared/services/writers.service';

import { MapType } from '../shared/mapType';

import { Writer } from '../shared/writer';
import { mapComposition } from '../shared/models/compositionmodels';

import { BaseChartDirective } from 'ng2-charts/ng2-charts';

import 'rxjs/add/operator/count';
import * as _ from 'underscore';

import { debug } from 'util';
import { Dictionary } from 'underscore';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css'],
  providers: [WriterServices]
})

export class ChartsComponent implements OnInit {



  innerWriter: Writer[];
  // BAR
  // variables for bar char data
  // femaleBarValue / masculineBarValue
  // these are stored in an array for bar chart
  fBarValue = null;
  fBarArray: number[] = [0];
  mBarValue = null;
  mBarArray: number[] = [0];
  writerBarArray: any[];
  gBarType = null;

  proofVal = null;


  // set bar options
  // Important to keep beginAtZero
  barChartOptions = {
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  };

  barChartLabels: string[] = ['M', 'F'];
  barChartType = 'bar';
  barChartLegend = true;

  barChartColors = [
    { backgroundColor: '#538EA6' },
    { backgroundColor: '#F2B8A2' }
  ];

  barChartData: any[] = [
    { data: this.fBarArray, label: 'Masculino' },
    { data: this.mBarArray, label: 'Femenino' }
  ];

  // *******************
  // PIE
  // *******************
  // to hide and show different charts
  zoneChart = false;
  raChart = false;
  rdChart = false;
  contChart = false;

  mapComp = mapComposition;
  pieChartType = 'doughnut';


  /**
   * PIE CHART
   */
  // Zone Chart
  nacZoneArr: number[] = new Array;
  pieZoneChartData: number[] = new Array;
  colorZoneArr: string[] = new Array;
  pieZoneColors = [{ backgroundColor: this.colorZoneArr }];
  pieZoneChartLabels: string[] = new Array;

  // Ra Chart
  nacRaArr: number[] = new Array;
  colorRaArr: string[] = new Array;
  pieRaChartData: number[] = new Array;
  pieRaColors = [{ backgroundColor: this.colorRaArr }];
  pieRaChartLabels: string[] = new Array;

  // Rd Chart
  nacRdArr: number[] = new Array;
  colorRdArr: string[] = new Array;
  pieRdChartData: number[] = new Array;
  pieRdColors = [{ backgroundColor: this.colorRdArr }];
  pieRdChartLabels: string[] = new Array;

  // Cont Chart
  nacContArr: number[] = new Array;
  colorContArr: string[] = new Array;
  pieContChartData: number[] = new Array;
  pieContColors = [{ backgroundColor: this.colorContArr }];
  pieContChartLabels: string[] = new Array;

  /**
   * LINE CHART
   */
  proofLine = null;
  bArray: any[] = new Array;
  dArray: any[] = new Array;
  bValues: number[] = new Array;
  dValues: number[] = new Array;

  lblArray: any[] = new Array;
  chartLineType = 'line';
  chartLineOptions = {
    responsive: true
  };

  chartLineData: any[] = new Array;
  chartLineLabels: any[] = new Array;
  lineColors = [
    { backgroundColor: 'rgba(29, 52, 83, 0.5)' },
    { backgroundColor: 'rgba(151, 153, 150, 0.5)' }
  ];

  /**
   * COUNTY BAR CHART
   */
  barCountryChartOptions: Object = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  barCountryChartType = 'bar';
  barCountryChartLegend = false;
  barCountryData: number[] = new Array;
  barCountryLabels: string[] = new Array;
  barCountryChartLabels: string[] = new Array;
  barCountryChartData: any[] = [
    { data: this.barCountryData, label: 'Nacimientos' }
  ];

  barCountryChartColors = [
    { backgroundColor: '#AC6C82' }
  ];


  constructor(private writersService: WriterServices,
    private mapService: MapService) { }

  ngOnInit() {
    this.getWriters();
    this.callNationalDrawChart();
    this.callInternationalDrawChart();

  }

  getWriters() {
    this.writersService.getWriters().subscribe({
      next: (wData) => {
        this.innerWriter = wData;
      }
    });
  }

  // subsribe the subject and call to draw
  callNationalDrawChart() {
    this.mapService.newGraphTypeSubject.subscribe(data => {
      this.gBarType = data.graphType;
      this.drawGenderChart(this.gBarType);
      this.drawDounChart(data);
      this.drawLineChart(this.gBarType);
      this.drawStatesBarChart(this.gBarType);

    });
  }

  // Data functions
  // draw the bar chart according to the value passed
  drawGenderChart(graphType: string) {
    let innerWriterBarArray = this.writerBarArray;
    this.writersService.getWriters().subscribe({
      next: (wData) => {
        innerWriterBarArray = wData;
        // condition for national general demography zones s xix
        if (graphType === 'ngdz_xix' || graphType === 'ngdra_xix' || graphType === 'ngdrd_xix' ||
          graphType === 'nmdz_xix' || graphType === 'nmdra_xix' || graphType === 'nmdrd_xix') {
          // count writers with underscore
          this.fBarValue = _.countBy(innerWriterBarArray, w => w.sexo === 'M' && w.ano_nacimiento < 1900 && w.ni_nac === 'Nacional');
          this.mBarValue = _.countBy(innerWriterBarArray, w => w.sexo === 'F' && w.ano_nacimiento < 1900 && w.ni_nac === 'Nacional');
          // assign the value to the value array that pass to the chart
          this.fBarArray[0] = this.fBarValue.true;
          this.mBarArray[0] = this.mBarValue.true;
          // refresh the graphics
          this.barChartData = [
            { data: this.fBarArray, label: 'Masculino' },
            { data: this.mBarArray, label: 'Femenino' }
          ];
          // condition for national general demography zones s xx
        } else if (graphType === 'ngdz_xx' || graphType === 'ngdra_xx' || graphType === 'ngdrd_xx' ||
          graphType === 'nmdz_xx' || graphType === 'nmdra_xx' || graphType === 'nmdrd_xx') {
          this.fBarValue = _.countBy(innerWriterBarArray, w => w.sexo === 'M' && w.ni_nac === 'Nacional');
          this.mBarValue = _.countBy(innerWriterBarArray, w => w.sexo === 'F' && w.ni_nac === 'Nacional');
          this.fBarArray[0] = this.fBarValue.true;
          this.mBarArray[0] = this.mBarValue.true;
          this.barChartData = [
            { data: this.fBarArray, label: 'Masculino' },
            { data: this.mBarArray, label: 'Femenino' }
          ];
          // condition for national general migration zones s xix
        } else if (graphType === 'ngez_xix' || graphType === 'ngera_xix' || graphType === 'ngerd_xix' ||
          graphType === 'nmez_xix' || graphType === 'nmera_xix' || graphType === 'nmerd_xix' ||
          graphType === 'ngiz_xix' || graphType === 'ngira_xix' || graphType === 'ngird_xix' ||
          graphType === 'nmiz_xix' || graphType === 'nmira_xix' || graphType === 'nmird_xix') {
          this.fBarValue = _.countBy(innerWriterBarArray, w => w.sexo === 'M' &&
            w.ano_nacimiento < 1900 &&
            w.lugar_muerte !== 'D/A' &&
            w.lugar_nacimiento !== w.lugar_muerte &&
            w.ni_fall === 'Nacional');
          this.mBarValue = _.countBy(innerWriterBarArray, w => w.sexo === 'F' &&
            w.ano_nacimiento < 1900 &&
            w.lugar_nacimiento !== w.lugar_muerte &&
            w.lugar_muerte !== 'D/A' &&
            w.ni_fall === 'Nacional');
          this.fBarArray[0] = this.fBarValue.true;
          this.mBarArray[0] = this.mBarValue.true;
          this.barChartData = [
            { data: this.fBarArray, label: 'Masculino' },
            { data: this.mBarArray, label: 'Femenino' }
          ];
          // condition for national general migration zones s xx
        } else if (graphType === 'ngez_xx' || graphType === 'ngera_xx' || graphType === 'ngerd_xx' ||
          graphType === 'nmez_xx' || graphType === 'nmera_xx' || graphType === 'nmerd_xx' ||
          graphType === 'ngiz_xx' || graphType === 'ngira_xx' || graphType === 'ngird_xx' ||
          graphType === 'nmiz_xx' || graphType === 'nmira_xx' || graphType === 'nmird_xx') {
          this.fBarValue = _.countBy(innerWriterBarArray, w => w.sexo === 'M' &&
            w.lugar_nacimiento !== w.lugar_muerte &&
            w.lugar_muerte !== 'D/A' &&
            w.ni_nac === 'Nacional' &&
            w.ni_fall === 'Nacional');
          this.mBarValue = _.countBy(innerWriterBarArray, w => w.sexo === 'F' &&
            w.lugar_nacimiento !== w.lugar_muerte &&
            w.lugar_muerte !== 'D/A' &&
            w.ni_nac === 'Nacional' &&
            w.ni_fall === 'Nacional');
          this.fBarArray[0] = this.fBarValue.true;
          this.mBarArray[0] = this.mBarValue.true;
          this.barChartData = [
            { data: this.fBarArray, label: 'Masculino' },
            { data: this.mBarArray, label: 'Femenino' }
          ];
        }
      }
    });
  }

  drawDounChart(data: MapType) {
    this.writersService.getWriters().subscribe({
      next: (wPieData) => {

        const innerWriterPieArray = wPieData;

        const nacZonaAObj: any = {};
        const nacZonaBObj: any = {};
        const nacZonaCObj: any = {};
        const nacZonaDObj: any = {};
        const nacZonaEObj: any = {};

        const nacNorteObj: any = {};
        const nacBajioObj: any = {};
        const nacCentroObj: any = {};
        const nacSurObj: any = {};

        const nacRdBc: any = {};
        const nacRdNo: any = {};
        const nacRdScN: any = {};
        const nacRdNe: any = {};
        const nacRdVg: any = {};
        const nacRdMc: any = {};
        const nacRdVp: any = {};
        const nacRdCa: any = {};
        const nacRdCe: any = {};

        if (data.mapType === 1) {

          console.log('MapType: 1');
          this.raChart = false;
          this.rdChart = false;
          this.contChart = false;
          this.zoneChart = true;

          this.nacZoneArr = [];
          this.pieZoneChartLabels = [];

          switch (data.graphType) {
            case 'ngdz_xix': {
              _.each(this.mapComp.mapComposition.ngdz_xix.zonaA, function (bb: any) { nacZonaAObj[bb.feature] = true; });
              _.each(this.mapComp.mapComposition.ngdz_xix.zonaB, function (bb: any) { nacZonaBObj[bb.feature] = true; });
              _.each(this.mapComp.mapComposition.ngdz_xix.zonaC, function (bb: any) { nacZonaCObj[bb.feature] = true; });
              _.each(this.mapComp.mapComposition.ngdz_xix.zonaD, function (bb: any) { nacZonaDObj[bb.feature] = true; });
              _.each(this.mapComp.mapComposition.ngdz_xix.zonaE, function (bb: any) { nacZonaEObj[bb.feature] = true; });

              // filter the writer array by each country / state that belongs to any category and calculate the length
              const nacZonaA = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacZonaAObj[myval.lugar_nacimiento] && myval.ano_nacimiento < 1900;
              }, this.mapComp.mapComposition.ngdz_xix.zonaA).length;
              const nacZonaB = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacZonaBObj[myval.lugar_nacimiento] && myval.ano_nacimiento < 1900;
              }, this.mapComp.mapComposition.ngdz_xix.zonaB).length;
              const nacZonaC = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacZonaCObj[myval.lugar_nacimiento] && myval.ano_nacimiento < 1900;
              }, this.mapComp.mapComposition.ngdz_xix.zonaC).length;
              const nacZonaD = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacZonaDObj[myval.lugar_nacimiento] && myval.ano_nacimiento < 1900;
              }, this.mapComp.mapComposition.ngdz_xix.zonaD).length;
              const nacZonaE = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacZonaEObj[myval.lugar_nacimiento] && myval.ano_nacimiento < 1900;
              }, this.mapComp.mapComposition.ngdz_xix.zonaE).length;

              // push to array
              this.nacZoneArr.push(nacZonaA);
              this.nacZoneArr.push(nacZonaB);
              this.nacZoneArr.push(nacZonaC);
              this.nacZoneArr.push(nacZonaD);
              this.nacZoneArr.push(nacZonaE);

              // set labels to chart
              const getPieLabels = _.keys(this.mapComp.mapComposition.ngdz_xix);
              getPieLabels.forEach(element => {
                this.pieZoneChartLabels.push(element);
              });

              // Set Chart Colors
              // declare color array
              const getColors: string[] = ['#F26D78', '#F2DB94', '#F2E9BD', '#9EBF95', '#435951'];
              // push colors to chart array color
              getColors.forEach(color => { this.colorZoneArr.push(color); });

              this.pieZoneChartData = this.nacZoneArr;
              this.colorZoneArr = [];

              break;
            }
            case 'ngdz_xx': {

              // this.nacZoneArr = [];
              // this.pieZoneChartLabels = [];
              _.each(this.mapComp.mapComposition.ngdz_xx.zonaA, function (bb: any) { nacZonaAObj[bb.feature] = true; });
              _.each(this.mapComp.mapComposition.ngdz_xx.zonaB, function (bb: any) { nacZonaBObj[bb.feature] = true; });
              _.each(this.mapComp.mapComposition.ngdz_xx.zonaC, function (bb: any) { nacZonaCObj[bb.feature] = true; });
              _.each(this.mapComp.mapComposition.ngdz_xx.zonaD, function (bb: any) { nacZonaDObj[bb.feature] = true; });
              _.each(this.mapComp.mapComposition.ngdz_xx.zonaE, function (bb: any) { nacZonaEObj[bb.feature] = true; });

              const nacZonaA = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacZonaAObj[myval.lugar_nacimiento];
              }, this.mapComp.mapComposition.ngdz_xx.zonaA).length;
              const nacZonaB = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacZonaBObj[myval.lugar_nacimiento];
              }, this.mapComp.mapComposition.ngdz_xx.zonaB).length;
              const nacZonaC = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacZonaCObj[myval.lugar_nacimiento];
              }, this.mapComp.mapComposition.ngdz_xx.zonaC).length;
              const nacZonaD = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacZonaDObj[myval.lugar_nacimiento];
              }, this.mapComp.mapComposition.ngdz_xx.zonaD).length;
              const nacZonaE = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacZonaEObj[myval.lugar_nacimiento];
              }, this.mapComp.mapComposition.ngdz_xx.zonaE).length;

              this.nacZoneArr.push(nacZonaA);
              this.nacZoneArr.push(nacZonaB);
              this.nacZoneArr.push(nacZonaC);
              this.nacZoneArr.push(nacZonaD);
              this.nacZoneArr.push(nacZonaE);

              const getPieLabels = _.keys(this.mapComp.mapComposition.ngdz_xx);
              getPieLabels.forEach(element => {
                this.pieZoneChartLabels.push(element);
              });

              const getColors: string[] = ['#F26D78', '#F2DB94', '#F2E9BD', '#9EBF95', '#435951'];
              getColors.forEach(color => { this.colorZoneArr.push(color); });

              this.pieZoneChartData = this.nacZoneArr;
              console.log(this.pieZoneChartData);

              this.colorZoneArr = [];

              break;
            }
            case 'ngez_xix': {
              _.each(this.mapComp.mapComposition.ngez_xix.zonaA, function (bb: any) { nacZonaAObj[bb.feature] = true; });
              _.each(this.mapComp.mapComposition.ngez_xix.zonaB, function (bb: any) { nacZonaBObj[bb.feature] = true; });
              _.each(this.mapComp.mapComposition.ngez_xix.zonaC, function (bb: any) { nacZonaCObj[bb.feature] = true; });
              _.each(this.mapComp.mapComposition.ngez_xix.zonaD, function (bb: any) { nacZonaDObj[bb.feature] = true; });
              _.each(this.mapComp.mapComposition.ngez_xix.zonaE, function (bb: any) { nacZonaEObj[bb.feature] = true; });

              const nacZonaA = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacZonaAObj[myval.lugar_nacimiento] &&
                  myval.ano_nacimiento < 1900 &&
                  myval.ni_fall === 'Nacional' &&
                  myval.lugar_muerte !== myval.lugar_nacimiento;
              }, this.mapComp.mapComposition.ngez_xix.zonaA).length;
              const nacZonaB = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacZonaBObj[myval.lugar_nacimiento] &&
                  myval.ano_nacimiento < 1900 &&
                  myval.ni_fall === 'Nacional' &&
                  myval.lugar_muerte !== myval.lugar_nacimiento;
              }, this.mapComp.mapComposition.ngez_xix.zonaB).length;
              const nacZonaC = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacZonaCObj[myval.lugar_nacimiento] &&
                  myval.ano_nacimiento < 1900 &&
                  myval.ni_fall === 'Nacional' &&
                  myval.lugar_muerte !== myval.lugar_nacimiento;
              }, this.mapComp.mapComposition.ngez_xix.zonaC).length;
              const nacZonaD = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacZonaDObj[myval.lugar_nacimiento] &&
                  myval.ano_nacimiento < 1900 &&
                  myval.ni_fall === 'Nacional' &&
                  myval.lugar_muerte !== myval.lugar_nacimiento;
              }, this.mapComp.mapComposition.ngez_xix.zonaD).length;
              const nacZonaE = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacZonaEObj[myval.lugar_nacimiento] &&
                  myval.ano_nacimiento < 1900 &&
                  myval.ni_fall === 'Nacional' &&
                  myval.lugar_muerte !== myval.lugar_nacimiento;
              }, this.mapComp.mapComposition.ngez_xix.zonaE).length;

              this.nacZoneArr.push(nacZonaA);
              this.nacZoneArr.push(nacZonaB);
              this.nacZoneArr.push(nacZonaC);
              this.nacZoneArr.push(nacZonaD);
              this.nacZoneArr.push(nacZonaE);

              const getPieLabels = _.keys(this.mapComp.mapComposition.ngez_xix);
              getPieLabels.forEach(element => {
                this.pieZoneChartLabels.push(element);
              });

              const getColors: string[] = ['#F26D78', '#F2DB94', '#F2E9BD', '#9EBF95', '#435951'];
              getColors.forEach(color => { this.colorZoneArr.push(color); });

              this.pieZoneChartData = this.nacZoneArr;
              this.colorZoneArr = [];

              break;
            }
            case 'ngez_xx': {

              _.each(this.mapComp.mapComposition.ngez_xx.zonaA, function (bb: any) { nacZonaAObj[bb.feature] = true; });
              _.each(this.mapComp.mapComposition.ngez_xx.zonaB, function (bb: any) { nacZonaBObj[bb.feature] = true; });
              _.each(this.mapComp.mapComposition.ngez_xx.zonaC, function (bb: any) { nacZonaCObj[bb.feature] = true; });
              _.each(this.mapComp.mapComposition.ngez_xx.zonaD, function (bb: any) { nacZonaDObj[bb.feature] = true; });
              _.each(this.mapComp.mapComposition.ngez_xx.zonaE, function (bb: any) { nacZonaEObj[bb.feature] = true; });

              const nacZonaA = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacZonaAObj[myval.lugar_nacimiento] &&
                  myval.ni_fall === 'Nacional' &&
                  myval.lugar_muerte !== myval.lugar_nacimiento;
              }, this.mapComp.mapComposition.ngez_xx.zonaA).length;
              const nacZonaB = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacZonaBObj[myval.lugar_nacimiento] &&
                  myval.ni_fall === 'Nacional' &&
                  myval.lugar_muerte !== myval.lugar_nacimiento;
              }, this.mapComp.mapComposition.ngez_xx.zonaB).length;
              const nacZonaC = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacZonaCObj[myval.lugar_nacimiento] &&
                  myval.ni_fall === 'Nacional' &&
                  myval.lugar_muerte !== myval.lugar_nacimiento;
              }, this.mapComp.mapComposition.ngez_xx.zonaC).length;
              const nacZonaD = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacZonaDObj[myval.lugar_nacimiento] &&
                  myval.ni_fall === 'Nacional' &&
                  myval.lugar_muerte !== myval.lugar_nacimiento;
              }, this.mapComp.mapComposition.ngez_xx.zonaD).length;
              const nacZonaE = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacZonaEObj[myval.lugar_nacimiento] &&
                  myval.ni_fall === 'Nacional' &&
                  myval.lugar_muerte !== myval.lugar_nacimiento;
              }, this.mapComp.mapComposition.ngez_xx.zonaE).length;

              this.nacZoneArr.push(nacZonaA);
              this.nacZoneArr.push(nacZonaB);
              this.nacZoneArr.push(nacZonaC);
              this.nacZoneArr.push(nacZonaD);
              this.nacZoneArr.push(nacZonaE);

              const getPieLabels = _.keys(this.mapComp.mapComposition.ngez_xx);
              getPieLabels.forEach(element => {
                this.pieZoneChartLabels.push(element);
              });

              const getColors: string[] = ['#F26D78', '#F2DB94', '#F2E9BD', '#9EBF95', '#435951'];
              getColors.forEach(color => { this.colorZoneArr.push(color); });

              this.pieZoneChartData = this.nacZoneArr;
              this.colorZoneArr = [];
              break;
            }
            case 'ngiz_xix': {

              _.each(this.mapComp.mapComposition.ngiz_xix.zonaA, function (bb: any) { nacZonaAObj[bb.feature] = true; });
              _.each(this.mapComp.mapComposition.ngiz_xix.zonaB, function (bb: any) { nacZonaBObj[bb.feature] = true; });
              _.each(this.mapComp.mapComposition.ngiz_xix.zonaC, function (bb: any) { nacZonaCObj[bb.feature] = true; });
              _.each(this.mapComp.mapComposition.ngiz_xix.zonaD, function (bb: any) { nacZonaDObj[bb.feature] = true; });
              _.each(this.mapComp.mapComposition.ngiz_xix.zonaE, function (bb: any) { nacZonaEObj[bb.feature] = true; });

              const nacZonaA = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacZonaAObj[myval.lugar_muerte] &&
                  myval.ano_nacimiento < 1900 &&
                  myval.ni_nac === 'Nacional' &&
                  myval.lugar_muerte !== myval.lugar_nacimiento;
              }, this.mapComp.mapComposition.ngiz_xix.zonaA).length;
              const nacZonaB = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacZonaBObj[myval.lugar_muerte] &&
                  myval.ano_nacimiento < 1900 &&
                  myval.ni_nac === 'Nacional' &&
                  myval.lugar_muerte !== myval.lugar_nacimiento;
              }, this.mapComp.mapComposition.ngiz_xix.zonaB).length;
              const nacZonaC = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacZonaCObj[myval.lugar_muerte] &&
                  myval.ano_nacimiento < 1900 &&
                  myval.ni_nac === 'Nacional' &&
                  myval.lugar_muerte !== myval.lugar_nacimiento;
              }, this.mapComp.mapComposition.ngiz_xix.zonaC).length;
              const nacZonaD = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacZonaDObj[myval.lugar_muerte] &&
                  myval.ano_nacimiento < 1900 &&
                  myval.ni_nac === 'Nacional' &&
                  myval.lugar_muerte !== myval.lugar_nacimiento;
              }, this.mapComp.mapComposition.ngiz_xix.zonaD).length;
              const nacZonaE = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacZonaEObj[myval.lugar_muerte] &&
                  myval.ano_nacimiento < 1900 &&
                  myval.ni_nac === 'Nacional' &&
                  myval.lugar_muerte !== myval.lugar_nacimiento;
              }, this.mapComp.mapComposition.ngiz_xix.zonaE).length;

              this.nacZoneArr.push(nacZonaA);
              this.nacZoneArr.push(nacZonaB);
              this.nacZoneArr.push(nacZonaC);
              this.nacZoneArr.push(nacZonaD);
              this.nacZoneArr.push(nacZonaE);

              const getPieLabels = _.keys(this.mapComp.mapComposition.ngiz_xix);
              getPieLabels.forEach(element => {
                this.pieZoneChartLabels.push(element);
              });

              const getColors: string[] = ['#F26D78', '#F2DB94', '#F2E9BD', '#9EBF95', '#435951'];
              getColors.forEach(color => { this.colorZoneArr.push(color); });

              this.pieZoneChartData = this.nacZoneArr;
              this.colorZoneArr = [];

              break;
            }
            case 'ngiz_xx': {

              _.each(this.mapComp.mapComposition.ngiz_xx.zonaA, function (bb: any) { nacZonaAObj[bb.feature] = true; });
              _.each(this.mapComp.mapComposition.ngiz_xx.zonaB, function (bb: any) { nacZonaBObj[bb.feature] = true; });
              _.each(this.mapComp.mapComposition.ngiz_xx.zonaC, function (bb: any) { nacZonaCObj[bb.feature] = true; });
              _.each(this.mapComp.mapComposition.ngiz_xx.zonaD, function (bb: any) { nacZonaDObj[bb.feature] = true; });
              _.each(this.mapComp.mapComposition.ngiz_xx.zonaE, function (bb: any) { nacZonaEObj[bb.feature] = true; });

              const nacZonaA = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacZonaAObj[myval.lugar_muerte] &&
                  myval.ni_nac === 'Nacional' &&
                  myval.lugar_muerte !== myval.lugar_nacimiento;
              }, this.mapComp.mapComposition.ngiz_xix.zonaA).length;
              const nacZonaB = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacZonaBObj[myval.lugar_muerte] &&
                  myval.ni_nac === 'Nacional' &&
                  myval.lugar_muerte !== myval.lugar_nacimiento;
              }, this.mapComp.mapComposition.ngiz_xix.zonaB).length;
              const nacZonaC = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacZonaCObj[myval.lugar_muerte] &&
                  myval.ni_nac === 'Nacional' &&
                  myval.lugar_muerte !== myval.lugar_nacimiento;
              }, this.mapComp.mapComposition.ngiz_xix.zonaC).length;
              const nacZonaD = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacZonaDObj[myval.lugar_muerte] &&
                  myval.ni_nac === 'Nacional' &&
                  myval.lugar_muerte !== myval.lugar_nacimiento;
              }, this.mapComp.mapComposition.ngiz_xix.zonaD).length;
              const nacZonaE = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacZonaEObj[myval.lugar_muerte] &&
                  myval.ni_nac === 'Nacional' &&
                  myval.lugar_muerte !== myval.lugar_nacimiento;
              }, this.mapComp.mapComposition.ngiz_xix.zonaE).length;

              this.nacZoneArr.push(nacZonaA);
              this.nacZoneArr.push(nacZonaB);
              this.nacZoneArr.push(nacZonaC);
              this.nacZoneArr.push(nacZonaD);
              this.nacZoneArr.push(nacZonaE);

              const getPieLabels = _.keys(this.mapComp.mapComposition.ngiz_xix);
              getPieLabels.forEach(element => {
                this.pieZoneChartLabels.push(element);
              });

              const getColors: string[] = ['#F26D78', '#F2DB94', '#F2E9BD', '#9EBF95', '#435951'];
              getColors.forEach(color => { this.colorZoneArr.push(color); });

              this.pieZoneChartData = this.nacZoneArr;
              this.colorZoneArr = [];
              break;
            }
            case 'nmdz_xix': {

              _.each(this.mapComp.mapComposition.nmdz_xix.zonaA, function (bb: any) { nacZonaAObj[bb.feature] = true; });
              _.each(this.mapComp.mapComposition.nmdz_xix.zonaB, function (bb: any) { nacZonaBObj[bb.feature] = true; });
              _.each(this.mapComp.mapComposition.nmdz_xix.zonaC, function (bb: any) { nacZonaCObj[bb.feature] = true; });
              _.each(this.mapComp.mapComposition.nmdz_xix.zonaD, function (bb: any) { nacZonaDObj[bb.feature] = true; });
              _.each(this.mapComp.mapComposition.nmdz_xix.zonaE, function (bb: any) { nacZonaEObj[bb.feature] = true; });

              const nacZonaA = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacZonaAObj[myval.lugar_nacimiento] && myval.ano_nacimiento < 1900 && myval.sexo === 'F';
              }, this.mapComp.mapComposition.nmdz_xix.zonaA).length;
              const nacZonaB = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacZonaBObj[myval.lugar_nacimiento] && myval.ano_nacimiento < 1900 && myval.sexo === 'F';
              }, this.mapComp.mapComposition.nmdz_xix.zonaB).length;
              const nacZonaC = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacZonaCObj[myval.lugar_nacimiento] && myval.ano_nacimiento < 1900 && myval.sexo === 'F';
              }, this.mapComp.mapComposition.nmdz_xix.zonaC).length;
              const nacZonaD = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacZonaDObj[myval.lugar_nacimiento] && myval.ano_nacimiento < 1900 && myval.sexo === 'F';
              }, this.mapComp.mapComposition.nmdz_xix.zonaD).length;
              const nacZonaE = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacZonaEObj[myval.lugar_nacimiento] && myval.ano_nacimiento < 1900 && myval.sexo === 'F';
              }, this.mapComp.mapComposition.nmdz_xix.zonaD).length;

              this.nacZoneArr.push(nacZonaA);
              this.nacZoneArr.push(nacZonaB);
              this.nacZoneArr.push(nacZonaC);
              this.nacZoneArr.push(nacZonaD);
              this.nacZoneArr.push(nacZonaE);

              const getPieLabels = _.keys(this.mapComp.mapComposition.nmdz_xix);
              getPieLabels.forEach(element => {
                this.pieZoneChartLabels.push(element);
              });

              const getColors: string[] = ['#F26D78', '#F2DB94', '#F2E9BD', '#9EBF95', '#435951'];
              getColors.forEach(color => { this.colorZoneArr.push(color); });

              this.pieZoneChartData = this.nacZoneArr;
              this.colorZoneArr = [];
              break;
            }
            case 'nmdz_xx': {

              _.each(this.mapComp.mapComposition.nmdz_xx.zonaA, function (bb: any) { nacZonaAObj[bb.feature] = true; });
              _.each(this.mapComp.mapComposition.nmdz_xx.zonaB, function (bb: any) { nacZonaBObj[bb.feature] = true; });
              _.each(this.mapComp.mapComposition.nmdz_xx.zonaC, function (bb: any) { nacZonaCObj[bb.feature] = true; });
              _.each(this.mapComp.mapComposition.nmdz_xx.zonaD, function (bb: any) { nacZonaDObj[bb.feature] = true; });
              _.each(this.mapComp.mapComposition.nmdz_xx.zonaE, function (bb: any) { nacZonaEObj[bb.feature] = true; });

              const nacZonaA = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacZonaAObj[myval.lugar_nacimiento] && myval.sexo === 'F';
              }, this.mapComp.mapComposition.nmdz_xx.zonaA).length;
              const nacZonaB = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacZonaBObj[myval.lugar_nacimiento] && myval.sexo === 'F';
              }, this.mapComp.mapComposition.nmdz_xx.zonaB).length;
              const nacZonaC = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacZonaCObj[myval.lugar_nacimiento] && myval.sexo === 'F';
              }, this.mapComp.mapComposition.nmdz_xx.zonaC).length;
              const nacZonaD = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacZonaDObj[myval.lugar_nacimiento] && myval.sexo === 'F';
              }, this.mapComp.mapComposition.nmdz_xx.zonaD).length;
              const nacZonaE = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacZonaEObj[myval.lugar_nacimiento] && myval.sexo === 'F';
              }, this.mapComp.mapComposition.nmdz_xx.zonaD).length;

              this.nacZoneArr.push(nacZonaA);
              this.nacZoneArr.push(nacZonaB);
              this.nacZoneArr.push(nacZonaC);
              this.nacZoneArr.push(nacZonaD);
              this.nacZoneArr.push(nacZonaE);

              const getPieLabels = _.keys(this.mapComp.mapComposition.nmdz_xx);
              getPieLabels.forEach(element => {
                this.pieZoneChartLabels.push(element);
              });

              const getColors: string[] = ['#F26D78', '#F2DB94', '#F2E9BD', '#9EBF95', '#435951'];

              getColors.forEach(color => { this.colorZoneArr.push(color); });

              this.pieZoneChartData = this.nacZoneArr;
              this.colorZoneArr = [];
              break;
            }
            case 'nmez_xix': {
              _.each(this.mapComp.mapComposition.nmez_xix.zonaA, function (bb: any) { nacZonaAObj[bb.feature] = true; });
              _.each(this.mapComp.mapComposition.nmez_xix.zonaB, function (bb: any) { nacZonaBObj[bb.feature] = true; });
              _.each(this.mapComp.mapComposition.nmez_xix.zonaC, function (bb: any) { nacZonaCObj[bb.feature] = true; });
              _.each(this.mapComp.mapComposition.nmez_xix.zonaD, function (bb: any) { nacZonaDObj[bb.feature] = true; });
              _.each(this.mapComp.mapComposition.nmez_xix.zonaE, function (bb: any) { nacZonaEObj[bb.feature] = true; });

              const nacZonaA = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacZonaAObj[myval.lugar_nacimiento] &&
                  myval.sexo === 'F' &&
                  myval.ano_nacimiento < 1900 &&
                  myval.ni_fall === 'Nacional' &&
                  myval.lugar_muerte !== myval.lugar_nacimiento;
              }, this.mapComp.mapComposition.nmez_xix.zonaA).length;
              const nacZonaB = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacZonaBObj[myval.lugar_nacimiento] &&
                  myval.sexo === 'F' &&
                  myval.ano_nacimiento < 1900 &&
                  myval.ni_fall === 'Nacional' &&
                  myval.lugar_muerte !== myval.lugar_nacimiento;
              }, this.mapComp.mapComposition.nmez_xix.zonaB).length;
              const nacZonaC = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacZonaCObj[myval.lugar_nacimiento] &&
                  myval.sexo === 'F' &&
                  myval.ano_nacimiento < 1900 &&
                  myval.ni_fall === 'Nacional' &&
                  myval.lugar_muerte !== myval.lugar_nacimiento;
              }, this.mapComp.mapComposition.nmez_xix.zonaC).length;
              const nacZonaD = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacZonaDObj[myval.lugar_nacimiento] &&
                  myval.sexo === 'F' &&
                  myval.ano_nacimiento < 1900 &&
                  myval.ni_fall === 'Nacional' &&
                  myval.lugar_muerte !== myval.lugar_nacimiento;
              }, this.mapComp.mapComposition.nmez_xix.zonaD).length;
              const nacZonaE = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacZonaEObj[myval.lugar_nacimiento] &&
                  myval.sexo === 'F' &&
                  myval.ano_nacimiento < 1900 &&
                  myval.ni_fall === 'Nacional' &&
                  myval.lugar_muerte !== myval.lugar_nacimiento;
              }, this.mapComp.mapComposition.nmez_xix.zonaE).length;

              this.nacZoneArr.push(nacZonaA);
              this.nacZoneArr.push(nacZonaB);
              this.nacZoneArr.push(nacZonaC);
              this.nacZoneArr.push(nacZonaD);
              this.nacZoneArr.push(nacZonaE);

              const getPieLabels = _.keys(this.mapComp.mapComposition.nmez_xix);
              getPieLabels.forEach(element => {
                this.pieZoneChartLabels.push(element);
              });

              const getColors: string[] = ['#F26D78', '#F2DB94', '#F2E9BD', '#9EBF95', '#435951'];
              getColors.forEach(color => { this.colorZoneArr.push(color); });

              this.pieZoneChartData = this.nacZoneArr;
              this.colorZoneArr = [];
              break;
            }
            case 'nmez_xx': {

              _.each(this.mapComp.mapComposition.nmez_xx.zonaA, function (bb: any) { nacZonaAObj[bb.feature] = true; });
              _.each(this.mapComp.mapComposition.nmez_xx.zonaB, function (bb: any) { nacZonaBObj[bb.feature] = true; });
              _.each(this.mapComp.mapComposition.nmez_xx.zonaC, function (bb: any) { nacZonaCObj[bb.feature] = true; });
              _.each(this.mapComp.mapComposition.nmez_xx.zonaD, function (bb: any) { nacZonaDObj[bb.feature] = true; });
              _.each(this.mapComp.mapComposition.nmez_xx.zonaE, function (bb: any) { nacZonaEObj[bb.feature] = true; });

              const nacZonaA = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacZonaAObj[myval.lugar_nacimiento] &&
                  myval.sexo === 'F' &&
                  myval.ni_fall === 'Nacional' &&
                  myval.lugar_muerte !== myval.lugar_nacimiento;
              }, this.mapComp.mapComposition.nmez_xx.zonaA).length;
              const nacZonaB = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacZonaBObj[myval.lugar_nacimiento] &&
                  myval.sexo === 'F' &&
                  myval.ni_fall === 'Nacional' &&
                  myval.lugar_muerte !== myval.lugar_nacimiento;
              }, this.mapComp.mapComposition.nmez_xx.zonaB).length;
              const nacZonaC = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacZonaCObj[myval.lugar_nacimiento] &&
                  myval.sexo === 'F' &&
                  myval.ni_fall === 'Nacional' &&
                  myval.lugar_muerte !== myval.lugar_nacimiento;
              }, this.mapComp.mapComposition.nmez_xx.zonaC).length;
              const nacZonaD = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacZonaDObj[myval.lugar_nacimiento] &&
                  myval.sexo === 'F' &&
                  myval.ni_fall === 'Nacional' &&
                  myval.lugar_muerte !== myval.lugar_nacimiento;
              }, this.mapComp.mapComposition.nmez_xx.zonaD).length;
              const nacZonaE = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacZonaEObj[myval.lugar_nacimiento] &&
                  myval.sexo === 'F' &&
                  myval.ni_fall === 'Nacional' &&
                  myval.lugar_muerte !== myval.lugar_nacimiento;
              }, this.mapComp.mapComposition.nmez_xx.zonaE).length;

              this.nacZoneArr.push(nacZonaA);
              this.nacZoneArr.push(nacZonaB);
              this.nacZoneArr.push(nacZonaC);
              this.nacZoneArr.push(nacZonaD);
              this.nacZoneArr.push(nacZonaE);

              const getPieLabels = _.keys(this.mapComp.mapComposition.nmez_xx);
              getPieLabels.forEach(element => {
                this.pieZoneChartLabels.push(element);
              });

              const getColors: string[] = ['#F26D78', '#F2DB94', '#F2E9BD', '#9EBF95', '#435951'];
              getColors.forEach(color => { this.colorZoneArr.push(color); });

              this.pieZoneChartData = this.nacZoneArr;
              this.colorZoneArr = [];
              break;
            }
            case 'nmiz_xix': {

              _.each(this.mapComp.mapComposition.nmiz_xix.zonaA, function (bb: any) { nacZonaAObj[bb.feature] = true; });
              _.each(this.mapComp.mapComposition.nmiz_xix.zonaB, function (bb: any) { nacZonaBObj[bb.feature] = true; });
              _.each(this.mapComp.mapComposition.nmiz_xix.zonaC, function (bb: any) { nacZonaCObj[bb.feature] = true; });
              _.each(this.mapComp.mapComposition.nmiz_xix.zonaD, function (bb: any) { nacZonaDObj[bb.feature] = true; });
              _.each(this.mapComp.mapComposition.nmiz_xix.zonaE, function (bb: any) { nacZonaEObj[bb.feature] = true; });

              const nacZonaA = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacZonaAObj[myval.lugar_muerte] &&
                  myval.sexo === 'F' &&
                  myval.ano_nacimiento < 1900 &&
                  myval.ni_nac === 'Nacional' &&
                  myval.lugar_muerte !== myval.lugar_nacimiento;
              }, this.mapComp.mapComposition.nmiz_xix.zonaA).length;
              const nacZonaB = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacZonaBObj[myval.lugar_muerte] &&
                  myval.sexo === 'F' &&
                  myval.ano_nacimiento < 1900 &&
                  myval.ni_nac === 'Nacional' &&
                  myval.lugar_muerte !== myval.lugar_nacimiento;
              }, this.mapComp.mapComposition.nmiz_xix.zonaB).length;
              const nacZonaC = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacZonaCObj[myval.lugar_muerte] &&
                  myval.sexo === 'F' &&
                  myval.ano_nacimiento < 1900 &&
                  myval.ni_nac === 'Nacional' &&
                  myval.lugar_muerte !== myval.lugar_nacimiento;
              }, this.mapComp.mapComposition.nmiz_xix.zonaC).length;
              const nacZonaD = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacZonaDObj[myval.lugar_muerte] &&
                  myval.sexo === 'F' &&
                  myval.ano_nacimiento < 1900 &&
                  myval.ni_nac === 'Nacional' &&
                  myval.lugar_muerte !== myval.lugar_nacimiento;
              }, this.mapComp.mapComposition.nmiz_xix.zonaD).length;
              const nacZonaE = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacZonaEObj[myval.lugar_muerte] &&
                  myval.sexo === 'F' &&
                  myval.ano_nacimiento < 1900 &&
                  myval.ni_nac === 'Nacional' &&
                  myval.lugar_muerte !== myval.lugar_nacimiento;
              }, this.mapComp.mapComposition.nmiz_xix.zonaE).length;

              this.nacZoneArr.push(nacZonaA);
              this.nacZoneArr.push(nacZonaB);
              this.nacZoneArr.push(nacZonaC);
              this.nacZoneArr.push(nacZonaD);
              this.nacZoneArr.push(nacZonaE);

              const getPieLabels = _.keys(this.mapComp.mapComposition.nmiz_xix);
              getPieLabels.forEach(element => {
                this.pieZoneChartLabels.push(element);
              });

              const getColors: string[] = ['#F26D78', '#F2DB94', '#F2E9BD', '#9EBF95', '#435951'];
              getColors.forEach(color => { this.colorZoneArr.push(color); });

              this.pieZoneChartData = this.nacZoneArr;
              this.colorZoneArr = [];
              break;
            }
            case 'nmiz_xx': {

              _.each(this.mapComp.mapComposition.nmiz_xx.zonaA, function (bb: any) { nacZonaAObj[bb.feature] = true; });
              _.each(this.mapComp.mapComposition.nmiz_xx.zonaB, function (bb: any) { nacZonaBObj[bb.feature] = true; });
              _.each(this.mapComp.mapComposition.nmiz_xx.zonaC, function (bb: any) { nacZonaCObj[bb.feature] = true; });
              _.each(this.mapComp.mapComposition.nmiz_xx.zonaD, function (bb: any) { nacZonaDObj[bb.feature] = true; });
              _.each(this.mapComp.mapComposition.nmiz_xx.zonaE, function (bb: any) { nacZonaEObj[bb.feature] = true; });

              const nacZonaA = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacZonaAObj[myval.lugar_muerte] &&
                  myval.sexo === 'F' &&
                  myval.ni_nac === 'Nacional' &&
                  myval.lugar_muerte !== myval.lugar_nacimiento;
              }, this.mapComp.mapComposition.nmiz_xx.zonaA).length;
              const nacZonaB = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacZonaBObj[myval.lugar_muerte] &&
                  myval.sexo === 'F' &&
                  myval.ni_nac === 'Nacional' &&
                  myval.lugar_muerte !== myval.lugar_nacimiento;
              }, this.mapComp.mapComposition.nmiz_xx.zonaB).length;
              const nacZonaC = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacZonaCObj[myval.lugar_muerte] &&
                  myval.sexo === 'F' &&
                  myval.ni_nac === 'Nacional' &&
                  myval.lugar_muerte !== myval.lugar_nacimiento;
              }, this.mapComp.mapComposition.nmiz_xx.zonaC).length;
              const nacZonaD = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacZonaDObj[myval.lugar_muerte] &&
                  myval.sexo === 'F' &&
                  myval.ni_nac === 'Nacional' &&
                  myval.lugar_muerte !== myval.lugar_nacimiento;
              }, this.mapComp.mapComposition.nmiz_xx.zonaD).length;
              const nacZonaE = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacZonaEObj[myval.lugar_muerte] &&
                  myval.sexo === 'F' &&
                  myval.ni_nac === 'Nacional' &&
                  myval.lugar_muerte !== myval.lugar_nacimiento;
              }, this.mapComp.mapComposition.nmiz_xx.zonaE).length;

              this.nacZoneArr.push(nacZonaA);
              this.nacZoneArr.push(nacZonaB);
              this.nacZoneArr.push(nacZonaC);
              this.nacZoneArr.push(nacZonaD);
              this.nacZoneArr.push(nacZonaE);

              const getPieLabels = _.keys(this.mapComp.mapComposition.nmiz_xx);
              getPieLabels.forEach(element => {
                this.pieZoneChartLabels.push(element);
              });

              const getColors: string[] = ['#F26D78', '#F2DB94', '#F2E9BD', '#9EBF95', '#435951'];
              getColors.forEach(color => { this.colorZoneArr.push(color); });

              this.pieZoneChartData = this.nacZoneArr;

              this.colorZoneArr = [];

              break;
            }
          } // end switch for mapType == 1
        } else if (data.mapType === 2) {

          this.zoneChart = false;
          this.rdChart = false;
          this.contChart = false;
          this.raChart = true;

          this.nacRaArr = [];
          this.pieRaChartLabels = [];

          _.each(this.mapComp.mapComposition.nra.Norte, function (bb: any) { nacNorteObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.nra.Bajio, function (bb: any) { nacBajioObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.nra.Centro, function (bb: any) { nacCentroObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.nra.Sur, function (bb: any) { nacSurObj[bb.feature] = true; });

          switch (data.graphType) {
            case 'ngdra_xix': {

              const nacNorte = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacNorteObj[myval.region_Amplia_Nac] && myval.ano_nacimiento < 1900;
              }, this.mapComp.mapComposition.nra.Norte).length;

              const nacBajio = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacBajioObj[myval.region_Amplia_Nac] && myval.ano_nacimiento < 1900;
              }, this.mapComp.mapComposition.nra.Bajio).length;

              const nacCentro = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacCentroObj[myval.region_Amplia_Nac] && myval.ano_nacimiento < 1900;
              }, this.mapComp.mapComposition.nra.Centro).length;

              const nacSur = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacSurObj[myval.region_Amplia_Nac] && myval.ano_nacimiento < 1900;
              }, this.mapComp.mapComposition.nra.Sur).length;

              this.nacRaArr.push(nacNorte);
              this.nacRaArr.push(nacBajio);
              this.nacRaArr.push(nacCentro);
              this.nacRaArr.push(nacSur);

              const getPieLabels = _.keys(this.mapComp.mapComposition.nra);
              getPieLabels.forEach(element => {
                this.pieRaChartLabels.push(element);
              });

              const getColors: string[] = ['#D9923B', '#BF622C', '#8C3737', '#D9BA82'];
              getColors.forEach(color => { this.colorRaArr.push(color); });

              this.pieRaChartData = this.nacRaArr;
              this.colorRaArr = [];

              break;
            }
            case 'ngdra_xx': {
              // // this.nacRaArr = [];
              const nacNorte = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacNorteObj[myval.region_Amplia_Nac];
              }, this.mapComp.mapComposition.nra.Norte).length;

              const nacBajio = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacBajioObj[myval.region_Amplia_Nac];
              }, this.mapComp.mapComposition.nra.Bajio).length;

              const nacCentro = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacCentroObj[myval.region_Amplia_Nac];
              }, this.mapComp.mapComposition.nra.Centro).length;

              const nacSur = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacSurObj[myval.region_Amplia_Nac];
              }, this.mapComp.mapComposition.nra.Sur).length;

              this.nacRaArr.push(nacNorte);
              this.nacRaArr.push(nacBajio);
              this.nacRaArr.push(nacCentro);
              this.nacRaArr.push(nacSur);

              const getPieLabels = _.keys(this.mapComp.mapComposition.nra);
              getPieLabels.forEach(element => {
                this.pieRaChartLabels.push(element);
              });

              const getColors: string[] = ['#D9923B', '#BF622C', '#8C3737', '#D9BA82'];
              getColors.forEach(color => { this.colorRaArr.push(color); });

              this.pieRaChartData = this.nacRaArr;
              this.colorRaArr = [];
              break;
            }
            case 'ngera_xix': {

              const nacNorte = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacNorteObj[myval.region_Amplia_Nac] &&
                  myval.ano_nacimiento < 1900 &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_fall === 'Nacional';
              }, this.mapComp.mapComposition.nra.Norte).length;

              const nacBajio = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacBajioObj[myval.region_Amplia_Nac] &&
                  myval.ano_nacimiento < 1900 &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_fall === 'Nacional';


              }, this.mapComp.mapComposition.nra.Bajio).length;

              const nacCentro = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacCentroObj[myval.region_Amplia_Nac] &&
                  myval.ano_nacimiento < 1900 &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_fall === 'Nacional';

              }, this.mapComp.mapComposition.nra.Centro).length;

              const nacSur = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacSurObj[myval.region_Amplia_Nac] &&
                  myval.ano_nacimiento < 1900 &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_fall === 'Nacional';
              }, this.mapComp.mapComposition.nra.Sur).length;

              this.nacRaArr.push(nacNorte);
              this.nacRaArr.push(nacBajio);
              this.nacRaArr.push(nacCentro);
              this.nacRaArr.push(nacSur);

              const getPieLabels = _.keys(this.mapComp.mapComposition.nra);
              getPieLabels.forEach(element => {
                this.pieRaChartLabels.push(element);
              });

              const getColors: string[] = ['#D9923B', '#BF622C', '#8C3737', '#D9BA82'];
              getColors.forEach(color => { this.colorRaArr.push(color); });

              this.pieRaChartData = this.nacRaArr;
              this.colorRaArr = [];
              break;
            }
            case 'ngera_xx': {

              const nacNorte = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacNorteObj[myval.region_Amplia_Nac] &&
                  myval.ni_fall === 'Nacional' &&
                  myval.lugar_nacimiento !== myval.lugar_muerte;
              }, this.mapComp.mapComposition.nra.Norte).length;

              const nacBajio = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacBajioObj[myval.region_Amplia_Nac] &&
                  myval.ni_fall === 'Nacional' &&
                  myval.lugar_nacimiento !== myval.lugar_muerte;
              }, this.mapComp.mapComposition.nra.Bajio).length;

              const nacCentro = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacCentroObj[myval.region_Amplia_Nac] &&
                  myval.ni_fall === 'Nacional' &&
                  myval.lugar_nacimiento !== myval.lugar_muerte;
              }, this.mapComp.mapComposition.nra.Centro).length;

              const nacSur = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacSurObj[myval.region_Amplia_Nac] &&
                  myval.ni_fall === 'Nacional' &&
                  myval.lugar_nacimiento !== myval.lugar_muerte;
              }, this.mapComp.mapComposition.nra.Sur).length;

              this.nacRaArr.push(nacNorte);
              this.nacRaArr.push(nacBajio);
              this.nacRaArr.push(nacCentro);
              this.nacRaArr.push(nacSur);

              const getPieLabels = _.keys(this.mapComp.mapComposition.nra);
              getPieLabels.forEach(element => {
                this.pieRaChartLabels.push(element);
              });

              const getColors: string[] = ['#D9923B', '#BF622C', '#8C3737', '#D9BA82'];
              getColors.forEach(color => { this.colorRaArr.push(color); });

              this.pieRaChartData = this.nacRaArr;
              this.colorRaArr = [];

              break;
            }
            case 'ngira_xix': {

              const nacNorte = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacNorteObj[myval.region_Amplia_Fall] &&
                  myval.ano_nacimiento < 1900 &&
                  myval.ni_nac === 'Nacional' &&
                  myval.lugar_muerte !== myval.lugar_nacimiento;
              }, this.mapComp.mapComposition.nra.Norte).length;
              const nacBajio = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacBajioObj[myval.region_Amplia_Fall] &&
                  myval.ano_nacimiento < 1900 &&
                  myval.ni_nac === 'Nacional' &&
                  myval.lugar_muerte !== myval.lugar_nacimiento;
              }, this.mapComp.mapComposition.nra.Bajio).length;
              const nacCentro = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacCentroObj[myval.region_Amplia_Fall] &&
                  myval.ano_nacimiento < 1900 &&
                  myval.ni_nac === 'Nacional' &&
                  myval.lugar_muerte !== myval.lugar_nacimiento;
              }, this.mapComp.mapComposition.nra.Centro).length;
              const nacSur = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacSurObj[myval.region_Amplia_Fall] &&
                  myval.ano_nacimiento < 1900 &&
                  myval.ni_nac === 'Nacional' &&
                  myval.lugar_muerte !== myval.lugar_nacimiento;
              }, this.mapComp.mapComposition.nra.Sur).length;

              this.nacRaArr.push(nacNorte);
              this.nacRaArr.push(nacBajio);
              this.nacRaArr.push(nacCentro);
              this.nacRaArr.push(nacSur);

              const getPieLabels = _.keys(this.mapComp.mapComposition.nra);
              getPieLabels.forEach(element => {
                this.pieRaChartLabels.push(element);
              });

              const getColors: string[] = ['#D9923B', '#BF622C', '#8C3737', '#D9BA82'];
              getColors.forEach(color => { this.colorRaArr.push(color); });

              this.pieRaChartData = this.nacRaArr;
              this.colorRaArr = [];
              break;
            }
            case 'ngira_xx': {

              const nacNorte = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacNorteObj[myval.region_Amplia_Fall] &&
                  myval.ni_nac === 'Nacional' &&
                  myval.lugar_muerte !== myval.lugar_nacimiento;
              }, this.mapComp.mapComposition.nra.Norte).length;
              const nacBajio = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacBajioObj[myval.region_Amplia_Fall] &&
                  myval.ni_nac === 'Nacional' &&
                  myval.lugar_muerte !== myval.lugar_nacimiento;
              }, this.mapComp.mapComposition.nra.Bajio).length;
              const nacCentro = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacCentroObj[myval.region_Amplia_Fall] &&
                  myval.ni_nac === 'Nacional' &&
                  myval.lugar_muerte !== myval.lugar_nacimiento;
              }, this.mapComp.mapComposition.nra.Centro).length;
              const nacSur = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacSurObj[myval.region_Amplia_Fall] &&
                  myval.ni_nac === 'Nacional' &&
                  myval.lugar_muerte !== myval.lugar_nacimiento;
              }, this.mapComp.mapComposition.nra.Sur).length;

              this.nacRaArr.push(nacNorte);
              this.nacRaArr.push(nacBajio);
              this.nacRaArr.push(nacCentro);
              this.nacRaArr.push(nacSur);

              const getPieLabels = _.keys(this.mapComp.mapComposition.nra);
              getPieLabels.forEach(element => {
                this.pieRaChartLabels.push(element);
              });

              const getColors: string[] = ['#D9923B', '#BF622C', '#8C3737', '#D9BA82'];
              getColors.forEach(color => { this.colorRaArr.push(color); });
              this.pieRaChartData = this.nacRaArr;
              this.colorRaArr = [];
              break;
            }
            case 'nmdra_xix': {
              this.proofVal = null;

              const nacNorte = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacNorteObj[myval.region_Amplia_Nac]
                  && myval.ano_nacimiento < 1900
                  && myval.sexo === 'F';
              }, this.mapComp.mapComposition.nra.Norte).length;

              const nacBajio = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacBajioObj[myval.region_Amplia_Nac]
                  && myval.ano_nacimiento < 1900
                  && myval.sexo === 'F';
              }, this.mapComp.mapComposition.nra.Bajio).length;

              const nacCentro = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacCentroObj[myval.region_Amplia_Nac]
                  && myval.ano_nacimiento < 1900
                  && myval.sexo === 'F';
              }, this.mapComp.mapComposition.nra.Centro).length;

              const nacSur = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacSurObj[myval.region_Amplia_Nac]
                  && myval.ano_nacimiento < 1900
                  && myval.sexo === 'F';
              }, this.mapComp.mapComposition.nra.Sur).length;

              this.nacRaArr.push(nacNorte);
              this.nacRaArr.push(nacBajio);
              this.nacRaArr.push(nacCentro);
              this.nacRaArr.push(nacSur);

              const getPieLabels = _.keys(this.mapComp.mapComposition.nra);
              getPieLabels.forEach(element => {
                this.pieRaChartLabels.push(element);
              });

              const getColors: string[] = ['#D9923B', '#BF622C', '#8C3737', '#D9BA82'];
              getColors.forEach(color => { this.colorRaArr.push(color); });

              this.pieRaChartData = this.nacRaArr;
              this.colorRaArr = [];
              break;
            }
            case 'nmdra_xx': {
              this.proofVal = null;

              // // this.nacRaArr = [];

              const nacNorte = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacNorteObj[myval.region_Amplia_Nac]
                  && myval.sexo === 'F';
              }, this.mapComp.mapComposition.nra.Norte).length;

              const nacBajio = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacBajioObj[myval.region_Amplia_Nac]
                  && myval.sexo === 'F';
              }, this.mapComp.mapComposition.nra.Bajio).length;

              const nacCentro = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacCentroObj[myval.region_Amplia_Nac]
                  && myval.sexo === 'F';
              }, this.mapComp.mapComposition.nra.Centro).length;

              const nacSur = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacSurObj[myval.region_Amplia_Nac]
                  && myval.sexo === 'F';
              }, this.mapComp.mapComposition.nra.Sur).length;

              this.nacRaArr.push(nacNorte);
              this.nacRaArr.push(nacBajio);
              this.nacRaArr.push(nacCentro);
              this.nacRaArr.push(nacSur);

              const getPieLabels = _.keys(this.mapComp.mapComposition.nra);
              getPieLabels.forEach(element => {
                this.pieRaChartLabels.push(element);
              });

              const getColors: string[] = ['#D9923B', '#BF622C', '#8C3737', '#D9BA82'];
              getColors.forEach(color => { this.colorRaArr.push(color); });
              this.pieRaChartData = this.nacRaArr;
              this.colorRaArr = [];
              break;
            }
            case 'nmera_xix': {

              const nacNorte = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacNorteObj[myval.region_Amplia_Nac] &&
                  myval.ano_nacimiento < 1900 &&
                  myval.sexo === 'F' &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_fall === 'Nacional';
              }, this.mapComp.mapComposition.nra.Norte).length;

              const nacBajio = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacBajioObj[myval.region_Amplia_Nac] &&
                  myval.ano_nacimiento < 1900 &&
                  myval.sexo === 'F' &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_fall === 'Nacional';
              }, this.mapComp.mapComposition.nra.Bajio).length;

              const nacCentro = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacCentroObj[myval.region_Amplia_Nac] &&
                  myval.ano_nacimiento < 1900 &&
                  myval.sexo === 'F' &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_fall === 'Nacional';
              }, this.mapComp.mapComposition.nra.Centro).length;

              const nacSur = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacSurObj[myval.region_Amplia_Nac] &&
                  myval.ano_nacimiento < 1900 &&
                  myval.sexo === 'F' &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_fall === 'Nacional';
              }, this.mapComp.mapComposition.nra.Sur).length;

              this.nacRaArr.push(nacNorte);
              this.nacRaArr.push(nacBajio);
              this.nacRaArr.push(nacCentro);
              this.nacRaArr.push(nacSur);

              const getPieLabels = _.keys(this.mapComp.mapComposition.nra);
              getPieLabels.forEach(element => {
                this.pieRaChartLabels.push(element);
              });

              const getColors: string[] = ['#D9923B', '#BF622C', '#8C3737', '#D9BA82'];
              getColors.forEach(color => { this.colorRaArr.push(color); });

              this.pieRaChartData = this.nacRaArr;
              break;
            }
            case 'nmera_xx': {
              const nacNorte = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacNorteObj[myval.region_Amplia_Nac] &&
                  myval.sexo === 'F' &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_fall === 'Nacional';
              }, this.mapComp.mapComposition.nra.Norte).length;

              const nacBajio = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacBajioObj[myval.region_Amplia_Nac] &&
                  myval.sexo === 'F' &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_fall === 'Nacional';
              }, this.mapComp.mapComposition.nra.Bajio).length;

              const nacCentro = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacCentroObj[myval.region_Amplia_Nac] &&
                  myval.sexo === 'F' &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_fall === 'Nacional';
              }, this.mapComp.mapComposition.nra.Centro).length;

              const nacSur = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacSurObj[myval.region_Amplia_Nac] &&
                  myval.sexo === 'F' &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_fall === 'Nacional';
              }, this.mapComp.mapComposition.nra.Sur).length;

              this.nacRaArr.push(nacNorte);
              this.nacRaArr.push(nacBajio);
              this.nacRaArr.push(nacCentro);
              this.nacRaArr.push(nacSur);

              const getPieLabels = _.keys(this.mapComp.mapComposition.nra);
              getPieLabels.forEach(element => {
                this.pieRaChartLabels.push(element);
              });

              const getColors: string[] = ['#D9923B', '#BF622C', '#8C3737', '#D9BA82'];
              getColors.forEach(color => { this.colorRaArr.push(color); });

              this.pieRaChartData = this.nacRaArr;
              break;
            }
            case 'nmira_xix': {
              const nacNorte = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacNorteObj[myval.region_Amplia_Fall] &&
                  myval.sexo === 'F' &&
                  myval.ano_nacimiento < 1900 &&
                  myval.ni_nac === 'Nacional' &&
                  myval.lugar_muerte !== myval.lugar_nacimiento;
              }, this.mapComp.mapComposition.nra.Norte).length;
              const nacBajio = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacBajioObj[myval.region_Amplia_Fall] &&
                  myval.sexo === 'F' &&
                  myval.ano_nacimiento < 1900 &&
                  myval.ni_nac === 'Nacional' &&
                  myval.lugar_muerte !== myval.lugar_nacimiento;
              }, this.mapComp.mapComposition.nra.Bajio).length;
              const nacCentro = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacCentroObj[myval.region_Amplia_Fall] &&
                  myval.sexo === 'F' &&
                  myval.ano_nacimiento < 1900 &&
                  myval.ni_nac === 'Nacional' &&
                  myval.lugar_muerte !== myval.lugar_nacimiento;
              }, this.mapComp.mapComposition.nra.Centro).length;
              const nacSur = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacSurObj[myval.region_Amplia_Fall] &&
                  myval.sexo === 'F' &&
                  myval.ano_nacimiento < 1900 &&
                  myval.ni_nac === 'Nacional' &&
                  myval.lugar_muerte !== myval.lugar_nacimiento;
              }, this.mapComp.mapComposition.nra.Sur).length;

              this.nacRaArr.push(nacNorte);
              this.nacRaArr.push(nacBajio);
              this.nacRaArr.push(nacCentro);
              this.nacRaArr.push(nacSur);

              const getPieLabels = _.keys(this.mapComp.mapComposition.nra);
              getPieLabels.forEach(element => {
                this.pieRaChartLabels.push(element);
              });

              const getColors: string[] = ['#D9923B', '#BF622C', '#8C3737', '#D9BA82'];
              getColors.forEach(color => { this.colorRaArr.push(color); });

              this.pieRaChartData = this.nacRaArr;
              this.colorRaArr = [];
              break;
            }
            case 'nmira_xx': {
              const nacNorte = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacNorteObj[myval.region_Amplia_Fall] &&
                  myval.sexo === 'F' &&
                  myval.ni_nac === 'Nacional' &&
                  myval.lugar_muerte !== myval.lugar_nacimiento;
              }, this.mapComp.mapComposition.nra.Norte).length;
              const nacBajio = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacBajioObj[myval.region_Amplia_Fall] &&
                  myval.sexo === 'F' &&
                  myval.ni_nac === 'Nacional' &&
                  myval.lugar_muerte !== myval.lugar_nacimiento;
              }, this.mapComp.mapComposition.nra.Bajio).length;
              const nacCentro = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacCentroObj[myval.region_Amplia_Fall] &&
                  myval.sexo === 'F' &&
                  myval.ni_nac === 'Nacional' &&
                  myval.lugar_muerte !== myval.lugar_nacimiento;
              }, this.mapComp.mapComposition.nra.Centro).length;
              const nacSur = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacSurObj[myval.region_Amplia_Fall] &&
                  myval.sexo === 'F' &&
                  myval.ni_nac === 'Nacional' &&
                  myval.lugar_muerte !== myval.lugar_nacimiento;
              }, this.mapComp.mapComposition.nra.Sur).length;

              this.nacRaArr.push(nacNorte);
              this.nacRaArr.push(nacBajio);
              this.nacRaArr.push(nacCentro);
              this.nacRaArr.push(nacSur);

              const getPieLabels = _.keys(this.mapComp.mapComposition.nra);
              getPieLabels.forEach(element => {
                this.pieRaChartLabels.push(element);
              });

              const getColors: string[] = ['#D9923B', '#BF622C', '#8C3737', '#D9BA82'];
              getColors.forEach(color => { this.colorRaArr.push(color); });

              this.pieRaChartData = this.nacRaArr;
              console.log(this.pieRaChartData);

              this.colorRaArr = [];
              break;
            }

          }
        } else if (data.mapType === 3) {
          console.log('MapType: 3');

          this.raChart = false;
          this.zoneChart = false;
          this.contChart = false;
          this.rdChart = true;

          this.nacRdArr = [];
          this.pieRdChartLabels = [];

          _.each(this.mapComp.mapComposition.nrd.Baja_California, function (bb: any) { nacRdBc[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.nrd.Noroeste, function (bb: any) { nacRdNo[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.nrd.Sector_Central_del_Norte, function (bb: any) { nacRdScN[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.nrd.Noreste, function (bb: any) { nacRdNe[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.nrd.Vertiente_del_Golfo, function (bb: any) { nacRdVg[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.nrd.Mexico_Central, function (bb: any) { nacRdMc[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.nrd.Vertiente_del_Pacifico, function (bb: any) { nacRdVp[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.nrd.Cadena_Caribena, function (bb: any) { nacRdCa[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.nrd.Cadena_Centroamericana, function (bb: any) { nacRdCe[bb.feature] = true; });

          switch (data.graphType) {
            case 'ngdrd_xix': {

              const nacBc = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdBc[myval.region_Detallada_Nac] && myval.ano_nacimiento < 1900;
              }, this.mapComp.mapComposition.nrd.Baja_California).length;

              const nacNo = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdNo[myval.region_Detallada_Nac] && myval.ano_nacimiento < 1900;
              }, this.mapComp.mapComposition.nrd.Noroeste).length;

              const nacScN = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdScN[myval.region_Detallada_Nac] && myval.ano_nacimiento < 1900;
              }, this.mapComp.mapComposition.nrd.Sector_Central_del_Norte).length;

              const nacNe = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdNe[myval.region_Detallada_Nac] && myval.ano_nacimiento < 1900;
              }, this.mapComp.mapComposition.nrd.Noreste).length;

              const nacVg = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdVg[myval.region_Detallada_Nac] && myval.ano_nacimiento < 1900;
              }, this.mapComp.mapComposition.nrd.Vertiente_del_Golfo).length;

              const nacMc = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdMc[myval.region_Detallada_Nac] && myval.ano_nacimiento < 1900;
              }, this.mapComp.mapComposition.nrd.Mexico_Central).length;

              const nacVp = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdVp[myval.region_Detallada_Nac] && myval.ano_nacimiento < 1900;
              }, this.mapComp.mapComposition.nrd.Vertiente_del_Pacifico).length;

              const nacCa = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdCa[myval.region_Detallada_Nac] && myval.ano_nacimiento < 1900;
              }, this.mapComp.mapComposition.nrd.Cadena_Caribena).length;

              const nacCe = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdCe[myval.region_Detallada_Nac] && myval.ano_nacimiento < 1900;
              }, this.mapComp.mapComposition.nrd.Cadena_Centroamericana).length;

              this.nacRdArr.push(nacBc);
              this.nacRdArr.push(nacNo);
              this.nacRdArr.push(nacScN);
              this.nacRdArr.push(nacNe);
              this.nacRdArr.push(nacVg);
              this.nacRdArr.push(nacMc);
              this.nacRdArr.push(nacVp);
              this.nacRdArr.push(nacCa);
              this.nacRdArr.push(nacCe);

              const getPieLabels = _.keys(this.mapComp.mapComposition.nrd);
              getPieLabels.forEach(element => {
                this.pieRdChartLabels.push(element);
              });

              console.log(getPieLabels);
              console.log(this.pieRdChartLabels);


              const getColors: string[] = ['#4575B4',
                '#92C5DE',
                '#F4A582',
                '#D1E5F0',
                '#F7F7F7',
                '#B2182B',
                '#D6604D',
                '#FDDBC7',
                '#74ADD1'];
              getColors.forEach(color => { this.colorRdArr.push(color); });
              this.pieRdChartData = this.nacRdArr;
              this.colorRdArr = [];
              break;
            }
            case 'ngdrd_xx': {

              this.proofVal = null;
              const nacBc = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdBc[myval.region_Detallada_Nac];
              }, this.mapComp.mapComposition.nrd.Baja_California).length;

              const nacNo = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdNo[myval.region_Detallada_Nac];
              }, this.mapComp.mapComposition.nrd.Noroeste).length;

              const nacScN = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdScN[myval.region_Detallada_Nac];
              }, this.mapComp.mapComposition.nrd.Sector_Central_del_Norte).length;

              const nacNe = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdNe[myval.region_Detallada_Nac];
              }, this.mapComp.mapComposition.nrd.Noreste).length;

              const nacVg = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdVg[myval.region_Detallada_Nac];
              }, this.mapComp.mapComposition.nrd.Vertiente_del_Golfo).length;

              const nacMc = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdMc[myval.region_Detallada_Nac];
              }, this.mapComp.mapComposition.nrd.Mexico_Central).length;

              const nacVp = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdVp[myval.region_Detallada_Nac];
              }, this.mapComp.mapComposition.nrd.Vertiente_del_Pacifico).length;


              const nacCa = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdCa[myval.region_Detallada_Nac];
              }, this.mapComp.mapComposition.nrd.Cadena_Caribena).length;

              const nacCe = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdCe[myval.region_Detallada_Nac];
              }, this.mapComp.mapComposition.nrd.Cadena_Centroamericana).length;

              this.nacRdArr.push(nacBc);
              this.nacRdArr.push(nacNo);
              this.nacRdArr.push(nacScN);
              this.nacRdArr.push(nacNe);
              this.nacRdArr.push(nacVg);
              this.nacRdArr.push(nacMc);
              this.nacRdArr.push(nacVp);
              this.nacRdArr.push(nacCa);
              this.nacRdArr.push(nacCe);

              const getPieLabels = _.keys(this.mapComp.mapComposition.nrd);
              getPieLabels.forEach(element => {
                this.pieRdChartLabels.push(element);
              });

              const getColors: string[] = ['#4575B4',
                '#92C5DE',
                '#F4A582',
                '#D1E5F0',
                '#F7F7F7',
                '#B2182B',
                '#D6604D',
                '#FDDBC7',
                '#74ADD1'];
              getColors.forEach(color => { this.colorRdArr.push(color); });

              this.pieRdChartData = this.nacRdArr;
              this.colorRdArr = [];
              break;
            }
            case 'ngerd_xix': {

              const nacBc = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdBc[myval.region_Detallada_Nac] &&
                  myval.ano_nacimiento < 1900 &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_fall === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Baja_California).length;

              const nacNo = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdNo[myval.region_Detallada_Nac] &&
                  myval.ano_nacimiento < 1900 &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_fall === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Noroeste).length;

              const nacScN = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdScN[myval.region_Detallada_Nac] &&
                  myval.ano_nacimiento < 1900 &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_fall === 'Nacional';

              }, this.mapComp.mapComposition.nrd.Sector_Central_del_Norte).length;

              const nacNe = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdNe[myval.region_Detallada_Nac] &&
                  myval.ano_nacimiento < 1900 &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_fall === 'Nacional';

              }, this.mapComp.mapComposition.nrd.Noreste).length;

              const nacVg = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdVg[myval.region_Detallada_Nac] &&
                  myval.ano_nacimiento < 1900 &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_fall === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Vertiente_del_Golfo).length;

              const nacMc = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdMc[myval.region_Detallada_Nac] &&
                  myval.ano_nacimiento < 1900 &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_fall === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Mexico_Central).length;

              const nacVp = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdVp[myval.region_Detallada_Nac] &&
                  myval.ano_nacimiento < 1900 &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_fall === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Vertiente_del_Pacifico).length;

              const nacCa = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdCa[myval.region_Detallada_Nac] &&
                  myval.ano_nacimiento < 1900 &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_fall === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Cadena_Caribena).length;

              const nacCe = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdCe[myval.region_Detallada_Nac] &&
                  myval.ano_nacimiento < 1900 &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_fall === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Cadena_Centroamericana).length;

              this.nacRdArr.push(nacBc);
              this.nacRdArr.push(nacNo);
              this.nacRdArr.push(nacScN);
              this.nacRdArr.push(nacNe);
              this.nacRdArr.push(nacVg);
              this.nacRdArr.push(nacMc);
              this.nacRdArr.push(nacVp);
              this.nacRdArr.push(nacCa);
              this.nacRdArr.push(nacCe);

              const getPieLabels = _.keys(this.mapComp.mapComposition.nrd);
              getPieLabels.forEach(element => {
                this.pieRdChartLabels.push(element);
              });

              const getColors: string[] = ['#4575B4',
                '#92C5DE',
                '#F4A582',
                '#D1E5F0',
                '#F7F7F7',
                '#B2182B',
                '#D6604D',
                '#FDDBC7',
                '#74ADD1'];
              getColors.forEach(color => { this.colorRdArr.push(color); });

              this.pieRdChartData = this.nacRdArr;
              this.colorRdArr = [];
              break;
            }
            case 'ngerd_xx': {

              const nacBc = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdBc[myval.region_Detallada_Nac] &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_fall === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Baja_California).length;

              const nacNo = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdNo[myval.region_Detallada_Nac] &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_fall === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Noroeste).length;

              const nacScN = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdScN[myval.region_Detallada_Nac] &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_fall === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Sector_Central_del_Norte).length;

              const nacNe = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdNe[myval.region_Detallada_Nac] &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_fall === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Noreste).length;

              const nacVg = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdVg[myval.region_Detallada_Nac] &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_fall === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Vertiente_del_Golfo).length;

              const nacMc = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdMc[myval.region_Detallada_Nac] &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_fall === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Mexico_Central).length;

              const nacVp = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdVp[myval.region_Detallada_Nac] &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_fall === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Vertiente_del_Pacifico).length;

              const nacCa = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdCa[myval.region_Detallada_Nac] &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_fall === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Cadena_Caribena).length;

              const nacCe = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdCe[myval.region_Detallada_Nac] &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_fall === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Cadena_Centroamericana).length;

              this.nacRdArr.push(nacBc);
              this.nacRdArr.push(nacNo);
              this.nacRdArr.push(nacScN);
              this.nacRdArr.push(nacNe);
              this.nacRdArr.push(nacVg);
              this.nacRdArr.push(nacMc);
              this.nacRdArr.push(nacVp);
              this.nacRdArr.push(nacCa);
              this.nacRdArr.push(nacCe);

              const getPieLabels = _.keys(this.mapComp.mapComposition.nrd);
              getPieLabels.forEach(element => {
                this.pieRdChartLabels.push(element);
              });

              const getColors: string[] = ['#4575B4',
                '#92C5DE',
                '#F4A582',
                '#D1E5F0',
                '#F7F7F7',
                '#B2182B',
                '#D6604D',
                '#FDDBC7',
                '#74ADD1'];
              getColors.forEach(color => { this.colorRdArr.push(color); });


              this.pieRdChartData = this.nacRdArr;
              this.colorRdArr = [];
              break;
            }
            case 'ngird_xix': {

              const nacBc = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdBc[myval.region_Detallada_Fall] &&
                  myval.ano_nacimiento < 1900 &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_nac === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Baja_California).length;

              const nacNo = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdNo[myval.region_Detallada_Fall] &&
                  myval.ano_nacimiento < 1900 &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_nac === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Noroeste).length;

              const nacScN = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdScN[myval.region_Detallada_Fall] &&
                  myval.ano_nacimiento < 1900 &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_nac === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Sector_Central_del_Norte).length;

              const nacNe = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdNe[myval.region_Detallada_Fall] &&
                  myval.ano_nacimiento < 1900 &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_nac === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Noreste).length;

              const nacVg = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdVg[myval.region_Detallada_Fall] &&
                  myval.ano_nacimiento < 1900 &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_nac === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Vertiente_del_Golfo).length;

              const nacMc = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdMc[myval.region_Detallada_Fall] &&
                  myval.ano_nacimiento < 1900 &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_nac === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Mexico_Central).length;

              const nacVp = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdVp[myval.region_Detallada_Fall] &&
                  myval.ano_nacimiento < 1900 &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_nac === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Vertiente_del_Pacifico).length;

              const nacCa = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdCa[myval.region_Detallada_Fall] &&
                  myval.ano_nacimiento < 1900 &&
                  myval.region_Amplia_Fall !== null &&
                  myval.region_Detallada_Nac !== myval.region_Detallada_Fall;
              }, this.mapComp.mapComposition.nrd.Cadena_Caribena).length;

              const nacCe = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdCe[myval.region_Detallada_Fall] &&
                  myval.ano_nacimiento < 1900 &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_nac === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Cadena_Centroamericana).length;

              this.nacRdArr.push(nacBc);
              this.nacRdArr.push(nacNo);
              this.nacRdArr.push(nacScN);
              this.nacRdArr.push(nacNe);
              this.nacRdArr.push(nacVg);
              this.nacRdArr.push(nacMc);
              this.nacRdArr.push(nacVp);
              this.nacRdArr.push(nacCa);
              this.nacRdArr.push(nacCe);

              const getPieLabels = _.keys(this.mapComp.mapComposition.nrd);
              getPieLabels.forEach(element => {
                this.pieRdChartLabels.push(element);
              });

              const getColors: string[] = ['#4575B4',
                '#92C5DE',
                '#F4A582',
                '#D1E5F0',
                '#F7F7F7',
                '#B2182B',
                '#D6604D',
                '#FDDBC7',
                '#74ADD1'];
              getColors.forEach(color => { this.colorRdArr.push(color); });

              this.pieRdChartData = this.nacRdArr;
              console.log(this.pieRdChartData);
              this.colorRdArr = [];
              break;
            }
            case 'ngird_xx': {

              const nacBc = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdBc[myval.region_Detallada_Fall] &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_nac === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Baja_California).length;

              const nacNo = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdNo[myval.region_Detallada_Fall] &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_nac === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Noroeste).length;

              const nacScN = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdScN[myval.region_Detallada_Fall] &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_nac === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Sector_Central_del_Norte).length;

              const nacNe = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdNe[myval.region_Detallada_Fall] &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_nac === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Noreste).length;

              const nacVg = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdVg[myval.region_Detallada_Fall] &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_nac === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Vertiente_del_Golfo).length;

              const nacMc = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdMc[myval.region_Detallada_Fall] &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_nac === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Mexico_Central).length;

              const nacVp = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdVp[myval.region_Detallada_Fall] &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_nac === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Vertiente_del_Pacifico).length;

              const nacCa = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdCa[myval.region_Detallada_Fall] &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_nac === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Cadena_Caribena).length;

              const nacCe = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdCe[myval.region_Detallada_Fall] &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_nac === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Cadena_Centroamericana).length;

              this.nacRdArr.push(nacBc);
              this.nacRdArr.push(nacNo);
              this.nacRdArr.push(nacScN);
              this.nacRdArr.push(nacNe);
              this.nacRdArr.push(nacVg);
              this.nacRdArr.push(nacMc);
              this.nacRdArr.push(nacVp);
              this.nacRdArr.push(nacCa);
              this.nacRdArr.push(nacCe);

              const getPieLabels = _.keys(this.mapComp.mapComposition.nrd);
              getPieLabels.forEach(element => {
                this.pieRdChartLabels.push(element);
              });

              const getColors: string[] = ['#4575B4',
                '#92C5DE',
                '#F4A582',
                '#D1E5F0',
                '#F7F7F7',
                '#B2182B',
                '#D6604D',
                '#FDDBC7',
                '#74ADD1'];
              getColors.forEach(color => { this.colorRdArr.push(color); });
              this.pieRdChartData = this.nacRdArr;
              this.colorRdArr = [];
              break;
            }
            case 'nmdrd_xix': {

              const nacBc = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdBc[myval.region_Detallada_Nac] &&
                  myval.ano_nacimiento < 1900 &&
                  myval.sexo === 'F';
              }, this.mapComp.mapComposition.nrd.Baja_California).length;

              const nacNo = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdNo[myval.region_Detallada_Nac] &&
                  myval.ano_nacimiento < 1900 &&
                  myval.sexo === 'F';
              }, this.mapComp.mapComposition.nrd.Noroeste).length;

              const nacScN = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdScN[myval.region_Detallada_Nac] &&
                  myval.ano_nacimiento < 1900 &&
                  myval.sexo === 'F';
              }, this.mapComp.mapComposition.nrd.Sector_Central_del_Norte).length;

              const nacNe = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdNe[myval.region_Detallada_Nac] &&
                  myval.ano_nacimiento < 1900 &&
                  myval.sexo === 'F';
              }, this.mapComp.mapComposition.nrd.Noreste).length;

              const nacVg = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdVg[myval.region_Detallada_Nac] &&
                  myval.ano_nacimiento < 1900 &&
                  myval.sexo === 'F';
              }, this.mapComp.mapComposition.nrd.Vertiente_del_Golfo).length;

              const nacMc = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdMc[myval.region_Detallada_Nac] &&
                  myval.ano_nacimiento < 1900 &&
                  myval.sexo === 'F';
              }, this.mapComp.mapComposition.nrd.Mexico_Central).length;

              const nacVp = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdVp[myval.region_Detallada_Nac] &&
                  myval.ano_nacimiento < 1900 &&
                  myval.sexo === 'F';
              }, this.mapComp.mapComposition.nrd.Vertiente_del_Pacifico).length;

              const nacCa = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdCa[myval.region_Detallada_Nac] &&
                  myval.ano_nacimiento < 1900 &&
                  myval.sexo === 'F';
              }, this.mapComp.mapComposition.nrd.Cadena_Caribena).length;

              const nacCe = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdCe[myval.region_Detallada_Nac] &&
                  myval.ano_nacimiento < 1900 &&
                  myval.sexo === 'F';
              }, this.mapComp.mapComposition.nrd.Cadena_Centroamericana).length;

              this.nacRdArr.push(nacBc);
              this.nacRdArr.push(nacNo);
              this.nacRdArr.push(nacScN);
              this.nacRdArr.push(nacNe);
              this.nacRdArr.push(nacVg);
              this.nacRdArr.push(nacMc);
              this.nacRdArr.push(nacVp);
              this.nacRdArr.push(nacCa);
              this.nacRdArr.push(nacCe);

              const getPieLabels = _.keys(this.mapComp.mapComposition.nrd);
              getPieLabels.forEach(element => {
                this.pieRdChartLabels.push(element);
              });

              const getColors: string[] = ['#4575B4',
                '#92C5DE',
                '#F4A582',
                '#D1E5F0',
                '#F7F7F7',
                '#B2182B',
                '#D6604D',
                '#FDDBC7',
                '#74ADD1'];
              getColors.forEach(color => { this.colorRdArr.push(color); });
              this.pieRdChartData = this.nacRdArr;
              this.colorRdArr = [];
              break;
            }
            case 'nmdrd_xx': {
              const nacBc = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdBc[myval.region_Detallada_Nac] &&
                  myval.sexo === 'F';
              }, this.mapComp.mapComposition.nrd.Baja_California).length;

              const nacNo = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdNo[myval.region_Detallada_Nac] &&
                  myval.sexo === 'F';
              }, this.mapComp.mapComposition.nrd.Noroeste).length;

              const nacScN = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdScN[myval.region_Detallada_Nac] &&
                  myval.sexo === 'F';
              }, this.mapComp.mapComposition.nrd.Sector_Central_del_Norte).length;

              const nacNe = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdNe[myval.region_Detallada_Nac] &&
                  myval.sexo === 'F';
              }, this.mapComp.mapComposition.nrd.Noreste).length;

              const nacVg = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdVg[myval.region_Detallada_Nac] &&
                  myval.sexo === 'F';
              }, this.mapComp.mapComposition.nrd.Vertiente_del_Golfo).length;

              const nacMc = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdMc[myval.region_Detallada_Nac] &&
                  myval.sexo === 'F';
              }, this.mapComp.mapComposition.nrd.Mexico_Central).length;

              const nacVp = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdVp[myval.region_Detallada_Nac] &&
                  myval.sexo === 'F';
              }, this.mapComp.mapComposition.nrd.Vertiente_del_Pacifico).length;

              const nacCa = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdCa[myval.region_Detallada_Nac] &&
                  myval.sexo === 'F';
              }, this.mapComp.mapComposition.nrd.Cadena_Caribena).length;

              const nacCe = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdCe[myval.region_Detallada_Nac] &&
                  myval.sexo === 'F';
              }, this.mapComp.mapComposition.nrd.Cadena_Centroamericana).length;

              this.nacRdArr.push(nacBc);
              this.nacRdArr.push(nacNo);
              this.nacRdArr.push(nacScN);
              this.nacRdArr.push(nacNe);
              this.nacRdArr.push(nacVg);
              this.nacRdArr.push(nacMc);
              this.nacRdArr.push(nacVp);
              this.nacRdArr.push(nacCa);
              this.nacRdArr.push(nacCe);

              const getPieLabels = _.keys(this.mapComp.mapComposition.nrd);
              getPieLabels.forEach(element => {
                this.pieRdChartLabels.push(element);
              });

              const getColors: string[] = ['#4575B4',
                '#92C5DE',
                '#F4A582',
                '#D1E5F0',
                '#F7F7F7',
                '#B2182B',
                '#D6604D',
                '#FDDBC7',
                '#74ADD1'];
              getColors.forEach(color => { this.colorRdArr.push(color); });
              this.pieRdChartData = this.nacRdArr;
              this.colorRdArr = [];
              break;
            }
            case 'nmerd_xix': {
              const nacBc = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdBc[myval.region_Detallada_Nac] &&
                  myval.sexo === 'F' &&
                  myval.ano_nacimiento < 1900 &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_fall === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Baja_California).length;

              const nacNo = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdNo[myval.region_Detallada_Nac] &&
                  myval.sexo === 'F' &&
                  myval.ano_nacimiento < 1900 &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_fall === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Noroeste).length;

              const nacScN = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdScN[myval.region_Detallada_Nac] &&
                  myval.sexo === 'F' &&
                  myval.ano_nacimiento < 1900 &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_fall === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Sector_Central_del_Norte).length;

              const nacNe = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdNe[myval.region_Detallada_Nac] &&
                  myval.sexo === 'F' &&
                  myval.ano_nacimiento < 1900 &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_fall === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Noreste).length;

              const nacVg = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdVg[myval.region_Detallada_Nac] &&
                  myval.sexo === 'F' &&
                  myval.ano_nacimiento < 1900 &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_fall === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Vertiente_del_Golfo).length;

              const nacMc = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdMc[myval.region_Detallada_Nac] &&
                  myval.sexo === 'F' &&
                  myval.ano_nacimiento < 1900 &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_fall === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Mexico_Central).length;

              const nacVp = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdVp[myval.region_Detallada_Nac] &&
                  myval.sexo === 'F' &&
                  myval.ano_nacimiento < 1900 &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_fall === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Vertiente_del_Pacifico).length;

              const nacCa = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdCa[myval.region_Detallada_Nac] &&
                  myval.sexo === 'F' &&
                  myval.ano_nacimiento < 1900 &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_fall === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Cadena_Caribena).length;

              const nacCe = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdCe[myval.region_Detallada_Nac] &&
                  myval.sexo === 'F' &&
                  myval.ano_nacimiento < 1900 &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_fall === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Cadena_Centroamericana).length;

              this.nacRdArr.push(nacBc);
              this.nacRdArr.push(nacNo);
              this.nacRdArr.push(nacScN);
              this.nacRdArr.push(nacNe);
              this.nacRdArr.push(nacVg);
              this.nacRdArr.push(nacMc);
              this.nacRdArr.push(nacVp);
              this.nacRdArr.push(nacCa);
              this.nacRdArr.push(nacCe);

              const getPieLabels = _.keys(this.mapComp.mapComposition.nrd);
              getPieLabels.forEach(element => {
                this.pieRdChartLabels.push(element);
              });

              const getColors: string[] = ['#4575B4',
                '#92C5DE',
                '#F4A582',
                '#D1E5F0',
                '#F7F7F7',
                '#B2182B',
                '#D6604D',
                '#FDDBC7',
                '#74ADD1'];
              getColors.forEach(color => { this.colorRdArr.push(color); });

              this.pieRdChartData = this.nacRdArr;

              console.log(this.pieRdChartData);

              this.colorRdArr = [];
              break;
            }
            case 'nmerd_xx': {

              const nacBc = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdBc[myval.region_Detallada_Nac] &&
                  myval.sexo === 'F' &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_fall === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Baja_California).length;

              const nacNo = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdNo[myval.region_Detallada_Nac] &&
                  myval.sexo === 'F' &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_fall === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Noroeste).length;

              const nacScN = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdScN[myval.region_Detallada_Nac] &&
                  myval.sexo === 'F' &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_fall === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Sector_Central_del_Norte).length;

              const nacNe = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdNe[myval.region_Detallada_Nac] &&
                  myval.sexo === 'F' &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_fall === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Noreste).length;

              const nacVg = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdVg[myval.region_Detallada_Nac] &&
                  myval.sexo === 'F' &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_fall === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Vertiente_del_Golfo).length;

              const nacMc = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdMc[myval.region_Detallada_Nac] &&
                  myval.sexo === 'F' &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_fall === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Mexico_Central).length;

              const nacVp = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdVp[myval.region_Detallada_Nac] &&
                  myval.sexo === 'F' &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_fall === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Vertiente_del_Pacifico).length;

              const nacCa = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdCa[myval.region_Detallada_Nac] &&
                  myval.sexo === 'F' &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_fall === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Cadena_Caribena).length;

              const nacCe = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdCe[myval.region_Detallada_Nac] &&
                  myval.sexo === 'F' &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_fall === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Cadena_Centroamericana).length;

              this.nacRdArr.push(nacBc);
              this.nacRdArr.push(nacNo);
              this.nacRdArr.push(nacScN);
              this.nacRdArr.push(nacNe);
              this.nacRdArr.push(nacVg);
              this.nacRdArr.push(nacMc);
              this.nacRdArr.push(nacVp);
              this.nacRdArr.push(nacCa);
              this.nacRdArr.push(nacCe);

              const getPieLabels = _.keys(this.mapComp.mapComposition.nrd);
              getPieLabels.forEach(element => {
                this.pieRdChartLabels.push(element);
              });

              const getColors: string[] = ['#4575B4',
                '#92C5DE',
                '#F4A582',
                '#D1E5F0',
                '#F7F7F7',
                '#B2182B',
                '#D6604D',
                '#FDDBC7',
                '#74ADD1'];
              getColors.forEach(color => { this.colorRdArr.push(color); });
              this.pieRdChartData = this.nacRdArr;
              this.colorRdArr = [];
              break;
            }
            case 'nmird_xix': {

              const nacBc = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdBc[myval.region_Detallada_Fall] &&
                  myval.sexo === 'F' &&
                  myval.ano_nacimiento < 1900 &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_nac === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Baja_California).length;

              const nacNo = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdNo[myval.region_Detallada_Fall] &&
                  myval.sexo === 'F' &&
                  myval.ano_nacimiento < 1900 &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_nac === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Noroeste).length;

              const nacScN = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdScN[myval.region_Detallada_Fall] &&
                  myval.sexo === 'F' &&
                  myval.ano_nacimiento < 1900 &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_nac === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Sector_Central_del_Norte).length;

              const nacNe = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdNe[myval.region_Detallada_Fall] &&
                  myval.sexo === 'F' &&
                  myval.ano_nacimiento < 1900 &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_nac === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Noreste).length;

              const nacVg = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdVg[myval.region_Detallada_Fall] &&
                  myval.sexo === 'F' &&
                  myval.ano_nacimiento < 1900 &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_nac === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Vertiente_del_Golfo).length;

              const nacMc = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdMc[myval.region_Detallada_Fall] &&
                  myval.sexo === 'F' &&
                  myval.ano_nacimiento < 1900 &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_nac === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Mexico_Central).length;

              const nacVp = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdVp[myval.region_Detallada_Fall] &&
                  myval.sexo === 'F' &&
                  myval.ano_nacimiento < 1900 &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_nac === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Vertiente_del_Pacifico).length;

              const nacCa = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdCa[myval.region_Detallada_Fall] &&
                  myval.sexo === 'F' &&
                  myval.ano_nacimiento < 1900 &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_nac === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Cadena_Caribena).length;

              const nacCe = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdCe[myval.region_Detallada_Fall] &&
                  myval.sexo === 'F' &&
                  myval.ano_nacimiento < 1900 &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_nac === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Cadena_Centroamericana).length;

              this.nacRdArr.push(nacBc);
              this.nacRdArr.push(nacNo);
              this.nacRdArr.push(nacScN);
              this.nacRdArr.push(nacNe);
              this.nacRdArr.push(nacVg);
              this.nacRdArr.push(nacMc);
              this.nacRdArr.push(nacVp);
              this.nacRdArr.push(nacCa);
              this.nacRdArr.push(nacCe);

              const getPieLabels = _.keys(this.mapComp.mapComposition.nrd);
              getPieLabels.forEach(element => {
                this.pieRdChartLabels.push(element);
              });

              const getColors: string[] = ['#4575B4',
                '#92C5DE',
                '#F4A582',
                '#D1E5F0',
                '#F7F7F7',
                '#B2182B',
                '#D6604D',
                '#FDDBC7',
                '#74ADD1'];
              getColors.forEach(color => { this.colorRdArr.push(color); });
              this.pieRdChartData = this.nacRdArr;
              this.colorRdArr = [];
              break;
            }
            case 'nmird_xx': {

              const nacBc = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdBc[myval.region_Detallada_Fall] &&
                  myval.sexo === 'F' &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_nac === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Baja_California).length;

              const nacNo = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdNo[myval.region_Detallada_Fall] &&
                  myval.sexo === 'F' &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_nac === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Noroeste).length;

              const nacScN = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdScN[myval.region_Detallada_Fall] &&
                  myval.sexo === 'F' &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_nac === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Sector_Central_del_Norte).length;

              const nacNe = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdNe[myval.region_Detallada_Fall] &&
                  myval.sexo === 'F' &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_nac === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Noreste).length;

              const nacVg = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdVg[myval.region_Detallada_Fall] &&
                  myval.sexo === 'F' &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_nac === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Vertiente_del_Golfo).length;

              const nacMc = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdMc[myval.region_Detallada_Fall] &&
                  myval.sexo === 'F' &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_nac === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Mexico_Central).length;

              const nacVp = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdVp[myval.region_Detallada_Fall] &&
                  myval.sexo === 'F' &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_nac === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Vertiente_del_Pacifico).length;

              const nacCa = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdCa[myval.region_Detallada_Fall] &&
                  myval.sexo === 'F' &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_nac === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Cadena_Caribena).length;

              const nacCe = _.filter(innerWriterPieArray, (myval: Writer) => {
                return nacRdCe[myval.region_Detallada_Fall] &&
                  myval.sexo === 'F' &&
                  myval.lugar_nacimiento !== myval.lugar_muerte &&
                  myval.ni_nac === 'Nacional';
              }, this.mapComp.mapComposition.nrd.Cadena_Centroamericana).length;

              this.nacRdArr.push(nacBc);
              this.nacRdArr.push(nacNo);
              this.nacRdArr.push(nacScN);
              this.nacRdArr.push(nacNe);
              this.nacRdArr.push(nacVg);
              this.nacRdArr.push(nacMc);
              this.nacRdArr.push(nacVp);
              this.nacRdArr.push(nacCa);
              this.nacRdArr.push(nacCe);

              const getPieLabels = _.keys(this.mapComp.mapComposition.nrd);
              getPieLabels.forEach(element => {
                this.pieRdChartLabels.push(element);
              });

              const getColors: string[] = ['#4575B4',
                '#92C5DE',
                '#F4A582',
                '#D1E5F0',
                '#F7F7F7',
                '#B2182B',
                '#D6604D',
                '#FDDBC7',
                '#74ADD1'];
              getColors.forEach(color => { this.colorRdArr.push(color); });

              this.pieRdChartData = this.nacRdArr;
              this.colorRdArr = [];
              break;
            }
          } // end switch
        } // end else if
      }
    });

  }

  drawLineChart(graphType: string) {
    this.writersService.getWriters().subscribe({
      next: (wData) => {

        console.log(graphType);
        // to show chart when data is available
        this.proofLine = true;

        // clear data to avoid acumulaition
        this.lblArray = [];
        let bValues = [];
        let dValues = [];
        this.bValues = [];
        this.dValues = [];
        this.bArray = [];
        this.dArray = [];
        let bCount: Dictionary<number>;
        let dCount: Dictionary<number>;

        // Delcare minimum values for Births and Deaths
        const innerWriterLineArray = wData;
        const minB = _.min(innerWriterLineArray, (w: Writer) => w.ano_nacimiento).ano_nacimiento;
        const maxB = _.max(innerWriterLineArray, (w: Writer) => w.ano_nacimiento).ano_nacimiento;
        const minProvD = Number(_.min(innerWriterLineArray, (w: Writer) => w.ano_muerte).ano_muerte);
        const maxProvD = Number(_.max(innerWriterLineArray, (w: Writer) => w.ano_muerte).ano_muerte);
        const minD = Math.floor(minProvD / 10) * 10;
        const maxD = Math.floor(maxProvD / 10) * 10;

        // Begins conditions
        if (graphType === 'ngdz_xix' || graphType === 'ngdra_xix' || graphType === 'ngdrd_xix' ||
          graphType === 'ngdz_xx' || graphType === 'ngdra_xx' || graphType === 'ngdrd_xx') {
          // general demography
          for (let currentDecade = minB; currentDecade <= maxD; currentDecade += 10) {
            // loop writers data
            // currents decades loop by 10 (e. 1730-1740...)
            const decadeEnd = currentDecade + 9;
            // decadeEnd loops writers by 9 to get decade values (e. g 1730-39)
            // Births count
            bCount = _.countBy(innerWriterLineArray, (w: Writer) => {
              return w.ano_nacimiento >= currentDecade &&
                w.ano_nacimiento <= decadeEnd &&
                w.ni_nac === 'Nacional';
            });
            this.bArray.push({
              'decade': currentDecade,
              'births': bCount.true
            });
            // Deaths count
            dCount = _.countBy(innerWriterLineArray, (w: Writer) => {
              return w.ano_muerte >= currentDecade &&
                w.ano_muerte <= decadeEnd &&
                w.ni_nac === 'Nacional';
            });
            this.dArray.push({
              'decade': currentDecade,
              'deaths': dCount.true
            });
            // fill labels
            this.lblArray.push(currentDecade);
          }

        } else if (graphType === 'ngez_xix' || graphType === 'ngera_xix' || graphType === 'ngerd_xix' ||
          graphType === 'ngez_xx' || graphType === 'ngera_xx' || graphType === 'ngerd_xx' ||
          graphType === 'ngiz_xix' || graphType === 'ngira_xix' || graphType === 'ngird_xix' ||
          graphType === 'ngiz_xx' || graphType === 'ngira_xx' || graphType === 'ngird_xx') {
          for (let currentDecade = minB; currentDecade <= maxD; currentDecade += 10) {
            const decadeEnd = currentDecade + 9;
            bCount = _.countBy(innerWriterLineArray, (w: Writer) => {
              return w.ano_nacimiento >= currentDecade &&
                w.ano_nacimiento <= decadeEnd &&
                w.ni_nac === 'Nacional' &&
                w.ni_fall === 'Nacional' &&
                w.lugar_nacimiento !== w.lugar_muerte;
            });
            this.bArray.push({
              'decade': currentDecade,
              'births': bCount.true
            });
            dCount = _.countBy(innerWriterLineArray, (w: Writer) => {
              return w.ano_muerte >= currentDecade &&
                w.ano_muerte <= decadeEnd &&
                w.ni_nac === 'Nacional' &&
                w.ni_fall === 'Nacional' &&
                w.lugar_nacimiento !== w.lugar_muerte;
            });
            this.dArray.push({
              'decade': currentDecade,
              'deaths': dCount.true
            });
            this.lblArray.push(currentDecade);
          }
        } else if (graphType === 'nmdz_xix' || graphType === 'nmdra_xix' || graphType === 'nmdrd_xix' ||
          graphType === 'nmdz_xx' || graphType === 'nmdra_xx' || graphType === 'nmdrd_xx') {
          for (let currentDecade = minB; currentDecade <= maxD; currentDecade += 10) {
            const decadeEnd = currentDecade + 9;
            bCount = _.countBy(innerWriterLineArray, (w: Writer) => {
              return w.sexo === 'F' &&
                w.ano_nacimiento >= currentDecade &&
                w.ano_nacimiento <= decadeEnd &&
                w.ni_nac === 'Nacional';
            });
            this.bArray.push({
              'decade': currentDecade,
              'births': bCount.true
            });
            dCount = _.countBy(innerWriterLineArray, (w: Writer) => {
              return w.sexo === 'F' &&
                w.ano_muerte >= currentDecade &&
                w.ano_muerte <= decadeEnd &&
                w.ni_nac === 'Nacional';
            });
            this.dArray.push({
              'decade': currentDecade,
              'deaths': dCount.true
            });
            this.lblArray.push(currentDecade);
          }
        } else if (graphType === 'nmez_xix' || graphType === 'nmera_xix' || graphType === 'nmerd_xix' ||
          graphType === 'nmez_xx' || graphType === 'nmera_xx' || graphType === 'nmerd_xx' ||
          graphType === 'nmiz_xix' || graphType === 'nmira_xix' || graphType === 'nmird_xix' ||
          graphType === 'nmiz_xx' || graphType === 'nmira_xx' || graphType === 'nmird_xx') {
          for (let currentDecade = minB; currentDecade <= maxD; currentDecade += 10) {
            const decadeEnd = currentDecade + 9;
            bCount = _.countBy(innerWriterLineArray, (w: Writer) => {
              return w.sexo === 'F' &&
                w.ano_nacimiento >= currentDecade &&
                w.ano_nacimiento <= decadeEnd &&
                w.ni_nac === 'Nacional' &&
                w.ni_fall === 'Nacional' &&
                w.lugar_nacimiento !== w.lugar_muerte;
            });
            this.bArray.push({
              'decade': currentDecade,
              'births': bCount.true
            });
            dCount = _.countBy(innerWriterLineArray, (w: Writer) => {
              return w.sexo === 'F' &&
                w.ano_muerte >= currentDecade &&
                w.ano_muerte <= decadeEnd &&
                w.ni_nac === 'Nacional' &&
                w.ni_fall === 'Nacional' &&
                w.lugar_nacimiento !== w.lugar_muerte;
            });
            this.dArray.push({
              'decade': currentDecade,
              'deaths': dCount.true
            });
            this.lblArray.push(currentDecade);
          }
        }

        bValues = _.map(this.bArray, (o) => o.births === undefined ? 0 : o.births);
        dValues = _.map(this.dArray, (o) => o.deaths === undefined ? 0 : o.deaths);
        this.bValues = bValues;
        this.dValues = dValues;
        this.chartLineData = [
          { data: this.bValues, label: 'Nacimientos' },
          { data: this.dValues, label: 'Fallecimientos' }
        ];
        this.chartLineLabels = this.lblArray;
      } // end next
    });  // end subscribe
  } // end func


  drawStatesBarChart(graphType: string) {
    this.barCountryData = [];
    this.barCountryChartLabels.length = 0;
    this.barCountryChartData = [];

    const innerBarWriterArray = Object.assign({}, this.innerWriter);
    let stateArrayDistinctList: string[] = new Array;
    let stateArrayChartList: any[] = new Array;
    let stateCounter: any;

    stateArrayDistinctList = _.chain(innerBarWriterArray).map((w: Writer) => {
      if (w.ni_nac === 'Nacional' && w.lugar_nacimiento !== null) {
        return w.lugar_nacimiento;
      }
    }).uniq().value();
    stateArrayDistinctList.shift();

    if (graphType === 'ngdz_xix' || graphType === 'ngdra_xix' || graphType === 'ngdrd_xix') {

      for (let i = 0; i < stateArrayDistinctList.length; i++) {
        stateCounter = _.countBy(innerBarWriterArray, (w: Writer) => {
          return w.lugar_nacimiento === stateArrayDistinctList[i] &&
            w.ano_nacimiento < 1900;
        });

        stateArrayChartList.push({
          'state': stateArrayDistinctList[i],
          'birth': stateCounter.true === undefined ? 0 : stateCounter.true
        });

      }
      stateArrayChartList = _.sortBy(stateArrayChartList, (chartList: any) => chartList.birth);

    } else if (graphType === 'ngdz_xx' || graphType === 'ngdra_xx' || graphType === 'ngdrd_xx') {

      for (let i = 0; i < stateArrayDistinctList.length; i++) {
        stateCounter = _.countBy(innerBarWriterArray, (w: Writer) => {
          return w.lugar_nacimiento === stateArrayDistinctList[i];
        });

        stateArrayChartList.push({
          'state': stateArrayDistinctList[i],
          'birth': stateCounter.true === undefined ? 0 : stateCounter.true
        });

      }
      stateArrayChartList = _.sortBy(stateArrayChartList, (chartList: any) => chartList.birth);
    } else if (graphType === 'ngez_xix' || graphType === 'ngera_xix' || graphType === 'ngerd_xix') {

      for (let i = 0; i < stateArrayDistinctList.length; i++) {
        stateCounter = _.countBy(innerBarWriterArray, (w: Writer) => {
          return w.lugar_nacimiento === stateArrayDistinctList[i] &&
            w.ano_nacimiento < 1900 &&
            w.ni_nac === 'Nacional' &&
            w.ni_fall === 'Nacional' &&
            w.lugar_nacimiento !== w.lugar_muerte;

        });

        stateArrayChartList.push({
          'state': stateArrayDistinctList[i],
          'birth': stateCounter.true === undefined ? 0 : stateCounter.true
        });

      }
      stateArrayChartList = _.sortBy(stateArrayChartList, (chartList: any) => chartList.birth);

    } else if (graphType === 'ngez_xx' || graphType === 'ngera_xx' || graphType === 'ngerd_xx') {

      for (let i = 0; i < stateArrayDistinctList.length; i++) {
        stateCounter = _.countBy(innerBarWriterArray, (w: Writer) => {
          return w.lugar_nacimiento === stateArrayDistinctList[i] &&
            w.ni_nac === 'Nacional' &&
            w.ni_fall === 'Nacional' &&
            w.lugar_nacimiento !== w.lugar_muerte;

        });

        stateArrayChartList.push({
          'state': stateArrayDistinctList[i],
          'birth': stateCounter.true === undefined ? 0 : stateCounter.true
        });

      }
      stateArrayChartList = _.sortBy(stateArrayChartList, (chartList: any) => chartList.birth);

    } else if (graphType === 'ngiz_xix' || graphType === 'ngira_xix' || graphType === 'ngird_xix') {

      for (let i = 0; i < stateArrayDistinctList.length; i++) {
        stateCounter = _.countBy(innerBarWriterArray, (w: Writer) => {
          return w.lugar_muerte === stateArrayDistinctList[i] &&
            w.lugar_nacimiento !== stateArrayDistinctList[i] &&
            w.ano_nacimiento < 1900 &&
            w.ni_nac === 'Nacional' &&
            w.ni_fall === 'Nacional' &&
            w.lugar_nacimiento !== w.lugar_muerte;
        });

        stateArrayChartList.push({
          'state': stateArrayDistinctList[i],
          'birth': stateCounter.true === undefined ? 0 : stateCounter.true
        });

      }
      stateArrayChartList = _.sortBy(stateArrayChartList, (chartList: any) => chartList.birth);

    } else if (graphType === 'ngiz_xx' || graphType === 'ngira_xx' || graphType === 'ngird_xx') {

      for (let i = 0; i < stateArrayDistinctList.length; i++) {
        stateCounter = _.countBy(innerBarWriterArray, (w: Writer) => {
          return w.lugar_muerte === stateArrayDistinctList[i] &&
            w.lugar_nacimiento !== stateArrayDistinctList[i] &&
            w.ni_nac === 'Nacional' &&
            w.ni_fall === 'Nacional' &&
            w.lugar_nacimiento !== w.lugar_muerte;
        });

        stateArrayChartList.push({
          'state': stateArrayDistinctList[i],
          'birth': stateCounter.true === undefined ? 0 : stateCounter.true
        });

      }
      stateArrayChartList = _.sortBy(stateArrayChartList, (chartList: any) => chartList.birth);
    } else if (graphType === 'nmdz_xix' || graphType === 'nmdra_xix' || graphType === 'nmdrd_xix') {

      for (let i = 0; i < stateArrayDistinctList.length; i++) {
        stateCounter = _.countBy(innerBarWriterArray, (w: Writer) => {
          return w.lugar_nacimiento === stateArrayDistinctList[i] &&
            w.sexo === 'F' &&
            w.ano_nacimiento < 1900;
        });

        stateArrayChartList.push({
          'state': stateArrayDistinctList[i],
          'birth': stateCounter.true === undefined ? 0 : stateCounter.true
        });

      }
      stateArrayChartList = _.sortBy(stateArrayChartList, (chartList: any) => chartList.birth);

    } else if (graphType === 'nmdz_xx' || graphType === 'nmdra_xx' || graphType === 'nmdrd_xx') {

      for (let i = 0; i < stateArrayDistinctList.length; i++) {
        stateCounter = _.countBy(innerBarWriterArray, (w: Writer) => {
          return w.lugar_nacimiento === stateArrayDistinctList[i] &&
            w.sexo === 'F';
        });

        stateArrayChartList.push({
          'state': stateArrayDistinctList[i],
          'birth': stateCounter.true === undefined ? 0 : stateCounter.true
        });

      }
      stateArrayChartList = _.sortBy(stateArrayChartList, (chartList: any) => chartList.birth);

    } else if (graphType === 'nmez_xix' || graphType === 'nmera_xix' || graphType === 'nmerd_xix') {

      for (let i = 0; i < stateArrayDistinctList.length; i++) {
        stateCounter = _.countBy(innerBarWriterArray, (w: Writer) => {
          return w.lugar_nacimiento === stateArrayDistinctList[i] &&
            w.sexo === 'F' &&
            w.ano_nacimiento < 1900 &&
            w.ni_nac === 'Nacional' &&
            w.ni_fall === 'Nacional' &&
            w.lugar_nacimiento !== w.lugar_muerte;

        });

        stateArrayChartList.push({
          'state': stateArrayDistinctList[i],
          'birth': stateCounter.true === undefined ? 0 : stateCounter.true
        });

      }
      stateArrayChartList = _.sortBy(stateArrayChartList, (chartList: any) => chartList.birth);

    } else if (graphType === 'nmez_xx' || graphType === 'nmera_xx' || graphType === 'nmerd_xx') {

      for (let i = 0; i < stateArrayDistinctList.length; i++) {
        stateCounter = _.countBy(innerBarWriterArray, (w: Writer) => {
          return w.lugar_nacimiento === stateArrayDistinctList[i] &&
            w.sexo === 'F' &&
            w.ni_nac === 'Nacional' &&
            w.ni_fall === 'Nacional' &&
            w.lugar_nacimiento !== w.lugar_muerte;
        });

        stateArrayChartList.push({
          'state': stateArrayDistinctList[i],
          'birth': stateCounter.true === undefined ? 0 : stateCounter.true
        });

      }
      stateArrayChartList = _.sortBy(stateArrayChartList, (chartList: any) => chartList.birth);

    } else if (graphType === 'nmiz_xix' || graphType === 'nmira_xix' || graphType === 'nmird_xix') {

      for (let i = 0; i < stateArrayDistinctList.length; i++) {
        stateCounter = _.countBy(innerBarWriterArray, (w: Writer) => {
          return w.lugar_muerte === stateArrayDistinctList[i] &&
            w.lugar_nacimiento !== stateArrayDistinctList[i] &&
            w.sexo === 'F' &&
            w.ano_nacimiento < 1900 &&
            w.ni_nac === 'Nacional' &&
            w.ni_fall === 'Nacional' &&
            w.lugar_nacimiento !== w.lugar_muerte;
        });

        stateArrayChartList.push({
          'state': stateArrayDistinctList[i],
          'birth': stateCounter.true === undefined ? 0 : stateCounter.true
        });

      }
      stateArrayChartList = _.sortBy(stateArrayChartList, (chartList: any) => chartList.birth);

    } else if (graphType === 'nmiz_xx' || graphType === 'nmira_xx' || graphType === 'nmird_xx') {

      for (let i = 0; i < stateArrayDistinctList.length; i++) {
        stateCounter = _.countBy(innerBarWriterArray, (w: Writer) => {
          return w.lugar_muerte === stateArrayDistinctList[i] &&
            w.lugar_nacimiento !== stateArrayDistinctList[i] &&
            w.sexo === 'F' &&
            w.ni_nac === 'Nacional' &&
            w.ni_fall === 'Nacional' &&
            w.lugar_nacimiento !== w.lugar_muerte;
        });

        stateArrayChartList.push({
          'state': stateArrayDistinctList[i],
          'birth': stateCounter.true === undefined ? 0 : stateCounter.true
        });

      }
      stateArrayChartList = _.sortBy(stateArrayChartList, (chartList: any) => chartList.birth);

    }

    this.barCountryLabels = _.map(stateArrayChartList, (chartList: any) => chartList.state);
    this.barCountryLabels.forEach(element => {
      this.barCountryChartLabels.push(element);
    });

    this.barCountryData = _.map(stateArrayChartList, (chartList: any) => chartList.birth);
    this.barCountryChartData = [
      { data: this.barCountryData, label: 'Nacimientos' }
    ];

  }

  callInternationalDrawChart() {
    this.mapService.newInternationalGraphType.subscribe(data => {

      this.drawIntGenderChart(data.graphType);
      this.drawIntCountryChart(data.graphType);
      this.drawIntLineChart(data.graphType);
      this.drawIntPieChart(data);


    });
  }


  drawIntGenderChart(graphType: string) {
    const innerGenderWriterArray = Object.assign({}, this.innerWriter);

    if (graphType === 'igez_xix' || graphType === 'igec_xix' || graphType === 'imez_xix' || graphType === 'imec_xix') {

      this.fBarValue = _.countBy(innerGenderWriterArray, w => w.sexo === 'M' &&
        w.ano_nacimiento < 1900 &&
        w.ni_nac === 'Nacional' &&
        w.ni_fall === 'Internacional');
      this.mBarValue = _.countBy(innerGenderWriterArray, w => w.sexo === 'F' &&
        w.ano_nacimiento < 1900 &&
        w.ni_nac === 'Nacional' &&
        w.ni_fall === 'Internacional');

    } else if (graphType === 'igez_xx' || graphType === 'igec_xx' || graphType === 'imez_xx' || graphType === 'imec_xx') {

      this.fBarValue = _.countBy(innerGenderWriterArray, w => w.sexo === 'M' &&
        w.ni_nac === 'Nacional' &&
        w.ni_fall === 'Internacional');
      this.mBarValue = _.countBy(innerGenderWriterArray, w => w.sexo === 'F' &&
        w.ni_nac === 'Nacional' &&
        w.ni_fall === 'Internacional');

    } else if (graphType === 'igiz_xix' || graphType === 'igic_xix' || graphType === 'imiz_xix' || graphType === 'imic_xix') {

      this.fBarValue = _.countBy(innerGenderWriterArray, w => w.sexo === 'M' &&
        w.ano_nacimiento < 1900 &&
        w.ni_nac === 'Internacional' &&
        w.ni_fall === 'Nacional');
      this.mBarValue = _.countBy(innerGenderWriterArray, w => w.sexo === 'F' &&
        w.ano_nacimiento < 1900 &&
        w.ni_nac === 'Internacional' &&
        w.ni_fall === 'Nacional');

    } else if (graphType === 'igiz_xx' || graphType === 'igic_xx' || graphType === 'imiz_xx' || graphType === 'imic_xx') {
      this.fBarValue = _.countBy(innerGenderWriterArray, w => w.sexo === 'M' &&
        w.ni_nac === 'Internacional' &&
        w.ni_fall === 'Nacional');
      this.mBarValue = _.countBy(innerGenderWriterArray, w => w.sexo === 'F' &&
        w.ni_nac === 'Internacional' &&
        w.ni_fall === 'Nacional');
    }

    this.fBarArray[0] = this.fBarValue.true;
    this.mBarArray[0] = this.mBarValue.true;
    this.barChartData = [
      { data: this.fBarArray, label: 'Masculino' },
      { data: this.mBarArray, label: 'Femenino' }
    ];

  }

  drawIntPieChart(data: MapType) {

    const innerWriterPieArray = Object.assign({}, this.innerWriter);

    const nacZonaAObj: any = {};
    const nacZonaBObj: any = {};
    const nacZonaCObj: any = {};
    const nacZonaDObj: any = {};
    const nacZonaEObj: any = {};

    const nacAfObj: any = {};
    const nacAnoObj: any = {};
    const nacAceObj: any = {};
    const nacAsuObj: any = {};
    const nacAsObj: any = {};
    const nacEuObj: any = {};

    if (data.mapType === 1) {

      this.raChart = false;
      this.rdChart = false;
      this.contChart = false;
      this.zoneChart = true;

      this.nacZoneArr = [];
      this.pieZoneChartLabels = [];

      switch (data.graphType) {
        case 'igez_xix': {

          _.each(this.mapComp.mapComposition.igez_xix.zonaA, function (bb: any) { nacZonaAObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.igez_xix.zonaB, function (bb: any) { nacZonaBObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.igez_xix.zonaC, function (bb: any) { nacZonaCObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.igez_xix.zonaD, function (bb: any) { nacZonaDObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.igez_xix.zonaE, function (bb: any) { nacZonaEObj[bb.feature] = true; });

          const nacZonaA = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacZonaAObj[myval.lugar_muerte] && myval.ano_nacimiento < 1900;
          }, this.mapComp.mapComposition.igez_xix.zonaA).length;
          const nacZonaB = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacZonaBObj[myval.lugar_muerte] && myval.ano_nacimiento < 1900;
          }, this.mapComp.mapComposition.igez_xix.zonaB).length;
          const nacZonaC = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacZonaCObj[myval.lugar_muerte] && myval.ano_nacimiento < 1900;
          }, this.mapComp.mapComposition.igez_xix.zonaC).length;
          const nacZonaD = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacZonaDObj[myval.lugar_muerte] && myval.ano_nacimiento < 1900;
          }, this.mapComp.mapComposition.igez_xix.zonaD).length;
          const nacZonaE = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacZonaEObj[myval.lugar_muerte] && myval.ano_nacimiento < 1900;
          }, this.mapComp.mapComposition.igez_xix.zonaE).length;

          this.nacZoneArr.push(nacZonaA);
          this.nacZoneArr.push(nacZonaB);
          this.nacZoneArr.push(nacZonaC);
          this.nacZoneArr.push(nacZonaD);
          this.nacZoneArr.push(nacZonaE);

          const getPieLabels = _.keys(this.mapComp.mapComposition.igez_xix);
          getPieLabels.forEach(element => {
            this.pieZoneChartLabels.push(element);
          });

          const getColors: string[] = ['#F26D78', '#F2DB94', '#F2E9BD', '#9EBF95', '#435951'];
          getColors.forEach(color => { this.colorZoneArr.push(color); });

          this.pieZoneChartData = this.nacZoneArr;
          this.colorZoneArr = [];
          break;

        }

        case 'igez_xx': {
          _.each(this.mapComp.mapComposition.igez_xx.zonaA, function (bb: any) { nacZonaAObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.igez_xx.zonaB, function (bb: any) { nacZonaBObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.igez_xx.zonaC, function (bb: any) { nacZonaCObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.igez_xx.zonaD, function (bb: any) { nacZonaDObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.igez_xx.zonaE, function (bb: any) { nacZonaEObj[bb.feature] = true; });

          const nacZonaA = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacZonaAObj[myval.lugar_muerte];
          }, this.mapComp.mapComposition.igez_xx.zonaA).length;
          const nacZonaB = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacZonaBObj[myval.lugar_muerte];
          }, this.mapComp.mapComposition.igez_xx.zonaB).length;
          const nacZonaC = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacZonaCObj[myval.lugar_muerte];
          }, this.mapComp.mapComposition.igez_xx.zonaC).length;
          const nacZonaD = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacZonaDObj[myval.lugar_muerte];
          }, this.mapComp.mapComposition.igez_xx.zonaD).length;
          const nacZonaE = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacZonaEObj[myval.lugar_muerte];
          }, this.mapComp.mapComposition.igez_xx.zonaE).length;

          this.nacZoneArr.push(nacZonaA);
          this.nacZoneArr.push(nacZonaB);
          this.nacZoneArr.push(nacZonaC);
          this.nacZoneArr.push(nacZonaD);
          this.nacZoneArr.push(nacZonaE);

          const getPieLabels = _.keys(this.mapComp.mapComposition.igez_xx);
          getPieLabels.forEach(element => {
            this.pieZoneChartLabels.push(element);
          });

          const getColors: string[] = ['#F26D78', '#F2DB94', '#F2E9BD', '#9EBF95', '#435951'];
          getColors.forEach(color => { this.colorZoneArr.push(color); });

          this.pieZoneChartData = this.nacZoneArr;
          this.colorZoneArr = [];
          break;
        }
        case 'igiz_xix': {

          _.each(this.mapComp.mapComposition.igiz_xix.zonaA, function (bb: any) { nacZonaAObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.igiz_xix.zonaB, function (bb: any) { nacZonaBObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.igiz_xix.zonaC, function (bb: any) { nacZonaCObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.igiz_xix.zonaD, function (bb: any) { nacZonaDObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.igiz_xix.zonaE, function (bb: any) { nacZonaEObj[bb.feature] = true; });

          const nacZonaA = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacZonaAObj[myval.lugar_nacimiento] && myval.ano_nacimiento < 1900;
          }, this.mapComp.mapComposition.igiz_xix.zonaA).length;
          const nacZonaB = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacZonaBObj[myval.lugar_nacimiento] && myval.ano_nacimiento < 1900;
          }, this.mapComp.mapComposition.igiz_xix.zonaB).length;
          const nacZonaC = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacZonaCObj[myval.lugar_nacimiento] && myval.ano_nacimiento < 1900;
          }, this.mapComp.mapComposition.igiz_xix.zonaC).length;
          const nacZonaD = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacZonaDObj[myval.lugar_nacimiento] && myval.ano_nacimiento < 1900;
          }, this.mapComp.mapComposition.igiz_xix.zonaD).length;
          const nacZonaE = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacZonaEObj[myval.lugar_nacimiento] && myval.ano_nacimiento < 1900;
          }, this.mapComp.mapComposition.igiz_xix.zonaD).length;

          this.nacZoneArr.push(nacZonaA);
          this.nacZoneArr.push(nacZonaB);
          this.nacZoneArr.push(nacZonaC);
          this.nacZoneArr.push(nacZonaD);
          this.nacZoneArr.push(nacZonaE);

          const getPieLabels = _.keys(this.mapComp.mapComposition.igiz_xix);
          getPieLabels.forEach(element => {
            this.pieZoneChartLabels.push(element);
          });

          const getColors: string[] = ['#F26D78', '#F2DB94', '#F2E9BD', '#9EBF95', '#435951'];
          getColors.forEach(color => { this.colorZoneArr.push(color); });

          this.pieZoneChartData = this.nacZoneArr;
          this.colorZoneArr = [];
          break;

        }
        case 'igiz_xx': {

          _.each(this.mapComp.mapComposition.igiz_xx.zonaA, function (bb: any) { nacZonaAObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.igiz_xx.zonaB, function (bb: any) { nacZonaBObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.igiz_xx.zonaC, function (bb: any) { nacZonaCObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.igiz_xx.zonaD, function (bb: any) { nacZonaDObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.igiz_xx.zonaE, function (bb: any) { nacZonaEObj[bb.feature] = true; });

          const nacZonaA = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacZonaAObj[myval.lugar_nacimiento];
          }, this.mapComp.mapComposition.igiz_xx.zonaA).length;
          const nacZonaB = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacZonaBObj[myval.lugar_nacimiento];
          }, this.mapComp.mapComposition.igiz_xx.zonaB).length;
          const nacZonaC = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacZonaCObj[myval.lugar_nacimiento];
          }, this.mapComp.mapComposition.igiz_xx.zonaC).length;
          const nacZonaD = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacZonaDObj[myval.lugar_nacimiento];
          }, this.mapComp.mapComposition.igiz_xx.zonaD).length;
          const nacZonaE = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacZonaEObj[myval.lugar_nacimiento];
          }, this.mapComp.mapComposition.igiz_xx.zonaD).length;

          this.nacZoneArr.push(nacZonaA);
          this.nacZoneArr.push(nacZonaB);
          this.nacZoneArr.push(nacZonaC);
          this.nacZoneArr.push(nacZonaD);
          this.nacZoneArr.push(nacZonaE);

          const getPieLabels = _.keys(this.mapComp.mapComposition.igiz_xx);
          getPieLabels.forEach(element => {
            this.pieZoneChartLabels.push(element);
          });

          const getColors: string[] = ['#F26D78', '#F2DB94', '#F2E9BD', '#9EBF95', '#435951'];
          getColors.forEach(color => { this.colorZoneArr.push(color); });

          this.pieZoneChartData = this.nacZoneArr;
          this.colorZoneArr = [];
          break;

        }
        case 'imez_xix': {

          _.each(this.mapComp.mapComposition.imez_xix.zonaA, function (bb: any) { nacZonaAObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.imez_xix.zonaB, function (bb: any) { nacZonaBObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.imez_xix.zonaC, function (bb: any) { nacZonaCObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.imez_xix.zonaD, function (bb: any) { nacZonaDObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.imez_xix.zonaE, function (bb: any) { nacZonaEObj[bb.feature] = true; });

          const nacZonaA = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacZonaAObj[myval.lugar_muerte] &&
            myval.sexo === 'F'
            && myval.ano_nacimiento < 1900;
          }, this.mapComp.mapComposition.imez_xix.zonaA).length;
          const nacZonaB = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacZonaBObj[myval.lugar_muerte] &&
            myval.sexo === 'F'
            && myval.ano_nacimiento < 1900;
          }, this.mapComp.mapComposition.imez_xix.zonaB).length;
          const nacZonaC = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacZonaCObj[myval.lugar_muerte] &&
            myval.sexo === 'F'
            && myval.ano_nacimiento < 1900;
          }, this.mapComp.mapComposition.imez_xix.zonaC).length;
          const nacZonaD = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacZonaDObj[myval.lugar_muerte] &&
            myval.sexo === 'F'
            && myval.ano_nacimiento < 1900;
          }, this.mapComp.mapComposition.imez_xix.zonaD).length;
          const nacZonaE = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacZonaEObj[myval.lugar_muerte] &&
            myval.sexo === 'F'
            && myval.ano_nacimiento < 1900;
          }, this.mapComp.mapComposition.imez_xix.zonaE).length;

          this.nacZoneArr.push(nacZonaA);
          this.nacZoneArr.push(nacZonaB);
          this.nacZoneArr.push(nacZonaC);
          this.nacZoneArr.push(nacZonaD);
          this.nacZoneArr.push(nacZonaE);

          const getPieLabels = _.keys(this.mapComp.mapComposition.imez_xix);
          getPieLabels.forEach(element => {
            this.pieZoneChartLabels.push(element);
          });

          const getColors: string[] = ['#F26D78', '#F2DB94', '#F2E9BD', '#9EBF95', '#435951'];
          getColors.forEach(color => { this.colorZoneArr.push(color); });

          this.pieZoneChartData = this.nacZoneArr;
          this.colorZoneArr = [];
          break;

        }
        case 'imez_xx': {

          _.each(this.mapComp.mapComposition.imez_xx.zonaA, function (bb: any) { nacZonaAObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.imez_xx.zonaB, function (bb: any) { nacZonaBObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.imez_xx.zonaC, function (bb: any) { nacZonaCObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.imez_xx.zonaD, function (bb: any) { nacZonaDObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.imez_xx.zonaE, function (bb: any) { nacZonaEObj[bb.feature] = true; });

          const nacZonaA = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacZonaAObj[myval.lugar_muerte] &&
            myval.sexo === 'F';
          }, this.mapComp.mapComposition.imez_xx.zonaA).length;
          const nacZonaB = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacZonaBObj[myval.lugar_muerte] &&
            myval.sexo === 'F';
          }, this.mapComp.mapComposition.imez_xx.zonaB).length;
          const nacZonaC = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacZonaCObj[myval.lugar_muerte] &&
            myval.sexo === 'F';
          }, this.mapComp.mapComposition.imez_xx.zonaC).length;
          const nacZonaD = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacZonaDObj[myval.lugar_muerte] &&
            myval.sexo === 'F';
          }, this.mapComp.mapComposition.imez_xx.zonaD).length;
          const nacZonaE = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacZonaEObj[myval.lugar_muerte] &&
            myval.sexo === 'F';
          }, this.mapComp.mapComposition.imez_xx.zonaE).length;

          this.nacZoneArr.push(nacZonaA);
          this.nacZoneArr.push(nacZonaB);
          this.nacZoneArr.push(nacZonaC);
          this.nacZoneArr.push(nacZonaD);
          this.nacZoneArr.push(nacZonaE);

          const getPieLabels = _.keys(this.mapComp.mapComposition.imez_xx);
          getPieLabels.forEach(element => {
            this.pieZoneChartLabels.push(element);
          });

          const getColors: string[] = ['#F26D78', '#F2DB94', '#F2E9BD', '#9EBF95', '#435951'];
          getColors.forEach(color => { this.colorZoneArr.push(color); });

          this.pieZoneChartData = this.nacZoneArr;
          this.colorZoneArr = [];
          break;

        }
        case 'imiz_xix': {

          _.each(this.mapComp.mapComposition.imiz_xix.zonaA, function (bb: any) { nacZonaAObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.imiz_xix.zonaB, function (bb: any) { nacZonaBObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.imiz_xix.zonaC, function (bb: any) { nacZonaCObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.imiz_xix.zonaD, function (bb: any) { nacZonaDObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.imiz_xix.zonaE, function (bb: any) { nacZonaEObj[bb.feature] = true; });

          const nacZonaA = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacZonaAObj[myval.lugar_nacimiento] &&
             myval.sexo === 'F'
             && myval.ano_nacimiento < 1900;
          }, this.mapComp.mapComposition.imiz_xix.zonaA).length;
          const nacZonaB = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacZonaBObj[myval.lugar_nacimiento] &&
             myval.sexo === 'F'
             && myval.ano_nacimiento < 1900;
          }, this.mapComp.mapComposition.imiz_xix.zonaB).length;
          const nacZonaC = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacZonaCObj[myval.lugar_nacimiento] &&
             myval.sexo === 'F'
             && myval.ano_nacimiento < 1900;
          }, this.mapComp.mapComposition.imiz_xix.zonaC).length;
          const nacZonaD = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacZonaDObj[myval.lugar_nacimiento] &&
             myval.sexo === 'F'
             && myval.ano_nacimiento < 1900;
          }, this.mapComp.mapComposition.imiz_xix.zonaD).length;
          const nacZonaE = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacZonaEObj[myval.lugar_nacimiento] &&
             myval.sexo === 'F'
             && myval.ano_nacimiento < 1900;
          }, this.mapComp.mapComposition.imiz_xix.zonaD).length;

          this.nacZoneArr.push(nacZonaA);
          this.nacZoneArr.push(nacZonaB);
          this.nacZoneArr.push(nacZonaC);
          this.nacZoneArr.push(nacZonaD);
          this.nacZoneArr.push(nacZonaE);

          const getPieLabels = _.keys(this.mapComp.mapComposition.imiz_xix);
          getPieLabels.forEach(element => {
            this.pieZoneChartLabels.push(element);
          });

          const getColors: string[] = ['#F26D78', '#F2DB94', '#F2E9BD', '#9EBF95', '#435951'];
          getColors.forEach(color => { this.colorZoneArr.push(color); });

          this.pieZoneChartData = this.nacZoneArr;
          this.colorZoneArr = [];
          break;

        }
        case 'imiz_xx': {
          _.each(this.mapComp.mapComposition.imiz_xix.zonaA, function (bb: any) { nacZonaAObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.imiz_xix.zonaB, function (bb: any) { nacZonaBObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.imiz_xix.zonaC, function (bb: any) { nacZonaCObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.imiz_xix.zonaD, function (bb: any) { nacZonaDObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.imiz_xix.zonaE, function (bb: any) { nacZonaEObj[bb.feature] = true; });

          const nacZonaA = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacZonaAObj[myval.lugar_nacimiento] &&
             myval.sexo === 'F';
          }, this.mapComp.mapComposition.imiz_xix.zonaA).length;
          const nacZonaB = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacZonaBObj[myval.lugar_nacimiento] &&
             myval.sexo === 'F';
          }, this.mapComp.mapComposition.imiz_xix.zonaB).length;
          const nacZonaC = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacZonaCObj[myval.lugar_nacimiento] &&
             myval.sexo === 'F';
          }, this.mapComp.mapComposition.imiz_xix.zonaC).length;
          const nacZonaD = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacZonaDObj[myval.lugar_nacimiento] &&
             myval.sexo === 'F';
          }, this.mapComp.mapComposition.imiz_xix.zonaD).length;
          const nacZonaE = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacZonaEObj[myval.lugar_nacimiento] &&
             myval.sexo === 'F';
          }, this.mapComp.mapComposition.imiz_xix.zonaD).length;

          this.nacZoneArr.push(nacZonaA);
          this.nacZoneArr.push(nacZonaB);
          this.nacZoneArr.push(nacZonaC);
          this.nacZoneArr.push(nacZonaD);
          this.nacZoneArr.push(nacZonaE);

          const getPieLabels = _.keys(this.mapComp.mapComposition.imiz_xix);
          getPieLabels.forEach(element => {
            this.pieZoneChartLabels.push(element);
          });

          const getColors: string[] = ['#F26D78', '#F2DB94', '#F2E9BD', '#9EBF95', '#435951'];
          getColors.forEach(color => { this.colorZoneArr.push(color); });

          this.pieZoneChartData = this.nacZoneArr;
          this.colorZoneArr = [];
          break;

        }

      }

    } else if (data.mapType === 2) {

      console.log(data.mapType);
      this.raChart = false;
      this.rdChart = false;
      this.zoneChart = false;
      this.contChart = true;

      this.nacContArr = [];
      this.pieContChartLabels = [];

      switch (data.graphType) {
        case 'igec_xix': {
          // ic: international composition
          _.each(this.mapComp.mapComposition.ic.Africa, function (bb: any) { nacAfObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.ic.America_Central, function (bb: any) { nacAceObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.ic.America_de_Norte, function (bb: any) { nacAnoObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.ic.America_del_Sur, function (bb: any) { nacAsuObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.ic.Asia, function (bb: any) { nacAsObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.ic.Europa, function (bb: any) { nacEuObj[bb.feature] = true; });

          const nacAf = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacAfObj[myval.region_Amplia_Fall] && myval.ano_nacimiento < 1900 && myval.ni_nac === 'Nacional';
          }, this.mapComp.mapComposition.ic.Africa).length;

          const nacAce = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacAceObj[myval.region_Amplia_Fall] && myval.ano_nacimiento < 1900 && myval.ni_nac === 'Nacional';
          }, this.mapComp.mapComposition.ic.America_Central).length;

          const nacAno = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacAnoObj[myval.region_Amplia_Fall] && myval.ano_nacimiento < 1900 && myval.ni_nac === 'Nacional';
          }, this.mapComp.mapComposition.ic.America_de_Norte).length;

          const Asu = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacAsuObj[myval.region_Amplia_Fall] && myval.ano_nacimiento < 1900 && myval.ni_nac === 'Nacional';
          }, this.mapComp.mapComposition.ic.America_del_Sur).length;

          const nacAs = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacAsObj[myval.region_Amplia_Fall] && myval.ano_nacimiento < 1900 && myval.ni_nac === 'Nacional';
          }, this.mapComp.mapComposition.ic.Asia).length;

          const nacEu = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacEuObj[myval.region_Amplia_Fall] && myval.ano_nacimiento < 1900 && myval.ni_nac === 'Nacional';
          }, this.mapComp.mapComposition.ic.Europa).length;

          this.nacContArr.push(nacAf);
          this.nacContArr.push(nacAce);
          this.nacContArr.push(nacAno);
          this.nacContArr.push(Asu);
          this.nacContArr.push(nacAs);
          this.nacContArr.push(nacEu);

          const getPieLabels = _.keys(this.mapComp.mapComposition.ic);
          getPieLabels.forEach(element => {
            this.pieContChartLabels.push(element);
          });

          const getColors: string[] = ['#F26D78', '#F2DB94', '#F2E9BD', '#9EBF95', '#435951', '#92c5de'];
          getColors.forEach(color => { this.colorContArr.push(color); });

          this.pieContChartData = this.nacContArr;
          this.colorContArr = [];
          break;

        }
        case 'igec_xx': {

          // ic: international composition
          _.each(this.mapComp.mapComposition.ic.Africa, function (bb: any) { nacAfObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.ic.America_Central, function (bb: any) { nacAceObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.ic.America_de_Norte, function (bb: any) { nacAnoObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.ic.America_del_Sur, function (bb: any) { nacAsuObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.ic.Asia, function (bb: any) { nacAsObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.ic.Europa, function (bb: any) { nacEuObj[bb.feature] = true; });

          const nacAf = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacAfObj[myval.region_Amplia_Fall] && myval.ni_nac === 'Nacional';
          }, this.mapComp.mapComposition.ic.Africa).length;

          const nacAce = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacAceObj[myval.region_Amplia_Fall] && myval.ni_nac === 'Nacional';
          }, this.mapComp.mapComposition.ic.America_Central).length;

          const nacAno = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacAnoObj[myval.region_Amplia_Fall] && myval.ni_nac === 'Nacional';
          }, this.mapComp.mapComposition.ic.America_de_Norte).length;

          const Asu = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacAsuObj[myval.region_Amplia_Fall] && myval.ni_nac === 'Nacional';
          }, this.mapComp.mapComposition.ic.America_del_Sur).length;

          const nacAs = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacAsObj[myval.region_Amplia_Fall] && myval.ni_nac === 'Nacional';
          }, this.mapComp.mapComposition.ic.Asia).length;

          const nacEu = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacEuObj[myval.region_Amplia_Fall] && myval.ni_nac === 'Nacional';
          }, this.mapComp.mapComposition.ic.Europa).length;

          this.nacContArr.push(nacAf);
          this.nacContArr.push(nacAce);
          this.nacContArr.push(nacAno);
          this.nacContArr.push(Asu);
          this.nacContArr.push(nacAs);
          this.nacContArr.push(nacEu);

          const getPieLabels = _.keys(this.mapComp.mapComposition.ic);
          getPieLabels.forEach(element => {
            this.pieContChartLabels.push(element);
          });

          const getColors: string[] = ['#F26D78', '#F2DB94', '#F2E9BD', '#9EBF95', '#435951', '#92c5de'];
          getColors.forEach(color => { this.colorContArr.push(color); });

          this.pieContChartData = this.nacContArr;
          this.colorContArr = [];
          break;

        }
        case 'igic_xix': {

          // ic: international composition
          _.each(this.mapComp.mapComposition.ic.Africa, function (bb: any) { nacAfObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.ic.America_Central, function (bb: any) { nacAceObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.ic.America_de_Norte, function (bb: any) { nacAnoObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.ic.America_del_Sur, function (bb: any) { nacAsuObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.ic.Asia, function (bb: any) { nacAsObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.ic.Europa, function (bb: any) { nacEuObj[bb.feature] = true; });

          const nacAf = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacAfObj[myval.region_Amplia_Nac] && myval.ano_nacimiento < 1900;
          }, this.mapComp.mapComposition.ic.Africa).length;

          const nacAce = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacAceObj[myval.region_Amplia_Nac] && myval.ano_nacimiento < 1900;
          }, this.mapComp.mapComposition.ic.America_Central).length;

          const nacAno = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacAnoObj[myval.region_Amplia_Nac] && myval.ano_nacimiento < 1900;
          }, this.mapComp.mapComposition.ic.America_de_Norte).length;

          const Asu = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacAsuObj[myval.region_Amplia_Nac] && myval.ano_nacimiento < 1900;
          }, this.mapComp.mapComposition.ic.America_del_Sur).length;

          const nacAs = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacAsObj[myval.region_Amplia_Nac] && myval.ano_nacimiento < 1900;
          }, this.mapComp.mapComposition.ic.Asia).length;

          const nacEu = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacEuObj[myval.region_Amplia_Nac] && myval.ano_nacimiento < 1900;
          }, this.mapComp.mapComposition.ic.Europa).length;

          this.nacContArr.push(nacAf);
          this.nacContArr.push(nacAce);
          this.nacContArr.push(nacAno);
          this.nacContArr.push(Asu);
          this.nacContArr.push(nacAs);
          this.nacContArr.push(nacEu);

          const getPieLabels = _.keys(this.mapComp.mapComposition.ic);
          getPieLabels.forEach(element => {
            this.pieContChartLabels.push(element);
          });

          const getColors: string[] = ['#F26D78', '#F2DB94', '#F2E9BD', '#9EBF95', '#435951', '#92c5de'];
          getColors.forEach(color => { this.colorContArr.push(color); });

          this.pieContChartData = this.nacContArr;
          this.colorContArr = [];
          break;
        }
        case 'igic_xx': {
          // ic: international composition
          _.each(this.mapComp.mapComposition.ic.Africa, function (bb: any) { nacAfObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.ic.America_Central, function (bb: any) { nacAceObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.ic.America_de_Norte, function (bb: any) { nacAnoObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.ic.America_del_Sur, function (bb: any) { nacAsuObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.ic.Asia, function (bb: any) { nacAsObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.ic.Europa, function (bb: any) { nacEuObj[bb.feature] = true; });

          const nacAf = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacAfObj[myval.region_Amplia_Nac];
          }, this.mapComp.mapComposition.ic.Africa).length;

          const nacAce = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacAceObj[myval.region_Amplia_Nac];
          }, this.mapComp.mapComposition.ic.America_Central).length;

          const nacAno = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacAnoObj[myval.region_Amplia_Nac];
          }, this.mapComp.mapComposition.ic.America_de_Norte).length;

          const Asu = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacAsuObj[myval.region_Amplia_Nac];
          }, this.mapComp.mapComposition.ic.America_del_Sur).length;

          const nacAs = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacAsObj[myval.region_Amplia_Nac];
          }, this.mapComp.mapComposition.ic.Asia).length;

          const nacEu = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacEuObj[myval.region_Amplia_Nac];
          }, this.mapComp.mapComposition.ic.Europa).length;

          this.nacContArr.push(nacAf);
          this.nacContArr.push(nacAce);
          this.nacContArr.push(nacAno);
          this.nacContArr.push(Asu);
          this.nacContArr.push(nacAs);
          this.nacContArr.push(nacEu);

          const getPieLabels = _.keys(this.mapComp.mapComposition.ic);
          getPieLabels.forEach(element => {
            this.pieContChartLabels.push(element);
          });

          const getColors: string[] = ['#F26D78', '#F2DB94', '#F2E9BD', '#9EBF95', '#435951', '#92c5de'];
          getColors.forEach(color => { this.colorContArr.push(color); });

          this.pieContChartData = this.nacContArr;
          this.colorContArr = [];
          break;
        }
        case 'imec_xix': {
          // ic: international composition
          _.each(this.mapComp.mapComposition.ic.Africa, function (bb: any) { nacAfObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.ic.America_Central, function (bb: any) { nacAceObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.ic.America_de_Norte, function (bb: any) { nacAnoObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.ic.America_del_Sur, function (bb: any) { nacAsuObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.ic.Asia, function (bb: any) { nacAsObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.ic.Europa, function (bb: any) { nacEuObj[bb.feature] = true; });

          const nacAf = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacAfObj[myval.region_Amplia_Fall] &&
            myval.ni_nac === 'Nacional' &&
            myval.sexo === 'F' &&
            myval.ano_nacimiento < 1900;
          }, this.mapComp.mapComposition.ic.Africa).length;

          const nacAce = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacAceObj[myval.region_Amplia_Fall] &&
            myval.ni_nac === 'Nacional' &&
            myval.sexo === 'F' &&
            myval.ano_nacimiento < 1900;
          }, this.mapComp.mapComposition.ic.America_Central).length;

          const nacAno = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacAnoObj[myval.region_Amplia_Fall] &&
            myval.ni_nac === 'Nacional' &&
            myval.sexo === 'F' &&
            myval.ano_nacimiento < 1900;
          }, this.mapComp.mapComposition.ic.America_de_Norte).length;

          const Asu = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacAsuObj[myval.region_Amplia_Fall] &&
            myval.ni_nac === 'Nacional' &&
            myval.sexo === 'F' &&
            myval.ano_nacimiento < 1900;
          }, this.mapComp.mapComposition.ic.America_del_Sur).length;

          const nacAs = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacAsObj[myval.region_Amplia_Fall] &&
            myval.ni_nac === 'Nacional' &&
            myval.sexo === 'F' &&
            myval.ano_nacimiento < 1900;
          }, this.mapComp.mapComposition.ic.Asia).length;

          const nacEu = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacEuObj[myval.region_Amplia_Fall] &&
            myval.ni_nac === 'Nacional' &&
            myval.sexo === 'F' &&
            myval.ano_nacimiento < 1900;
          }, this.mapComp.mapComposition.ic.Europa).length;

          this.nacContArr.push(nacAf);
          this.nacContArr.push(nacAce);
          this.nacContArr.push(nacAno);
          this.nacContArr.push(Asu);
          this.nacContArr.push(nacAs);
          this.nacContArr.push(nacEu);

          const getPieLabels = _.keys(this.mapComp.mapComposition.ic);
          getPieLabels.forEach(element => {
            this.pieContChartLabels.push(element);
          });

          const getColors: string[] = ['#F26D78', '#F2DB94', '#F2E9BD', '#9EBF95', '#435951', '#92c5de'];
          getColors.forEach(color => { this.colorContArr.push(color); });

          this.pieContChartData = this.nacContArr;
          this.colorContArr = [];
          break;
        }
        case 'imec_xx': {
          // ic: international composition
          _.each(this.mapComp.mapComposition.ic.Africa, function (bb: any) { nacAfObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.ic.America_Central, function (bb: any) { nacAceObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.ic.America_de_Norte, function (bb: any) { nacAnoObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.ic.America_del_Sur, function (bb: any) { nacAsuObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.ic.Asia, function (bb: any) { nacAsObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.ic.Europa, function (bb: any) { nacEuObj[bb.feature] = true; });

          const nacAf = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacAfObj[myval.region_Amplia_Fall] &&
            myval.ni_nac === 'Nacional' &&
            myval.sexo === 'F';
          }, this.mapComp.mapComposition.ic.Africa).length;

          const nacAce = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacAceObj[myval.region_Amplia_Fall] &&
            myval.ni_nac === 'Nacional' &&
            myval.sexo === 'F';
          }, this.mapComp.mapComposition.ic.America_Central).length;

          const nacAno = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacAnoObj[myval.region_Amplia_Fall] &&
            myval.ni_nac === 'Nacional' &&
            myval.sexo === 'F';
          }, this.mapComp.mapComposition.ic.America_de_Norte).length;

          const Asu = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacAsuObj[myval.region_Amplia_Fall] &&
            myval.ni_nac === 'Nacional' &&
            myval.sexo === 'F';
          }, this.mapComp.mapComposition.ic.America_del_Sur).length;

          const nacAs = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacAsObj[myval.region_Amplia_Fall] &&
            myval.ni_nac === 'Nacional' &&
            myval.sexo === 'F';
          }, this.mapComp.mapComposition.ic.Asia).length;

          const nacEu = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacEuObj[myval.region_Amplia_Fall] &&
            myval.ni_nac === 'Nacional' &&
            myval.sexo === 'F';
          }, this.mapComp.mapComposition.ic.Europa).length;

          this.nacContArr.push(nacAf);
          this.nacContArr.push(nacAce);
          this.nacContArr.push(nacAno);
          this.nacContArr.push(Asu);
          this.nacContArr.push(nacAs);
          this.nacContArr.push(nacEu);

          const getPieLabels = _.keys(this.mapComp.mapComposition.ic);
          getPieLabels.forEach(element => {
            this.pieContChartLabels.push(element);
          });

          const getColors: string[] = ['#F26D78', '#F2DB94', '#F2E9BD', '#9EBF95', '#435951', '#92c5de'];
          getColors.forEach(color => { this.colorContArr.push(color); });

          this.pieContChartData = this.nacContArr;
          this.colorContArr = [];
          break;
        }
        case 'imic_xix': {
          // ic: international composition
          _.each(this.mapComp.mapComposition.ic.Africa, function (bb: any) { nacAfObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.ic.America_Central, function (bb: any) { nacAceObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.ic.America_de_Norte, function (bb: any) { nacAnoObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.ic.America_del_Sur, function (bb: any) { nacAsuObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.ic.Asia, function (bb: any) { nacAsObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.ic.Europa, function (bb: any) { nacEuObj[bb.feature] = true; });

          const nacAf = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacAfObj[myval.region_Amplia_Nac] &&
            myval.sexo === 'F' &&
            myval.ano_nacimiento < 1900;
          }, this.mapComp.mapComposition.ic.Africa).length;

          const nacAce = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacAceObj[myval.region_Amplia_Nac] &&
            myval.sexo === 'F' &&
            myval.ano_nacimiento < 1900;
          }, this.mapComp.mapComposition.ic.America_Central).length;

          const nacAno = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacAnoObj[myval.region_Amplia_Nac] &&
            myval.sexo === 'F' &&
            myval.ano_nacimiento < 1900;
          }, this.mapComp.mapComposition.ic.America_de_Norte).length;

          const Asu = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacAsuObj[myval.region_Amplia_Nac] &&
            myval.sexo === 'F' &&
            myval.ano_nacimiento < 1900;
          }, this.mapComp.mapComposition.ic.America_del_Sur).length;

          const nacAs = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacAsObj[myval.region_Amplia_Nac] &&
            myval.sexo === 'F' &&
            myval.ano_nacimiento < 1900;
          }, this.mapComp.mapComposition.ic.Asia).length;

          const nacEu = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacEuObj[myval.region_Amplia_Nac] &&
            myval.sexo === 'F' &&
            myval.ano_nacimiento < 1900;
          }, this.mapComp.mapComposition.ic.Europa).length;

          this.nacContArr.push(nacAf);
          this.nacContArr.push(nacAce);
          this.nacContArr.push(nacAno);
          this.nacContArr.push(Asu);
          this.nacContArr.push(nacAs);
          this.nacContArr.push(nacEu);

          const getPieLabels = _.keys(this.mapComp.mapComposition.ic);
          getPieLabels.forEach(element => {
            this.pieContChartLabels.push(element);
          });

          const getColors: string[] = ['#F26D78', '#F2DB94', '#F2E9BD', '#9EBF95', '#435951', '#92c5de'];
          getColors.forEach(color => { this.colorContArr.push(color); });

          this.pieContChartData = this.nacContArr;
          this.colorContArr = [];
          break;
        }
        case 'imic_xx': {
          // ic: international composition
          _.each(this.mapComp.mapComposition.ic.Africa, function (bb: any) { nacAfObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.ic.America_Central, function (bb: any) { nacAceObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.ic.America_de_Norte, function (bb: any) { nacAnoObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.ic.America_del_Sur, function (bb: any) { nacAsuObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.ic.Asia, function (bb: any) { nacAsObj[bb.feature] = true; });
          _.each(this.mapComp.mapComposition.ic.Europa, function (bb: any) { nacEuObj[bb.feature] = true; });

          const nacAf = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacAfObj[myval.region_Amplia_Nac] &&
            myval.sexo === 'F';
          }, this.mapComp.mapComposition.ic.Africa).length;

          const nacAce = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacAceObj[myval.region_Amplia_Nac] &&
            myval.sexo === 'F';
          }, this.mapComp.mapComposition.ic.America_Central).length;

          const nacAno = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacAnoObj[myval.region_Amplia_Nac] &&
            myval.sexo === 'F';
          }, this.mapComp.mapComposition.ic.America_de_Norte).length;

          const Asu = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacAsuObj[myval.region_Amplia_Nac] &&
            myval.sexo === 'F';
          }, this.mapComp.mapComposition.ic.America_del_Sur).length;

          const nacAs = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacAsObj[myval.region_Amplia_Nac] &&
            myval.sexo === 'F';
          }, this.mapComp.mapComposition.ic.Asia).length;

          const nacEu = _.filter(innerWriterPieArray, (myval: Writer) => {
            return nacEuObj[myval.region_Amplia_Nac] &&
            myval.sexo === 'F';
          }, this.mapComp.mapComposition.ic.Europa).length;

          this.nacContArr.push(nacAf);
          this.nacContArr.push(nacAce);
          this.nacContArr.push(nacAno);
          this.nacContArr.push(Asu);
          this.nacContArr.push(nacAs);
          this.nacContArr.push(nacEu);

          const getPieLabels = _.keys(this.mapComp.mapComposition.ic);
          getPieLabels.forEach(element => {
            this.pieContChartLabels.push(element);
          });

          const getColors: string[] = ['#F26D78', '#F2DB94', '#F2E9BD', '#9EBF95', '#435951', '#92c5de'];
          getColors.forEach(color => { this.colorContArr.push(color); });

          this.pieContChartData = this.nacContArr;
          this.colorContArr = [];
          break;
        }

      }


    }

  }

  drawIntCountryChart(graphType: string) {

    this.barCountryData = [];
    this.barCountryChartLabels.length = 0;
    this.barCountryChartData = [];

    const innerBarWriterArray = Object.assign({}, this.innerWriter);

    let countryIntEmiList: string[] = new Array;
    let countryIntInmiList: string[] = new Array;

    let countryArrayChartList: any[] = new Array;
    let countryCounter: any;

    // get all emigration countries
    countryIntEmiList = _.chain(innerBarWriterArray).map((w: Writer) => {
      if (w.ni_fall === 'Internacional') {
        return w.lugar_muerte;
      }
    }).uniq().value();
    countryIntEmiList.shift();

    // get all inmigration countries
    countryIntInmiList = _.chain(innerBarWriterArray).map((w: Writer) => {
      if (w.ni_nac === 'Internacional' && (w.lugar_nacimiento !== undefined || w.lugar_nacimiento !== null)) {
        return w.lugar_nacimiento;
      }
    }).uniq().value();
    countryIntInmiList.splice(2, 1);

    if (graphType === 'igez_xix' || graphType === 'igec_xix') {

      for (let i = 0; i < countryIntEmiList.length; i++) {
        countryCounter = _.countBy(innerBarWriterArray, (w: Writer) => {
          return w.lugar_muerte === countryIntEmiList[i] &&
            w.ano_nacimiento < 1900 &&
            w.ni_nac === 'Nacional';
        });

        countryArrayChartList.push({
          'state': countryIntEmiList[i],
          'birth': countryCounter.true === undefined ? 0 : countryCounter.true
        });
      }

    } else if (graphType === 'igez_xx' || graphType === 'igec_xx') {
      for (let i = 0; i < countryIntEmiList.length; i++) {
        countryCounter = _.countBy(innerBarWriterArray, (w: Writer) => {
          return w.lugar_muerte === countryIntEmiList[i] &&
            w.ni_nac === 'Nacional';
        });

        countryArrayChartList.push({
          'state': countryIntEmiList[i],
          'birth': countryCounter.true === undefined ? 0 : countryCounter.true
        });

      }
    } else if (graphType === 'igiz_xix' || graphType === 'igic_xix') {
      for (let i = 0; i < countryIntInmiList.length; i++) {
        countryCounter = _.countBy(innerBarWriterArray, (w: Writer) => {
          return w.lugar_nacimiento === countryIntInmiList[i] &&
            w.ano_nacimiento < 1900;
        });

        countryArrayChartList.push({
          'state': countryIntInmiList[i],
          'birth': countryCounter.true === undefined ? 0 : countryCounter.true
        });

      }
    } else if (graphType === 'igiz_xx' || graphType === 'igic_xx') {
      for (let i = 0; i < countryIntInmiList.length; i++) {
        countryCounter = _.countBy(innerBarWriterArray, (w: Writer) => {
          return w.lugar_nacimiento === countryIntInmiList[i];
        });

        countryArrayChartList.push({
          'state': countryIntInmiList[i],
          'birth': countryCounter.true === undefined ? 0 : countryCounter.true
        });

      }
    } else if (graphType === 'imez_xix' || graphType === 'imec_xix') {

      for (let i = 0; i < countryIntEmiList.length; i++) {
        countryCounter = _.countBy(innerBarWriterArray, (w: Writer) => {
          return w.lugar_muerte === countryIntEmiList[i] &&
            w.sexo === 'F' &&
            w.ano_nacimiento < 1900 &&
            w.ni_nac === 'Nacional';
        });

        countryArrayChartList.push({
          'state': countryIntEmiList[i],
          'birth': countryCounter.true === undefined ? 0 : countryCounter.true
        });
      }
    } else if (graphType === 'imez_xx' || graphType === 'imec_xx') {

      for (let i = 0; i < countryIntEmiList.length; i++) {
        countryCounter = _.countBy(innerBarWriterArray, (w: Writer) => {
          return w.lugar_muerte === countryIntEmiList[i] &&
            w.sexo === 'F' &&
            w.ni_nac === 'Nacional';
        });

        countryArrayChartList.push({
          'state': countryIntEmiList[i],
          'birth': countryCounter.true === undefined ? 0 : countryCounter.true
        });
      }
    } else if (graphType === 'imiz_xix' || graphType === 'imic_xix') {
      for (let i = 0; i < countryIntInmiList.length; i++) {
        countryCounter = _.countBy(innerBarWriterArray, (w: Writer) => {
          return w.lugar_nacimiento === countryIntInmiList[i] &&
            w.sexo === 'F' &&
            w.ano_nacimiento < 1900;
        });

        countryArrayChartList.push({
          'state': countryIntInmiList[i],
          'birth': countryCounter.true === undefined ? 0 : countryCounter.true
        });
      }
    } else if (graphType === 'imiz_xx' || graphType === 'imic_xx') {
      for (let i = 0; i < countryIntInmiList.length; i++) {
        countryCounter = _.countBy(innerBarWriterArray, (w: Writer) => {
          return w.lugar_nacimiento === countryIntInmiList[i] &&
            w.sexo === 'F';
        });

        countryArrayChartList.push({
          'state': countryIntInmiList[i],
          'birth': countryCounter.true === undefined ? 0 : countryCounter.true
        });
      }
    }

    countryArrayChartList = _.sortBy(countryArrayChartList, (chartList: any) => chartList.birth);

    this.barCountryLabels = _.map(countryArrayChartList, (chartList: any) => chartList.state);
    this.barCountryLabels.forEach(element => {
      this.barCountryChartLabels.push(element);
    });

    this.barCountryData = _.map(countryArrayChartList, (chartList: any) => chartList.birth);
    this.barCountryChartData = [
      { data: this.barCountryData, label: 'Nacimientos' }
    ];

  }

  drawIntLineChart(graphType: string) {

    this.proofLine = true;

    this.lblArray = [];
    let bValues = [];
    let dValues = [];
    this.bValues = [];
    this.dValues = [];
    this.bArray = [];
    this.dArray = [];
    let bCount: Dictionary<number>;
    let dCount: Dictionary<number>;

    const innerWriterLineArray = Object.assign({}, this.innerWriter);
    const minB = _.min(innerWriterLineArray, (w: Writer) => w.ano_nacimiento).ano_nacimiento;
    const maxB = _.max(innerWriterLineArray, (w: Writer) => w.ano_nacimiento).ano_nacimiento;
    const minProvD = Number(_.min(innerWriterLineArray, (w: Writer) => w.ano_muerte).ano_muerte);
    const maxProvD = Number(_.max(innerWriterLineArray, (w: Writer) => w.ano_muerte).ano_muerte);
    const minD = Math.floor(minProvD / 10) * 10;
    const maxD = Math.floor(maxProvD / 10) * 10;

    if (graphType === 'igez_xix' || graphType === 'igec_xix' || graphType === 'igez_xx' || graphType === 'igec_xx') {

      for (let currentDecade = minB; currentDecade <= maxD; currentDecade += 10) {
        const decadeEnd = currentDecade + 9;
        bCount = _.countBy(innerWriterLineArray, (w: Writer) => {
          return w.ano_nacimiento >= currentDecade &&
            w.ano_nacimiento <= decadeEnd &&
            w.ni_nac === 'Nacional' &&
            w.ni_fall === 'Internacional';
        });
        this.bArray.push({
          'decade': currentDecade,
          'births': bCount.true
        });

        dCount = _.countBy(innerWriterLineArray, (w: Writer) => {
          return w.ano_muerte >= currentDecade &&
            w.ano_muerte <= decadeEnd &&
            w.ni_nac === 'Nacional' &&
            w.ni_fall === 'Internacional';
        });
        this.dArray.push({
          'decade': currentDecade,
          'deaths': dCount.true
        });

        this.lblArray.push(currentDecade);
      }
    } else if (graphType === 'igiz_xix' || graphType === 'igic_xix' || graphType === 'igiz_xx' || graphType === 'igic_xx') {
      for (let currentDecade = minB; currentDecade <= maxD; currentDecade += 10) {
        const decadeEnd = currentDecade + 9;
        bCount = _.countBy(innerWriterLineArray, (w: Writer) => {
          return w.ano_nacimiento >= currentDecade &&
            w.ano_nacimiento <= decadeEnd &&
            w.ni_nac === 'Internacional' &&
            w.ni_fall === 'Nacional';
        });
        this.bArray.push({
          'decade': currentDecade,
          'births': bCount.true
        });

        dCount = _.countBy(innerWriterLineArray, (w: Writer) => {
          return w.ano_muerte >= currentDecade &&
            w.ano_muerte <= decadeEnd &&
            w.ni_nac === 'Internacional' &&
            w.ni_fall === 'Nacional';
        });
        this.dArray.push({
          'decade': currentDecade,
          'deaths': dCount.true
        });

        this.lblArray.push(currentDecade);
      }
    } else if (graphType === 'imez_xix' || graphType === 'imec_xix' || graphType === 'imez_xx' || graphType === 'imec_xx') {

      for (let currentDecade = minB; currentDecade <= maxD; currentDecade += 10) {
        const decadeEnd = currentDecade + 9;
        bCount = _.countBy(innerWriterLineArray, (w: Writer) => {
          return w.ano_nacimiento >= currentDecade &&
            w.ano_nacimiento <= decadeEnd &&
            w.sexo === 'F' &&
            w.ni_nac === 'Nacional' &&
            w.ni_fall === 'Internacional';
        });
        this.bArray.push({
          'decade': currentDecade,
          'births': bCount.true
        });

        dCount = _.countBy(innerWriterLineArray, (w: Writer) => {
          return w.ano_muerte >= currentDecade &&
            w.ano_muerte <= decadeEnd &&
            w.sexo === 'F' &&
            w.ni_nac === 'Nacional' &&
            w.ni_fall === 'Internacional';
        });
        this.dArray.push({
          'decade': currentDecade,
          'deaths': dCount.true
        });

        this.lblArray.push(currentDecade);
      }

    } else if (graphType === 'imiz_xix' || graphType === 'imic_xix' || graphType === 'imiz_xx' || graphType === 'imic_xx') {
      for (let currentDecade = minB; currentDecade <= maxD; currentDecade += 10) {
        const decadeEnd = currentDecade + 9;
        bCount = _.countBy(innerWriterLineArray, (w: Writer) => {
          return w.ano_nacimiento >= currentDecade &&
            w.ano_nacimiento <= decadeEnd &&
            w.sexo === 'F' &&
            w.ni_nac === 'Internacional' &&
            w.ni_fall === 'Nacional';
        });
        this.bArray.push({
          'decade': currentDecade,
          'births': bCount.true
        });

        dCount = _.countBy(innerWriterLineArray, (w: Writer) => {
          return w.ano_muerte >= currentDecade &&
            w.ano_muerte <= decadeEnd &&
            w.sexo === 'F' &&
            w.ni_nac === 'Internacional' &&
            w.ni_fall === 'Nacional';
        });
        this.dArray.push({
          'decade': currentDecade,
          'deaths': dCount.true
        });

        this.lblArray.push(currentDecade);
      }
    }

    bValues = _.map(this.bArray, (o) => o.births === undefined ? 0 : o.births);
    dValues = _.map(this.dArray, (o) => o.deaths === undefined ? 0 : o.deaths);
    this.bValues = bValues;
    this.dValues = dValues;
    this.chartLineData = [
      { data: this.bValues, label: 'Nacimientos' },
      { data: this.dValues, label: 'Fallecimientos' }
    ];
    this.chartLineLabels = this.lblArray;

  }

  // Chart Events Functions
  // pie hart Events
  chartPieClicked(e: any): void {
    console.log(e);
  }

  chartPieHovered(e: any): void {
    console.log(e);
  }

  // Line Chart Evvents
  onLineChartClick(event) {
    console.log(event);
  }

  // BAR char events
  chartBarClicked(e: any): void {
    console.log(e);
  }

  chartBarHovered(e: any): void {
    console.log(e);
  }









}
