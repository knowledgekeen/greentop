import { Component, OnInit } from "@angular/core";
import { GlobalService } from "../global.service";
import { RESTService } from "../rest.service";
import * as moment from "moment";
import { IntervalService } from "../interval.service";

@Component({
  selector: "app-purchasepayments",
  templateUrl: "./purchasepayments.component.html",
  styleUrls: ["./purchasepayments.component.css"]
})
export class PurchasepaymentsComponent implements OnInit {
  currfinanyr: any = null;
  allsuppliers: any = null;
  paydt: string = null;
  supplier: string = null;
  paymode: string = null;
  allpaymodes: any = null;
  particulars: string = null;
  amtpaid: string = "0";
  errormsg: any = false;
  successmsg: any = false;
  payhistory: any = null;
  disableaddbtn: boolean = false;
  totalamt: any = null;

  constructor(
    private _global: GlobalService,
    private _rest: RESTService,
    private _interval: IntervalService
  ) {}

  ngOnInit() {
    this.currfinanyr = this._global.getCurrentFinancialYear();
    this.getAllSuppliers();
    this.getAllPayModes();
    //this.getAllPurchasePayments();
  }

  getAllSuppliers() {
    let suppdata = "clienttype=1";
    this._rest
      .getData("client.php", "getAllClients", suppdata)
      .subscribe(Response => {
        if (Response) {
          //console.log(Response["data"]);
          this.allsuppliers = Response["data"];
        }
      });
  }

  getAllPayModes() {
    this._rest
      .getData("payments_common.php", "getAllPayModes", null)
      .subscribe(Response => {
        if (Response) {
          //console.log(Response["data"]);
          this.allpaymodes = Response["data"];
        }
      });
  }

  autofillPayDt() {
    if (!this.paydt) return;

    this.paydt = this._global.getAutofillFormattedDt(this.paydt);
  }

  getAllPurchasePayments() {
    if (!this.supplier) return;
    this.payhistory = null;
    let purchmast;
    let purchpay;
    let openbal;
    this.fetchAllPaymentData().then(Response => {
      if (!Response) return;

      purchmast = Response["purchmast"];
      purchpay = Response["purchpay"];
      openbal = Response["openingbal"];
      let tmparr = [];
      //console.log(openbal, purchmast, purchpay);

      if (openbal) {
        let tmpobj = {
          id: tmparr.length,
          dates: openbal.baldate,
          particulars: "Opening Balance",
          debit: null,
          credit: openbal.openingbal,
          balance: 0
        };
        tmparr.push(tmpobj);
      }
      //These are purchases made but payments are non done;
      if (purchmast) {
        for (let i in purchmast) {
          let tmpobj = {
            id: tmparr.length,
            dates: purchmast[i].billdt,
            particulars: "Purchase on bill no-" + purchmast[i].billno,
            debit: null,
            credit: purchmast[i].totalamount,
            balance: 0
          };
          tmparr.push(tmpobj);
        }
      }

      if (purchpay) {
        for (let i in purchpay) {
          let particulars = purchpay[i].particulars;
          if (!purchpay[i].particulars) {
            particulars = "Payment made by " + purchpay[i].paymode;
          }
          let tmpobj = {
            id: tmparr.length,
            dates: purchpay[i].paydate,
            particulars: particulars,
            debit: purchpay[i].amount,
            credit: null,
            balance: 0
          };
          tmparr.push(tmpobj);
        }
      }
      tmparr.sort(this._global.sortArr("dates"));
      this.payhistory = tmparr;
      this.calculateTotalDebitCredit();
    });
  }

  fetchAllPaymentData() {
    let dt = new Date();
    dt.setFullYear(new Date().getFullYear() - 1);
    //console.log(dt);
    let prevfinanyr = this._global.getSpecificFinancialYear(dt.getTime());
    //console.log(prevfinanyr);
    let geturl =
      "clientid=" +
      this.supplier.split(".")[0] +
      "&fromdt=" +
      this.currfinanyr.fromdt +
      "&todt=" +
      this.currfinanyr.todt +
      "&prevfromdt=" +
      prevfinanyr.fromdt +
      "&prevtodt=" +
      prevfinanyr.todt;
    //console.log(geturl);
    let purchmast = null;
    let purchpay = null;
    let vm = this;
    return new Promise(function(resolve, reject) {
      vm._rest
        .getData("client.php", "getClientPurchaseOpeningBal", geturl)
        .subscribe(CResp => {
          //console.log(CResp);
          vm._rest
            .getData(
              "purchase_payments.php",
              "getAllPurchaseMastPayments",
              geturl
            )
            .subscribe(Response => {
              //console.log(Response);
              if (Response) {
                purchmast = Response["data"];
              }

              //Irrespective of data from getAllPurchaseMastPayments, need to get payments done details
              vm._rest
                .getData(
                  "purchase_payments.php",
                  "getAllPurchasePayments",
                  geturl
                )
                .subscribe(Resp => {
                  //console.log(Resp);
                  if (Resp) {
                    purchpay = Resp["data"];
                  }

                  let tmpobj = {
                    purchmast: purchmast,
                    purchpay: purchpay,
                    openingbal: CResp["data"]
                  };

                  resolve(tmpobj);
                  tmpobj = purchpay = purchmast = null;
                });
            });
        });
    });
  }

  addPayment() {
    if (parseFloat(this.amtpaid) == 0) {
      this.errormsg = "Amount paid cannot be '0'";
      this._interval.settimer(null).then(resp => {
        this.errormsg = null;
      });
      return;
    }
    let myDate = moment(this.paydt, "DD-MM-YYYY").format("MM-DD-YYYY");
    let tmpObj = {
      paydt: new Date(myDate).getTime(),
      suppid: this.supplier.split(".")[0],
      amtpaid: this.amtpaid,
      paymode: this.paymode,
      particulars: this.particulars
    };
    this.disableaddbtn = true;
    //console.log(tmpObj);
    this._rest
      .postData("purchase_payments.php", "addPurchasePayment", tmpObj, null)
      .subscribe(Response => {
        //console.log(Response);
        if (Response) {
          this.successmsg = "Payment done successfully";
          this._interval.settimer(null).then(resp => {
            this.resetForm();
          });
        }
      });
  }

  calculateTotalDebitCredit() {
    let tmpobj = {
      debit: 0,
      credit: 0,
      balance: 0
    };
    for (let i in this.payhistory) {
      if (this.payhistory[i].debit) {
        tmpobj.debit += parseFloat(this.payhistory[i].debit);
      } else {
        tmpobj.credit += parseFloat(this.payhistory[i].credit);
      }
      let tmpcredit = 0;
      let tmpdebit = 0;
      if (tmpobj.credit) {
        tmpcredit = tmpobj.credit;
      }
      if (tmpobj.debit) {
        tmpdebit = tmpobj.debit;
      }
      this.payhistory[i].balance = tmpobj.balance + tmpcredit - tmpdebit;
    }
    this.totalamt = tmpobj;
    tmpobj = null;
  }

  resetForm() {
    this.successmsg = null;
    this.disableaddbtn = false;
    this.paydt = null;
    this.supplier = null;
    this.amtpaid = null;
    this.paymode = null;
    this.particulars = null;
    this.payhistory = null;
  }
}
