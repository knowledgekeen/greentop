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

  ngOnInit() {}

  getFromToPurchases(fromdt, todt) {
    //console.log(fromdt, todt);
    this.allpurchases = null;
    let purchurl = "fromdt=" + fromdt + "&todt=" + todt;
    let totamt = 0;
    let totqty = 0;
    this._rest
      .getData("reports_purchases.php", "getFromToPurchases", purchurl)
      .subscribe(Response => {
        //console.table(Response["data"]);
        if (Response) {
          //console.log(Response["data"]);
          this.allpurchases = Response["data"];

          for (let i in this.allpurchases) {
            totamt += parseFloat(this.allpurchases[i].totalamount);
            totqty += parseFloat(this.allpurchases[i].quantity);
          }
          this.totalamt = totamt;
          this.totalqty = totqty;
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
        let todt = new Date();
        let lastdt = new Date(
          todt.getFullYear(),
          todt.getMonth() + 1,
          0
        ).getTime();

        //If month from future show details of current month
        this.getFromToPurchases(fromdt, lastdt);
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
