import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { GlobalService } from "../global.service";
import { RESTService } from "../rest.service";
import * as moment from "moment";
import { CONSTANTS } from "../app.constants";
import { IntervalService } from "../interval.service";

@Component({
  selector: "app-purchasereturns",
  templateUrl: "./purchasereturns.component.html",
  styleUrls: ["./purchasereturns.component.css"],
})
export class PurchasereturnsComponent implements OnInit {
  purcmastid: string = null;
  debitnoteno: string = null;
  returnsdt: string = null;
  purchasedetails: any = null;
  quantity: string = null;
  amount: string = null;
  particulars: string = null;
  billno: string = null;
  name: string = null;
  rawmatname: string = null;
  stock: any = null;
  successmsg: boolean = false;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _global: GlobalService,
    private _rest: RESTService,
    private _interval: IntervalService
  ) {}

  ngOnInit(): void {
    this._route.params.subscribe((routes) => {
      console.log(routes);
      this.purcmastid =
        routes && routes.purcmastid
          ? routes.purcmastid
          : this._router.navigate(["/viewpurchases"]);
      this.getPurchaseDetails();
    });
  }

  autoFillReturnDt() {
    this.returnsdt = this._global.getAutofillFormattedDt(this.returnsdt);
  }

  getPurchaseDetails() {
    const geturl = `purcmastid=${this.purcmastid}`;
    this._rest
      .getData("rawmaterial.php", "getPurchaseDetails", geturl)
      .subscribe((Response) => {
        this.purchasedetails =
          Response && Response["data"]
            ? Response["data"][0]
            : this.noPurchaseDetails();
        console.log(this.purchasedetails);
        this.billno = this.purchasedetails.billno;
        this.name = this.purchasedetails.name;
        this.rawmatname = this.purchasedetails.rawmatname;
        this.getStockidFromRawMatId();
      });
  }

  getStockidFromRawMatId() {
    const geturl = `rawmatid=${this.purchasedetails.rawmatid}`;
    this._rest
      .getData("stock.php", "getStockidFromRawMatId", geturl)
      .subscribe((Response) => {
        this.stock = Response && Response["data"] ? Response["data"] : null;
        console.log("Stock", this.stock);
      });
  }

  addPurchaseReturns() {
    this.successmsg = false;
    let myDate = moment(this.returnsdt, "DD-MM-YYYY").format("MM-DD-YYYY");
    const purchreturns = {
      purcmastid: parseInt(this.purcmastid),
      debitnoteno: this.debitnoteno,
      returnsdate: new Date(myDate).getTime(),
      quantity: this.quantity,
      amount: this.amount,
      particulars: this.particulars,
    };

    this._rest
      .postData("rawmaterial.php", "addPurchaseReturns", purchreturns)
      .subscribe(
        (Response) => {
          this.updateStockQuantity().then((updstk) => {
            this.insertStockRegister().then((insstkreg) => {});
          });
        },
        (err) => {
          alert("Cannot add purchase returns, kindly try again later");
        }
      );
  }

  noPurchaseDetails() {
    alert("Cannot find purchase details, navigating back to view purchases");
    this._router.navigate(["/viewpurchases"]);
  }

  updateStockQuantity() {
    return new Promise((resolve, reject) => {
      const updatednewqty =
        parseFloat(this.stock.quantity) - parseFloat(this.quantity);
      const stkqtyobj = {
        stockid: this.stock.stockid,
        quantity: updatednewqty,
      };
      this._rest
        .postData("stock.php", "updateStockQuantity", stkqtyobj)
        .subscribe((UpdStk) => {
          resolve(UpdStk);
        });
    });
  }

  insertStockRegister() {
    let myDate = moment(this.returnsdt, "DD-MM-YYYY").format("MM-DD-YYYY");
    const stkhist = {
      stockid: this.stock.stockid,
      quantity: this.quantity,
      openbaldt: new Date(myDate).getTime(),
      INnOut: CONSTANTS.OUT,
      remarks: `${this.particulars} / Party: ${this.name} / Bill: ${this.billno}`,
    };
    return new Promise((resolve, reject) => {
      this._rest
        .postData("stock.php", "insertStockRegister", stkhist)
        .subscribe((Response) => {
          window.scrollTo(0, 0);
          this.successmsg = true;
          this._interval.settimer().then((Res) => {
            this.successmsg = false;
            resolve(Response);
            this._router.navigate(["/viewpurchases"]);
          });
        });
    });
  }
}
