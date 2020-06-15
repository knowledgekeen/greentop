import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MonthwisepurchasesComponent } from './monthwisepurchases/monthwisepurchases.component';
import { AllsalesComponent } from './allsales/allsales.component';
import { PrintsaleinvoiceComponent } from './printsaleinvoice/printsaleinvoice.component';
import { PrintdispatchchallanComponent } from './printdispatchchallan/printdispatchchallan.component';
import { SearchinvoiceComponent } from './searchinvoice/searchinvoice.component';
import { SearchdispatchchallanComponent } from './searchdispatchchallan/searchdispatchchallan.component';
import { SundrydebitorsComponent } from './sundrydebitors/sundrydebitors.component';
import { SundrycreditorsComponent } from './sundrycreditors/sundrycreditors.component';

const secondaryRoutes: Routes = [
    { path: "reports/monthwisepurchases", component: MonthwisepurchasesComponent },
    { path: "reports/allsales", component: AllsalesComponent },
    { path: "reports/printsaleinvoice/:invoiceno", component: PrintsaleinvoiceComponent },
    { path: "reports/searchinvoice", component: SearchinvoiceComponent },
    { path: "reports/printdispatchchallan/:dcno/:orderno", component: PrintdispatchchallanComponent },
    { path: "reports/searchdc", component: SearchdispatchchallanComponent },
    { path: "reports/sundrydebt", component: SundrydebitorsComponent },
    { path: "reports/sundrycredit", component: SundrycreditorsComponent },
];

@NgModule({
    imports: [RouterModule.forChild(secondaryRoutes)],
    exports: [RouterModule]
})
export class ReportRoutingModule { }