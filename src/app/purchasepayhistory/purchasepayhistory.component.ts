import { Component, OnInit, Input } from '@angular/core';
import { RESTService } from '../rest.service';
import { GlobalService } from '../global.service';
import * as moment from "moment";
import { IntervalService } from '../interval.service';

@Component({
  selector: 'app-purchasepayhistory',
  templateUrl: './purchasepayhistory.component.html',
  styleUrls: ['./purchasepayhistory.component.css']
})
export class PurchasepayhistoryComponent implements OnInit {
  payhistory: any = null;
  totalamt: { debit: number; credit: number; balance: number; };
  currfinanyr: any;
  editpurchdate: any = null;
  editamountpaid: any = null;
  editparticulars: any = null;
  selectedpurchpayid: any = null;
  @Input() supplier: any;
  @Input() isEditable: any;
  successflag: any = false;
  disableupdatebtn: any = false;

  constructor(private _rest: RESTService, private _global: GlobalService, private _interval: IntervalService) { }

  ngOnInit() {
    //console.log(this.supplier)
    this.currfinanyr = this._global.getCurrentFinancialYear();
    this.getAllPurchasePayments();
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
          debit:
            parseFloat(openbal.openingbal) < 0 ? openbal.openingbal * -1 : null,
          credit:
            parseFloat(openbal.openingbal) >= 0 ? openbal.openingbal : null,
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
            particulars: "Purchase Bill No. " + purchmast[i].billno,
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
            purchpayid: purchpay[i].purchpayid,
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
      "clientid=" + this.supplier.split(".")[0] +
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
    return new Promise(function (resolve, reject) {
      vm._rest
        .getData("client.php", "getClientPurchaseOpeningBal", geturl)
        .subscribe(CResp => {
          //console.log(CResp);
          vm._rest
            .getData("purchase_payments.php", "getAllPurchaseMastPayments", geturl)
            .subscribe(Response => {
              //console.log(Response);
              if (Response) {
                purchmast = Response["data"];
              }

              //Irrespective of data from getAllPurchaseMastPayments, need to get payments done details
              vm._rest
                .getData("purchase_payments.php", "getAllPurchasePayments", geturl)
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
    tmpobj.balance = tmpobj.credit-tmpobj.debit;
    this.totalamt = tmpobj;
    // this.payhistory.length>=2, here its greater then equal to 2 because, the opening balance should not be updated to sundry, considering the following case: If the user has last transaction in March 1 and if we update the customer transaction at 1st April then the outstander concept would change here.
    if(this.payhistory.length>=2 && this.payhistory[this.payhistory.length-1].dates && tmpobj.balance && this.supplier.split(".")[0]){
      const sundrydata={
        baldate: this.payhistory[this.payhistory.length-1].dates,
        balance: tmpobj.balance,
        clientid: this.supplier.split(".")[0]
      };

      this._rest.postData("sundry.php", "updateSundryData", sundrydata).subscribe(Resp=>{
        if(!Resp){
          alert("Failed to update sundry debtor, kindly open this page again later.");
        }
      });
    }
    tmpobj = null;
  }

  editPaymentHistory(hist) {
    this.editpurchdate = null;
    this.editamountpaid = null;
    this.editparticulars = null;
    this.editpurchdate = moment(parseInt(hist.dates)).format("DD-MM-YYYY");
    this.editamountpaid = hist.debit;
    this.editparticulars = hist.particulars;
    this.selectedpurchpayid = hist.purchpayid;
  }

  updatePurchasePayment() {
    this.disableupdatebtn = true;
    let balDate = moment(this.editpurchdate, "DD-MM-YYYY").format("MM-DD-YYYY");
    let postobj = {
      purchpayid: this.selectedpurchpayid,
      purchdate: new Date(balDate).getTime(),
      amountpaid: this.editamountpaid,
      particulars: this.editparticulars
    }
    this._rest.postData("purchase_payments.php", "updatePurchasePayment", postobj)
      .subscribe(Response => {
        window.scrollTo(0, 0);
        this.successflag = "Payment details updated successfully";
        this.getAllPurchasePayments();
        this._interval.settimer().then(rep => {
          this.successflag = false;
          this.disableupdatebtn = false;
        });
      });
  }

  confirmDel(hist) {
    this.selectedpurchpayid = hist.purchpayid;
  }

  deletePurchasePayRecord() {
    let geturl = "purchpayid=" + this.selectedpurchpayid;
    this._rest.getData("purchase_payments.php", "deletePurchasePayRecord", geturl)
      .subscribe(Response => {
        window.scrollTo(0, 0);
        this.successflag = "Payment details deleted successfully";
        this.getAllPurchasePayments();
        this._interval.settimer().then(rep => {
          this.successflag = false;
        });
      });
  }
}
