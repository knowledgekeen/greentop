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
  selectedcustmakepayid: any = null;
  @Input() customer: any;
  @Input() iseditable: any;
  successflag: any = false;
  disableupdatebtn: any = false;
  updtsundryflag: any = false;
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
    let custpay;
    this.fetchAllPaymentData().then(Response => {
      if (!Response) return;
      ordermast = Response["ordermast"];
      orderpay = Response["orderpay"];
      custpay = Response["custpay"];
      openbal = Response["openingbal"];
      let tmparr = [];

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

      // Debit
      if(custpay){
        for (let i in custpay) {
          let tmpobj = {
            iseditable: true,
            id: tmparr.length,
            makecustpayid: custpay[i].makecustpayid,
            dates: custpay[i].paydate,
            particulars: custpay[i].particulars,
            payin: null,
            payout: custpay[i].amountpaid,
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

    const calcsundrydata = this.calculateSundryData();
    this.updtsundryflag = false;
    // this.payhistory.length>=2, here its greater then equal to 2 because, the opening balance should not be updated to sundry, considering the following case: If the user has last transaction in March 1 and if we update the customer transaction at 1st April then the outstander concept would change here.
    if(calcsundrydata.length>0 && this.customer.split(".")[0]){
      const sundrydata={
        sundrydets: calcsundrydata
      };

      this._rest.postData("sundry.php", "updateSundryData", sundrydata).subscribe(Resp=>{
        if(!Resp){
          alert("Failed to update sundry debtor, kindly open this page again later, to update sundry details.");
        }
        else{
          this.updtsundryflag = true;
        }
        this._interval.settimer(1000).then(timer=>{
          this.updtsundryflag = null;
        });
      });
    }
    tmpobj = null;
  }

  calculateSundryData(){
    let payhistorycopy = JSON.parse(JSON.stringify(this.payhistory));
    payhistorycopy.map(dt=>{
      dt.clientid= this.customer.split(".")[0]
    });
    return payhistorycopy;
  }

  fetchAllPaymentData() {
    let dt = new Date();
    dt.setFullYear(new Date().getFullYear() - 1);
    let prevfinanyr = this._global.getSpecificFinancialYear(dt.getTime());
    let geturl = "clientid=" + this.customer.split(".")[0] + "&fromdt=" + this.currfinanyr.fromdt + "&todt=" + this.currfinanyr.todt + "&prevfromdt=" + prevfinanyr.fromdt + "&prevtodt=" + prevfinanyr.todt;
    let ordermast = null;
    let orderpay = null;
    let custpay = null;
    let vm = this;
    return new Promise(function (resolve, reject) {
      vm._rest
        .getData("client.php", "getClientSaleOpeningBal", geturl)
        .subscribe(CResp => {
          vm._rest
            .getData("sales_payments.php", "getAllOrderInvoicePayments", geturl)
            .subscribe(Response => {
              if (Response) {
                ordermast = Response["data"];
              }

              //Irrespective of data from getAllOrderPayments, need to get payments done details
              vm._rest.getData("sales_payments.php","getAllSaleOrderPayments",geturl)
                .subscribe(Resp => {
                  if (Resp) {
                    orderpay = Resp["data"];
                  }

                  vm._rest.getData("sales_payments.php","getAllClientCustMadePayments",geturl)
                    .subscribe(customerpay => {
                    if (customerpay) {
                      custpay = customerpay["data"];
                    }
                      let tmpobj = {
                        ordermast: ordermast,
                        orderpay: orderpay,
                        custpay: custpay,
                        openingbal: CResp["data"]
                      };

                      resolve(tmpobj);
                      tmpobj = custpay = orderpay = ordermast = null;
                  }); //getAllClientCustMadePayments Ends here
                });
            });
        });
    });
  }

  editPaymentHistory(hist, caneditcustpay) {
    this.editpaydate = null;
    this.editamountpaid = null;
    this.editparticulars = null;
    this.editpaydate = moment(parseInt(hist.dates)).format("DD-MM-YYYY");
    this.editamountpaid = hist.payin?hist.payin:hist.payout;
    this.editparticulars = hist.particulars;
    if(!caneditcustpay){
      this.selectedorderpayid = hist.orderpayid;
    }
    else{
      this.selectedcustmakepayid = hist.makecustpayid;
    }
  }

  updateSalePayment() {
    this.disableupdatebtn = true;
    if(this.selectedorderpayid){
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
    else{
      let balDate = moment(this.editpaydate, "DD-MM-YYYY").format("MM-DD-YYYY");
      let postobj = {
        id: this.selectedcustmakepayid,
        paydate: new Date(balDate).getTime(),
        amountpaid: this.editamountpaid,
        particulars: this.editparticulars
      }
      this._rest.postData("sales_payments.php", "updateMakeCustSalePayment", postobj)
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
  }

  confirmDel(hist, candeletecustpay) {
    if(candeletecustpay){
      this.selectedcustmakepayid = hist.makecustpayid;
    }
    else{
      this.selectedorderpayid = hist.orderpayid;
    }
  }

  deleteSalesPayRecord() {
    if(this.selectedorderpayid){
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
    }else{
      let geturl = "makecustpayid=" + this.selectedcustmakepayid;
      this._rest.getData("sales_payments.php", "deleteMakeCustPayRecord", geturl)
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

}
