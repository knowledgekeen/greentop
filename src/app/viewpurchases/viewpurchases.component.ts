import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver } from "@angular/core";
import { RESTService } from "../rest.service";
import { GlobalService } from "../global.service";
import { IntervalService } from "../interval.service";
import { Router } from "@angular/router";
import { PurchasepayhistoryComponent } from '../purchasepayhistory/purchasepayhistory.component';
import * as moment from "moment";

@Component({
  selector: "app-viewpurchases",
  templateUrl: "./viewpurchases.component.html",
  styleUrls: ["./viewpurchases.component.css"]
})
export class ViewpurchasesComponent implements OnInit {
  allpurchases: any = null;
  finanyr: any = null;
  fromdt: any = null;
  todt: any = null;
  customfrom: any = null;
  customto: any = null;
  monthlabel: string = "Full year";
  totalamt: number = 0;
  totalqty: number = 0;
  totalbags: number = 0;
  selectedpurchase: any = null;
  @ViewChild('purchasepayhistory', { read: ViewContainerRef }) entry: ViewContainerRef;

  constructor(
    private _rest: RESTService,
    private _interval: IntervalService,
    private _global: GlobalService,
    private _router: Router,
    private resolver: ComponentFactoryResolver
  ) { }

  ngOnInit() {
    this.finanyr = this._global.getCurrentFinancialYear();
    this.getFromToPurchases(this.finanyr.fromdt, this.finanyr.todt);
  }

  loadPurchasePaymentHistory(supplier) {
    this.entry.clear();
    const factory = this.resolver.resolveComponentFactory(PurchasepayhistoryComponent);
    const componentRef = this.entry.createComponent(factory);
    componentRef.instance.supplier = supplier;
  }

  openPurchHistoryModal(purch) {
    this.loadPurchasePaymentHistory(purch.clientid + "." + purch.name);
  }

  getFromToPurchases(fromdt, todt) {
    //console.log(fromdt, todt);
    this.allpurchases = null;
    let purchurl = "fromdt=" + fromdt + "&todt=" + todt;
    let totamt = 0;
    let totqty = 0;
    let totbags = 0;
    this._rest
      .getData("reports_purchases.php", "getFromToPurchases", purchurl)
      .subscribe(Response => {
        //console.table(Response);
        if (Response) {
          //console.log(Response["data"]);
          this.allpurchases = Response["data"];

          for (let i in this.allpurchases) {
            totamt += parseFloat(this.allpurchases[i].totalamount);
            let rawmatnm = this.allpurchases[i].rawmatname.toLowerCase();
            if (rawmatnm.indexOf("bag") > -1) {
              totbags += parseFloat(this.allpurchases[i].quantity);
            } else {
              totqty += parseFloat(this.allpurchases[i].quantity);
            }
          }
          //console.log("Bags", totbags);
          this.totalamt = totamt;
          this.totalqty = totqty;
          this.totalbags = totbags;
        }
      });
  }

  autofillfromdt() {
    this.fromdt = this._global.getAutofillFormattedDt(this.fromdt);
  }

  autofilltodt() {
    this.todt = this._global.getAutofillFormattedDt(this.todt);
  }

  filterData() {
    let myfromdate = moment(this.fromdt, "DD-MM-YYYY").format("MM-DD-YYYY");
    let fromtm = new Date(myfromdate).getTime();
    this.customfrom = fromtm;
    let mytodate = moment(this.todt, "DD-MM-YYYY").format("MM-DD-YYYY");
    let totm = new Date(mytodate).getTime();
    this.customto = totm;
    this.getFromToPurchases(fromtm, totm);
  }

  editPurchase(purch) {
    this._router.navigate(["/purchaserawmat", purch.purcmastid]);
  }

  viewPurchaseDetails(purch) {
    this.selectedpurchase = purch;
  }
}
