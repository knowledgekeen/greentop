import { Component, OnInit } from "@angular/core";
import { RESTService } from "../rest.service";
import { GlobalService } from "../global.service";
import { IntervalService } from "../interval.service";
import * as moment from "moment";

@Component({
  selector: "app-salepayments",
  templateUrl: "./salepayments.component.html",
  styleUrls: ["./salepayments.component.css"]
})
export class SalepaymentsComponent implements OnInit {
  currfinanyr: any = null;
  allcustomers: any = null;
  paydt: string = null;
  customer: string = null;
  paymode: string = null;
  allpaymodes: any = null;
  particulars: string = null;
  amtpaid: string = "0";
  successmsg: any = false;
  errormsg: any = false;
  payhistory: any = null;
  disableaddbtn: boolean = false;
  totalamt: any = null;

  constructor(
    private _rest: RESTService,
    private _global: GlobalService,
    private _interval: IntervalService
  ) {}

  ngOnInit() {
    this.currfinanyr = this._global.getCurrentFinancialYear();
    this.getAllCustomers();
    this.getAllPayModes();
  }

  getAllCustomers() {
    let suppdata = "clienttype=2";
    this._rest
      .getData("client.php", "getAllClients", suppdata)
      .subscribe(Response => {
        if (Response) {
          //console.log(Response["data"]);
          this.allcustomers = Response["data"];
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

  getAllSalesPayments() {
    if (!this.customer) return;
    this.payhistory = null;
    let ordermast;
    let orderpay;
    let openbal;
    this.fetchAllPaymentData().then(Response => {
      if (!Response) return;
      ordermast = Response["ordermast"];
      orderpay = Response["orderpay"];
      openbal = Response["openingbal"];
      let tmparr = [];
      //console.log(openbal, ordermast, orderpay);

      if (openbal) {
        let tmpobj = {
          id: tmparr.length,
          dates: openbal.baldate,
          particulars: "Opening Balance",
          payin:
            parseFloat(openbal.openingbal) < 0
              ? parseFloat(openbal.openingbal) * -1
              : null,
          payout:
            parseFloat(openbal.openingbal) >= 0
              ? parseFloat(openbal.openingbal)
              : null,
          balance: 0
        };
        tmparr.push(tmpobj);
      }

      //These are Orders made but payments are non done;
      if (ordermast) {
        for (let i in ordermast) {
          let tmpobj = {
            id: tmparr.length,
            dates: ordermast[i].billdt,
            particulars: "Tax Invoice No. " + ordermast[i].billno,
            payin: null,
            payout: ordermast[i].totalamount,
            balance: 0
          };
          tmparr.push(tmpobj);
        }
      }

      if (orderpay) {
        for (let i in orderpay) {
          let particulars = orderpay[i].particulars;
          if (!orderpay[i].particulars) {
            particulars = "Payment done by " + orderpay[i].paymode;
          }
          let tmpobj = {
            id: tmparr.length,
            dates: orderpay[i].paydate,
            particulars: particulars,
            payin: orderpay[i].amount,
            payout: null,
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

  calculateTotalDebitCredit() {
    let tmpobj = {
      payin: 0,
      payout: 0,
      balance: 0
    };
    for (let i in this.payhistory) {
      if (this.payhistory[i].payin) {
        tmpobj.payin += parseFloat(this.payhistory[i].payin);
      } else {
        tmpobj.payout += parseFloat(this.payhistory[i].payout);
      }
      let tmpcredit = 0;
      let tmpdebit = 0;
      if (tmpobj.payout) {
        tmpdebit = tmpobj.payout;
      }
      if (tmpobj.payin) {
        tmpcredit = tmpobj.payin;
      }
      this.payhistory[i].balance = tmpobj.balance + tmpdebit - tmpcredit;
    }
    //console.log(tmpobj);
    tmpobj.balance = tmpobj.payout - tmpobj.payin;
    this.totalamt = tmpobj;
    tmpobj = null;
  }

  fetchAllPaymentData() {
    let dt = new Date();
    dt.setFullYear(new Date().getFullYear() - 1);
    //console.log(dt);
    let prevfinanyr = this._global.getSpecificFinancialYear(dt.getTime());
    //console.log(prevfinanyr);
    let geturl =
      "clientid=" +
      this.customer.split(".")[0] +
      "&fromdt=" +
      this.currfinanyr.fromdt +
      "&todt=" +
      this.currfinanyr.todt +
      "&prevfromdt=" +
      prevfinanyr.fromdt +
      "&prevtodt=" +
      prevfinanyr.todt;
    //console.log(geturl);
    let ordermast = null;
    let orderpay = null;
    let vm = this;
    //console.log(geturl);
    return new Promise(function(resolve, reject) {
      vm._rest
        .getData("client.php", "getClientSaleOpeningBal", geturl)
        .subscribe(CResp => {
          //console.log(CResp);
          vm._rest
            .getData("sales_payments.php", "getAllOrderInvoicePayments", geturl)
            .subscribe(Response => {
              //console.log(Response);
              if (Response) {
                ordermast = Response["data"];
              }

              //Irrespective of data from getAllOrderPayments, need to get payments done details
              vm._rest
                .getData(
                  "sales_payments.php",
                  "getAllSaleOrderPayments",
                  geturl
                )
                .subscribe(Resp => {
                  //console.log(Resp);
                  if (Resp) {
                    orderpay = Resp["data"];
                  }

                  let tmpobj = {
                    ordermast: ordermast,
                    orderpay: orderpay,
                    openingbal: CResp["data"]
                  };

                  resolve(tmpobj);
                  tmpobj = orderpay = ordermast = null;
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
      custid: this.customer.split(".")[0],
      amtpaid: this.amtpaid,
      paymode: this.paymode,
      particulars: this.particulars
    };
    this.disableaddbtn = true;
    console.log(tmpObj);
    //return;
    this._rest
      .postData("sales_payments.php", "addSalesPayment", tmpObj, null)
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

  resetForm() {
    this.successmsg = null;
    this.disableaddbtn = false;
    this.paydt = null;
    this.customer = null;
    this.amtpaid = null;
    this.paymode = null;
    this.particulars = null;
    this.payhistory = null;
  }
}
