import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { IndexComponent } from "./index/index.component";
import { AddsupplierComponent } from "./addsupplier/addsupplier.component";
import { AddcustomerComponent } from "./addcustomer/addcustomer.component";
import { ViewsupplierComponent } from "./viewsupplier/viewsupplier.component";
import { ViewcustomerComponent } from "./viewcustomer/viewcustomer.component";
import { AddproductComponent } from "./addproduct/addproduct.component";
import { AddtransportComponent } from "./addtransport/addtransport.component";
import { AddtruckComponent } from "./addtruck/addtruck.component";
import { AddrawmaterialComponent } from "./addrawmaterial/addrawmaterial.component";
import { PurchaserawmaterialComponent } from "./purchaserawmaterial/purchaserawmaterial.component";
import { AssignrawmatprodComponent } from "./assignrawmatprod/assignrawmatprod.component";
import { AddbatchComponent } from "./addbatch/addbatch.component";
import { NeworderComponent } from "./neworder/neworder.component";
import { DispatchesComponent } from "./dispatches/dispatches.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { EditclientComponent } from "./editclient/editclient.component";
import { ChangepassComponent } from "./changepass/changepass.component";
import { ViewpurchasesComponent } from "./viewpurchases/viewpurchases.component";
import { ViewbatchComponent } from "./viewbatch/viewbatch.component";
import { PurchasepaymentsComponent } from "./purchasepayments/purchasepayments.component";
import { AddpaymodeComponent } from "./addpaymode/addpaymode.component";
import { ViewordersComponent } from "./vieworders/vieworders.component";
import { EditorderComponent } from "./editorder/editorder.component";
import { SalepaymentsComponent } from "./salepayments/salepayments.component";
import { TaxinvoiceComponent } from "./taxinvoice/taxinvoice.component";
import { ViewtaxinvoicesComponent } from "./viewtaxinvoices/viewtaxinvoices.component";
import { AddclientopenbalComponent } from "./addclientopenbal/addclientopenbal.component";
import { PagenotfoundComponent } from "./pagenotfound/pagenotfound.component";
import { AddhistoricbatchComponent } from "./addhistoricbatch/addhistoricbatch.component";
import { AddwastageComponent } from "./addwastage/addwastage.component";
import { AddreprocessproductComponent } from './addreprocessproduct/addreprocessproduct.component';

const routes: Routes = [
  { path: "index", component: IndexComponent },
  { path: "login", component: LoginComponent },
  { path: "dashboard", component: DashboardComponent },
  { path: "addsupplier", component: AddsupplierComponent },
  { path: "addcustomer", component: AddcustomerComponent },
  { path: "addproduct", component: AddproductComponent },
  { path: "viewsupplier", component: ViewsupplierComponent },
  { path: "viewcustomer", component: ViewcustomerComponent },
  { path: "editclient/:clienttype/:clientid", component: EditclientComponent },
  { path: "addtransport", component: AddtransportComponent },
  { path: "addtruck", component: AddtruckComponent },
  { path: "addrawmat", component: AddrawmaterialComponent },
  {
    path: "purchaserawmat/:purcmastid",
    component: PurchaserawmaterialComponent
  },
  { path: "assignrawmatprod", component: AssignrawmatprodComponent },
  { path: "addbatch", component: AddbatchComponent },
  { path: "addwastage", component: AddwastageComponent },
  { path: "addreprocessing", component: AddreprocessproductComponent },
  { path: "addhistbatch", component: AddhistoricbatchComponent },
  { path: "viewbatch", component: ViewbatchComponent },
  { path: "neworder", component: NeworderComponent },
  { path: "dispatches", component: DispatchesComponent },
  { path: "changepwd", component: ChangepassComponent },
  { path: "viewpurchases", component: ViewpurchasesComponent },
  { path: "purchasepayments", component: PurchasepaymentsComponent },
  { path: "taxinvoice", component: TaxinvoiceComponent },
  { path: "salepayments", component: SalepaymentsComponent },
  { path: "addpaymode", component: AddpaymodeComponent },
  { path: "vieworders", component: ViewordersComponent },
  { path: "viewinvoices", component: ViewtaxinvoicesComponent },
  { path: "pagenotfound", component: PagenotfoundComponent },
  { path: "editorder/:orderid", component: EditorderComponent },
  { path: "addclientopenbal/:ctype", component: AddclientopenbalComponent },
  { path: "", redirectTo: "/index", pathMatch: "full" },
  { path: "**", redirectTo: "/pagenotfound", pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
