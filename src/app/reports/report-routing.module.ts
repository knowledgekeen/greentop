import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MonthwisepurchasesComponent } from './monthwisepurchases/monthwisepurchases.component';
import { AllsalesComponent } from './allsales/allsales.component';
import { PrintsaleinvoiceComponent } from './printsaleinvoice/printsaleinvoice.component';
import { SearchinvoiceComponent } from '../searchinvoice/searchinvoice.component';
import { PrintdispatchchallanComponent } from './printdispatchchallan/printdispatchchallan.component';

const secondaryRoutes: Routes = [
    { path: "reports/monthwisepurchases", component: MonthwisepurchasesComponent },
    { path: "reports/allsales", component: AllsalesComponent },
    { path: "reports/printsaleinvoice/:invoiceno", component: PrintsaleinvoiceComponent },
    { path: "reports/searchinvoice", component: SearchinvoiceComponent },
    { path: "reports/printdispatchchallan", component: PrintdispatchchallanComponent },
];

@NgModule({
    imports: [RouterModule.forChild(secondaryRoutes)],
    exports: [RouterModule]
})
export class ReportRoutingModule { }