import { Component, OnInit } from "@angular/core";
import { RESTService } from "../rest.service";
import { GlobalService } from "../global.service";
import { IntervalService } from "../interval.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-viewpurchases",
  templateUrl: "./viewpurchases.component.html",
  styleUrls: ["./viewpurchases.component.css"]
})
export class ViewpurchasesComponent implements OnInit {
  allpurchases: any = null;
  opendtp: boolean = false;
  selectedDate: any = new Date();
  errorMsg: any = false;
  totalamt: number = 0;
  totalqty: number = 0;
  selectedpurchase: any = null;

  constructor(
    private _rest: RESTService,
    private _interval: IntervalService,
    private _global: GlobalService,
    private _router: Router
  ) {}

  ngOnInit() {
    let fromdt: any = new Date();
    fromdt.setDate(1);
    fromdt = fromdt.getTime();
    let todt = new Date().getTime();
    this.getFromToPurchases(fromdt, todt);
    //console.log(this._global.getCurrentFinancialYear());
  }

  getFromToPurchases(fromdt, todt) {
    //console.log(fromdt, todt);
    this.allpurchases = null;
    let purchurl = "fromdt=" + fromdt + "&todt=" + todt;

    this._rest
      .getData("reports_purchases.php", "getFromToPurchases", purchurl)
      .subscribe(Response => {
        //console.table(Response["data"]);
        if (Response) {
          //console.log(Response["data"]);
          this.allpurchases = Response["data"];

          for (let i in this.allpurchases) {
            this.totalamt += parseFloat(this.allpurchases[i].totalamount);
            this.totalqty += parseFloat(this.allpurchases[i].quantity);
          }
        }
      });
  }

  toggleDTP() {
    this.opendtp = !this.opendtp;
  }

  changeDate() {
    if (this.selectedDate) {
      //console.log(this.selectedDate.getTime());
      let todaydt = new Date().getTime();
      if (this.selectedDate.getTime() > todaydt) {
        let fromdt: any = new Date();
        fromdt.setDate(1);
        fromdt = fromdt.getTime();
        let todt = new Date().getTime();
        //If month from future show details of current month
        this.getFromToPurchases(fromdt, todt);
        this.errorMsg = "Month cannot be from future.";
        this.selectedDate.setTime(todaydt);
        this.opendtp = !this.opendtp;
        this._interval.settimer(null).then(Resp => {
          this.errorMsg = false;
        });
        return;
      } else {
        let dt = new Date();
        dt.setTime(this.selectedDate);
        let fromdt = this.selectedDate.getTime();
        let lastdt = new Date(dt.getFullYear(), dt.getMonth() + 1, 0).getTime();
        //console.log(fromdt, lastdt);
        this.getFromToPurchases(fromdt, lastdt);
        this.opendtp = !this.opendtp;
        return;
      }
    }
  }

  editPurchase(purch) {
    this._router.navigate(["/purchaserawmat", purch.purcmastid]);
    //[routerLink]="['/purchaserawmat', purch.purcmastid]"
  }

  viewPurchaseDetails(purch) {
    //console.log(purch);
    this.selectedpurchase = purch;
  }
}
