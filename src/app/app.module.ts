import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
//DTP used from https://github.com/dalelotts/angular-bootstrap-datetimepicker

import { ChartModule, HIGHCHARTS_MODULES } from "angular-highcharts";
import * as more from "highcharts/highcharts-more.src";
import * as exporting from "highcharts/modules/exporting.src";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { SessionService } from "./session.service";
import { IntervalService } from "./interval.service";
import { RESTService } from "./rest.service";
import { EncDecService } from "./enc-dec.service";
import { LoginComponent } from "./login/login.component";
import { IndexComponent } from "./index/index.component";
import { AddsupplierComponent } from "./addsupplier/addsupplier.component";
import { AddclientComponent } from "./addclient/addclient.component";
import { AddcustomerComponent } from "./addcustomer/addcustomer.component";
import { ViewclientComponent } from "./viewclient/viewclient.component";
import { ViewsupplierComponent } from "./viewsupplier/viewsupplier.component";
import { ViewcustomerComponent } from "./viewcustomer/viewcustomer.component";
// import { SearchclientPipe } from "./searchclient.pipe";
import { AddproductComponent } from "./addproduct/addproduct.component";
import { ViewproductComponent } from "./viewproduct/viewproduct.component";
import { AddtransportComponent } from "./addtransport/addtransport.component";
import { ViewtransportComponent } from "./viewtransport/viewtransport.component";
import { AddtruckComponent } from "./addtruck/addtruck.component";
import { ViewtrucksComponent } from "./viewtrucks/viewtrucks.component";
import { SearchtruckPipe } from "./searchtruck.pipe";
import { AddrawmaterialComponent } from "./addrawmaterial/addrawmaterial.component";
import { PurchaserawmaterialComponent } from "./purchaserawmaterial/purchaserawmaterial.component";
import { AssignrawmatprodComponent } from "./assignrawmatprod/assignrawmatprod.component";
import { AddbatchComponent } from "./addbatch/addbatch.component";
import { NeworderComponent } from "./neworder/neworder.component";
import { DispatchesComponent } from "./dispatches/dispatches.component";
import { RepsallstocksComponent } from "./repsallstocks/repsallstocks.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { EditclientComponent } from "./editclient/editclient.component";
import { ChangepassComponent } from "./changepass/changepass.component";
import { ViewpurchasesComponent } from "./viewpurchases/viewpurchases.component";
import { ViewbatchComponent } from './viewbatch/viewbatch.component';
import { PurchasepaymentsComponent } from './purchasepayments/purchasepayments.component';
import { AddpaymodeComponent } from './addpaymode/addpaymode.component';
import { ViewordersComponent } from './vieworders/vieworders.component';
import { EditorderComponent } from './editorder/editorder.component';
import { FinanyrordersComponent } from './finanyrorders/finanyrorders.component';
import { SalepaymentsComponent } from './salepayments/salepayments.component';
import { TaxinvoiceComponent } from './taxinvoice/taxinvoice.component';
import { ViewtaxinvoicesComponent } from './viewtaxinvoices/viewtaxinvoices.component';
import { AddclientopenbalComponent } from './addclientopenbal/addclientopenbal.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { AddhistoricbatchComponent } from './addhistoricbatch/addhistoricbatch.component';
import { AddwastageComponent } from './addwastage/addwastage.component';
import { PurchasepayhistoryComponent } from './purchasepayhistory/purchasepayhistory.component';
import { SalespayhistoryComponent } from './salespayhistory/salespayhistory.component';
import { AddreprocessproductComponent } from './addreprocessproduct/addreprocessproduct.component';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { UnauthoriseduserComponent } from './unauthoriseduser/unauthoriseduser.component';
import { CompanyaddressComponent } from './companyaddress/companyaddress.component';
import { UpdatecompanyaddressComponent } from './updatecompanyaddress/updatecompanyaddress.component';
import { CreateaccountheadComponent } from './createaccounthead/createaccounthead.component';
import { ViewexpenditureComponent } from './viewexpenditure/viewexpenditure.component';
import { AddreceiptComponent } from './addreceipt/addreceipt.component';
import { ViewreceiptComponent } from './viewreceipt/viewreceipt.component';
import { ReportsModule } from './reports/reports.module';
import { ReportNavbarComponent } from './report-navbar/report-navbar.component';
import { EditstockComponent } from './editstock/editstock.component';
import { GeneralModule } from './general/general.module';
import { AccountsNavbarComponent } from './accounts-navbar/accounts-navbar.component';
import { AccountsModule } from './accounts/accounts/accounts.module';
import { CreatepersonalaccComponent } from './accounts/createpersonalacc/createpersonalacc.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    IndexComponent,
    AddsupplierComponent,
    AddclientComponent,
    AddcustomerComponent,
    ViewclientComponent,
    ViewsupplierComponent,
    ViewcustomerComponent,
    // SearchclientPipe,
    AddproductComponent,
    ViewproductComponent,
    AddtransportComponent,
    ViewtransportComponent,
    AddtruckComponent,
    ViewtrucksComponent,
    SearchtruckPipe,
    AddrawmaterialComponent,
    PurchaserawmaterialComponent,
    AssignrawmatprodComponent,
    AddbatchComponent,
    NeworderComponent,
    DispatchesComponent,
    RepsallstocksComponent,
    DashboardComponent,
    EditclientComponent,
    ChangepassComponent,
    ViewpurchasesComponent,
    ViewbatchComponent,
    PurchasepaymentsComponent,
    AddpaymodeComponent,
    ViewordersComponent,
    EditorderComponent,
    FinanyrordersComponent,
    SalepaymentsComponent,
    TaxinvoiceComponent,
    ViewtaxinvoicesComponent,
    AddclientopenbalComponent,
    PagenotfoundComponent,
    AddhistoricbatchComponent,
    AddwastageComponent,
    PurchasepayhistoryComponent,
    SalespayhistoryComponent,
    AddreprocessproductComponent,
    UnauthoriseduserComponent,
    CompanyaddressComponent,
    UpdatecompanyaddressComponent,
    CreateaccountheadComponent,
    ViewexpenditureComponent,
    AddreceiptComponent,
    ViewreceiptComponent,
    ReportNavbarComponent,
    EditstockComponent,
    AccountsNavbarComponent,
    CreatepersonalaccComponent,
  ],
  imports: [
    BrowserModule,
    GeneralModule,  // This is a Generic module for all the common components to be shared between different modules
    ReportsModule,  // This Module should be loaded before App Routing as this module contains child routing
    AccountsModule,  // This Module should be loaded before App Routing as this module contains child routing
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ChartModule
  ],
  providers: [
    SessionService,
    IntervalService,
    RESTService,
    EncDecService,
    { provide: HIGHCHARTS_MODULES, useFactory: () => [more, exporting] }, // add as factory to your providers
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  entryComponents: [PurchasepayhistoryComponent, SalespayhistoryComponent, ViewexpenditureComponent, ViewreceiptComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
