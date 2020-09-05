import { Component, OnInit } from "@angular/core";
import { GlobalService } from "src/app/global.service";
import { RESTService } from "src/app/rest.service";
import * as moment from "moment";
import { IntervalService } from "src/app/interval.service";

@Component({
  selector: "app-monthwisepurchases",
  templateUrl: "./monthwisepurchases.component.html",
  styleUrls: ["./monthwisepurchases.component.css"],
})
export class MonthwisepurchasesComponent implements OnInit {
  finanyr: any = null;
  fromdt: any = null;
  todt: any = null;
  customfrom: any = null;
  customto: any = null;
  monthlabel: string = "Current Financial Year";
  allpurchases: any = null;
  finalquantity: number = 0;
  finalbillamt: number = 0;
  finalcgst: number = 0;
  finalsgst: number = 0;
  finaligst: number = 0;
  finalroundoff: number = 0;
  finaltotalgst: number = 0;
  finalgrandtotal: number = 0;
  totalretamt: number = 0;
  totalretqty: number = 0;
  grandtotalamt: number = 0;
  grandtotalqty: number = 0;
  showfilter: boolean = false;
  purchreturns: any = null;

  constructor(
    private _global: GlobalService,
    private _rest: RESTService,
    private _interval: IntervalService
  ) {}

  ngOnInit() {
    this.finanyr = this._global.getCurrentFinancialYear();
    this.getFromToPurchases(this.finanyr.fromdt, this.finanyr.todt);
  }

  getFromToPurchases(fromdt, todt) {
    this.finalquantity = 0;
    this.finalbillamt = 0;
    this.finalcgst = 0;
    this.finalsgst = 0;
    this.finaligst = 0;
    this.finalroundoff = 0;
    this.finaltotalgst = 0;
    this.finalgrandtotal = 0;
    this.totalretamt = 0;
    this.totalretqty = 0;

    this.allpurchases = null;
    let geturl = "fromdt=" + fromdt + "&todt=" + todt;
    //console.log(geturl);
    this._rest
      .getData("reports_purchases.php", "getFromToPurchases", geturl)
      .subscribe((Response) => {
        if (Response) {
          //console.log(Response["data"]);
          this.allpurchases = Response["data"];
          for (let i = 0; i < this.allpurchases.length; i++) {
            this.allpurchases[i].cgstinr =
              (this.allpurchases[i].cgst / 100) *
              (this.allpurchases[i].rate * this.allpurchases[i].quantity);
            this.allpurchases[i].sgstinr =
              (this.allpurchases[i].sgst / 100) *
              (this.allpurchases[i].rate * this.allpurchases[i].quantity);
            this.allpurchases[i].igstinr =
              (this.allpurchases[i].igst / 100) *
              (this.allpurchases[i].rate * this.allpurchases[i].quantity);
            this.allpurchases[i].totalgst =
              parseFloat(this.allpurchases[i].cgstinr) +
              parseFloat(this.allpurchases[i].sgstinr) +
              parseFloat(this.allpurchases[i].igstinr) +
              parseFloat(this.allpurchases[i].roundoff);
            this.allpurchases[i].rateofgst =
              parseFloat(this.allpurchases[i].cgst) +
              parseFloat(this.allpurchases[i].sgst) +
              parseFloat(this.allpurchases[i].igst);

            if (this.allpurchases[i].rawmatname != "HDPE Bags") {
              this.finalquantity += parseFloat(this.allpurchases[i].quantity);
            }

            this.finalbillamt +=
              parseFloat(this.allpurchases[i].rate) *
                parseFloat(this.allpurchases[i].quantity) -
              parseFloat(this.allpurchases[i].discount);
            this.finalcgst += parseFloat(this.allpurchases[i].cgstinr);
            this.finalsgst += parseFloat(this.allpurchases[i].sgstinr);
            this.finaligst += parseFloat(this.allpurchases[i].igstinr);
            this.finalroundoff += parseFloat(this.allpurchases[i].roundoff);
            this.finaltotalgst += parseFloat(this.allpurchases[i].totalgst);
            this.finalgrandtotal += parseFloat(
              this.allpurchases[i].totalamount
            );
          }
        }
      });

    this._rest
      .getData("reports_purchases.php", "getFromToPurchaseReturns", geturl)
      .subscribe((Resp) => {
        this.purchreturns = Resp && Resp["data"] ? Resp["data"] : null;
        for (let i in this.purchreturns) {
          this.totalretamt += parseFloat(this.purchreturns[i].amount);
          this.totalretqty += parseFloat(this.purchreturns[i].quantity);
        }
      });

    this._interval.settimer().then((tot) => {
      this.grandtotalamt = this.finalgrandtotal - this.totalretamt;
      this.grandtotalqty = this.finalquantity - this.totalretqty;
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
    this.finanyr = this._global.getSpecificFinancialYear(fromtm);
    this.getFromToPurchases(fromtm, totm);
    this.showfilter = false;
  }
}
