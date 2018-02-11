import { Component, OnInit } from '@angular/core';
import { Writer } from '../shared/writer';
import { WriterServices } from '../shared/services/writers.service';

@Component({
  selector: 'app-writers',
  templateUrl: './writers.component.html',
  styleUrls: ['./writers.component.css'],
  providers: [WriterServices]
})
export class WritersComponent implements OnInit {

  writersArr: Writer[];
  showTable = false;
  loadingSrc = '../../assets/img/loading.gif';


  settings  = {
    actions: false,
    columns: {

      apellido: {
        title: 'Apellido'
      },
      nombre: {
        title: 'Nombre'
      },
      ano_nacimiento: {
        title: 'Año Nacimiento'
      },
      lugar_nacimiento: {
        title: 'Lugar de nacimiento'
      },
      region_Amplia_Nac: {
        title: 'Región amplia Nac'
      },
      region_Detallada_Nac: {
        title: 'Región Detallada Nac'
      },
      ano_muerte: {
        title: 'Año de fallecimiento'
      },
      region_Amplia_Fall: {
        title: 'Región amplia Fall'
      },
      region_Detallada_Fall: {
        title: 'Región Detallada Fall'
      },
      sexo: {
        title: 'Sexo'
      },
      localizacion: {
        title: 'Localizacion'
      }
    }
  };


  constructor(private _wS: WriterServices) { }

  ngOnInit() {
    // this.getWriters();

  }

  getWriters() {
    this.showTable = !this.showTable;
    this._wS.getWriters()
      .subscribe({
        next: (wData) => {
          this.writersArr = wData;
        }
      });
  }




















}
