import { Component, OnInit, Input } from '@angular/core';
import { GlobalService } from '../global.service';
import { RESTService } from '../rest.service';
import * as moment from "moment";
import { IntervalService } from '../interval.service';

@Component({
  selector: 'app-salespayhistory',
  templateUrl: './salespayhistory.component.html',
  styleUrls: ['./salespayhistory.component.css']
})
export class SalespayhistoryComponent implements OnInit {
  currfinanyr: any = null;
  payhistory: any = null;
  editpaydate: any = null;
  editamountpaid: any = null;
  editparticulars: any = null;
  selectedorderpayid: any = null;
  @Input() customer: any;
  @Input() iseditable: any;
  successflag: any = false;
  disableupdatebtn: any = false;
  totalamt: { payin: number; payout: number; balance: number; };

  constructor(private _global: GlobalService, private _rest: RESTService, private _interval: IntervalService) { }

  ngOnInit() {
    this.currfinanyr = this._global.getCurrentFinancialYear();
    this.getAllSalesPayments();
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
            orderpayid: orderpay[i].orderpayid,
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
    tmpobj.balance = tmpobj.payout - tmpobj.payin;
    this.totalamt = tmpobj;

    if(this.payhistory[this.payhistory.length-1].dates && tmpobj.balance && this.customer.split(".")[0]){
      const sundrydata={
        baldate: this.payhistory[this.payhistory.length-1].dates,
        balance: tmpobj.balance,
        clientid: this.customer.split(".")[0]
      };

      this._rest.postData("sundry.php", "updateSundryData", sundrydata).subscribe(Resp=>{
        if(!Resp){
          alert("Failed to update sundry debtor, kindly open this page again later.");
        }
      });
    }
    // console.log(this.payhistory[this.payhistory.length-1].dates,tmpobj.balance, this.customer.split(".")[0]);
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
    return new Promise(function (resolve, reject) {
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

  editPaymentHistory(hist) {
    console.log(hist)
    this.editpaydate = null;
    this.editamountpaid = null;
    this.editparticulars = null;
    this.editpaydate = moment(parseInt(hist.dates)).format("DD-MM-YYYY");
    this.editamountpaid = hist.payin;
    this.editparticulars = hist.particulars;
    this.selectedorderpayid = hist.orderpayid;
  }

  updateSalePayment() {
    this.disableupdatebtn = true;
    let balDate = moment(this.editpaydate, "DD-MM-YYYY").format("MM-DD-YYYY");
    let postobj = {
      orderpayid: this.selectedorderpayid,
      paydate: new Date(balDate).getTime(),
      amountpaid: this.editamountpaid,
      particulars: this.editparticulars
    }
    this._rest.postData("sales_payments.php", "updateSalePayment", postobj)
      .subscribe(Response => {
        window.scrollTo(0, 0);
        this.successflag = "Payment details updated successfully";
        this.getAllSalesPayments();
        this._interval.settimer().then(rep => {
          this.successflag = false;
          this.disableupdatebtn = false;
        });
      });
  }

  confirmDel(hist) {
    this.selectedorderpayid = hist.orderpayid;
  }

  deleteSalesPayRecord() {
    let geturl = "orderpayid=" + this.selectedorderpayid;
    this._rest.getData("sales_payments.php", "deleteSalePayRecord", geturl)
      .subscribe(Response => {
        window.scrollTo(0, 0);
        this.successflag = "Payment details deleted successfully";
        this.getAllSalesPayments();
        this._interval.settimer().then(rep => {
          this.successflag = false;
        });
      });
  }

}
