import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonthwisepurchasesComponent } from './monthwisepurchases/monthwisepurchases.component';
import { ReportRoutingModule } from './report-routing.module';
import { FormsModule } from '@angular/forms';
import { AllsalesComponent } from './allsales/allsales.component';
import { PrintdocComponent } from './printdoc/printdoc.component';
import { PrintsaleinvoiceComponent } from './printsaleinvoice/printsaleinvoice.component';
import { LetterheadComponent } from '../letterhead/letterhead.component';
import { SearchdispatchchallanComponent } from './searchdispatchchallan/searchdispatchchallan.component';
import { PrintdispatchchallanComponent } from './printdispatchchallan/printdispatchchallan.component';
import { SearchinvoiceComponent } from './searchinvoice/searchinvoice.component';
import { SundrydebitorsComponent } from './sundrydebitors/sundrydebitors.component';
import { SundrycreditorsComponent } from './sundrycreditors/sundrycreditors.component';
import { BillsandcollectionComponent } from './billsandcollection/billsandcollection.component';
import { LedgersalesComponent } from './ledgersales/ledgersales.component';
import { GeneralModule } from '../general/general.module';
import { SearchclientPipe } from '../searchclient.pipe';
import { LedgerpurchaseComponent } from './ledgerpurchase/ledgerpurchase.component';
import { DistrictwisesalesComponent } from './districtwisesales/districtwisesales.component';

@NgModule({
  declarations: [
    MonthwisepurchasesComponent,
    AllsalesComponent,
    PrintdocComponent,
    PrintsaleinvoiceComponent,
    LetterheadComponent,
    SearchinvoiceComponent,
    SearchdispatchchallanComponent,
    PrintdispatchchallanComponent,
    SundrydebitorsComponent,
    SundrycreditorsComponent,
    BillsandcollectionComponent,
    LedgersalesComponent,
    LedgerpurchaseComponent,
    DistrictwisesalesComponent
  ],
  imports: [
    GeneralModule,
    CommonModule,
    ReportRoutingModule,
    FormsModule
  ]
})
export class ReportsModule { }
