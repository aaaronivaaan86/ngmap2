import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

// DB modules
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFirestoreModule } from 'angularfire2/firestore';


// Map and Charts modules
import { AgmCoreModule } from '@agm/core';
import { ChartsModule } from 'ng2-charts';
import { Ng2SmartTableModule } from 'ng2-smart-table';

// enviroment
import { environment } from '../environments/environment';

// services
import { MapService } from './shared/services/map.service';
// App Components
import { AppComponent } from './app.component';
import { GeoComponent } from './geo/geo.component';
import { ChartsComponent } from './charts/charts.component';
import { WritersComponent } from './writers/writers.component';
import { ReplacePipe } from './writers/pipes/replace.pipe';
import { FooterComponent } from './footer/footer.component';



//   firebase.initializeApp(config);
@NgModule({
  declarations: [
    AppComponent,
    GeoComponent,
    ChartsComponent,
    WritersComponent,
    ReplacePipe,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.dbConfig),
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    ChartsModule,
    AgmCoreModule.forRoot({apiKey: environment.agmConfig.apiKey}),
    Ng2SmartTableModule
  ],
  providers: [MapService],
  bootstrap: [AppComponent]
})
export class AppModule { }
