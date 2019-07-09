import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonthwisepurchasesComponent } from './monthwisepurchases/monthwisepurchases.component';
import { ReportRoutingModule } from './report-routing.module';
import { FormsModule } from '@angular/forms';
import { AllsalesComponent } from './allsales/allsales.component';

@NgModule({
  declarations: [MonthwisepurchasesComponent, AllsalesComponent],
  imports: [
    CommonModule,
    ReportRoutingModule,
    FormsModule
  ]
})
export class ReportsModule { }
