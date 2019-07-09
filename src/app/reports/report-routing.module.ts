import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MonthwisepurchasesComponent } from './monthwisepurchases/monthwisepurchases.component';
import { AllsalesComponent } from './allsales/allsales.component';

const secondaryRoutes: Routes = [
    { path: "monthwisepurchases", component: MonthwisepurchasesComponent },
    { path: "allsales", component: AllsalesComponent }
];

@NgModule({
    imports: [RouterModule.forChild(secondaryRoutes)],
    exports: [RouterModule]
})
export class ReportRoutingModule { }