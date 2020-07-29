import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/global.service';
import { RESTService } from 'src/app/rest.service';
import * as moment from 'moment';
import { CONSTANTS } from 'src/app/app.constants';

@Component({
  selector: 'app-billsandcollection',
  templateUrl: './billsandcollection.component.html',
  styleUrls: ['./billsandcollection.component.css']
})
export class BillsandcollectionComponent implements OnInit {
  allinvoices:any = null;
  totalopenbal:any = null;
  allpayments:any = null;
  totalbillamt: number = 0;
  totalamtreceived: number = 0;
  allbillsncollection:any = null;
  custmakepays: any = null;
  finanyr: any = null;

  constructor(private _global:GlobalService, private _rest:RESTService) { }

  ngOnInit() {
    let finanyr = this._global.getCurrentFinancialYear();
    this.finanyr = finanyr;
    const geturl = "fromdt=" + finanyr.fromdt + "&todt=" + finanyr.todt;
    this.getTotalCustomerOpenBal().then(openbal=>{
      this.getInvoicesFromToDt(geturl).then(resp=>{
        this.getAllOrderPaymentsFromToDt(geturl).then(payments=>{
          this.getAllCustMakePayments().then(custmakepays =>{
            this.filterBCdata();
          }).catch(err=>{
            alert("Cannot get Customer Make Payments");
          });
        });
      });
    });
  }

  getTotalCustomerOpenBal(){
    const _this = this;
    const promise = new Promise((resolve, reject) => {
      
    _this._rest
      .getData("client.php", "getTotalCustomerOpenBal")
      .subscribe(Response => {
        if(Response && Response["data"]){
          _this.totalopenbal = Response["data"];
          // console.log(_this.totalopenbal)
          resolve(Response)
        }
        else{
          reject("error fetching data")
        }
      },err=>{
        reject(err)
      });
    });
    
    return promise;
  }

  getInvoicesFromToDt(geturl) {
    const _this = this;
    const promise = new Promise((resolve, reject) => {
    _this.allinvoices = null;
    _this._rest
      .getData("taxinvoice.php", "getInvoicesFromToDt", geturl)
      .subscribe(Response => {
        if (Response) {
          _this.allinvoices = Response["data"];
          resolve(_this.allinvoices);
        }
      },err=>{
        reject(err);
      });
    });
    return promise;
  }

  getAllOrderPaymentsFromToDt(geturl){
    const _this = this;
    const promise = new Promise((resolve, reject) => {
    _this.allpayments = null;
    _this._rest
      .getData("sales_payments.php", "getAllOrderPaymentsFromToDt", geturl)
      .subscribe(Response => {
        if (Response) {
          _this.allpayments = Response["data"];
          resolve(_this.allpayments);
        }
      },err=>{
        reject(err);
      });
    });
    return promise;
  }

  // Payments - Get Customer Make Payments
  getAllCustMakePayments(){
    const _this = this;
    const promise = new Promise((resolve, reject) => {
      const urldata = "fromdt="+_this.finanyr.fromdt+"&todt="+_this.finanyr.todt;
      _this._rest.getData("accounts.php", "getAllCustMakePayments", urldata)
        .subscribe(Response=>{
          _this.custmakepays= Response && Response["data"] ? Response["data"] : null;
          resolve(_this.custmakepays);
        },err=>{
          reject(err);
        });
    });
    return promise
  }

  filterBCdata(){
    this.allbillsncollection = [];
    this.totalbillamt= 0;
    this.totalamtreceived = 0;
    // Initial Total Opening Balance of Customers
    this.allbillsncollection.push({
      dated: this._global.getCurrentFinancialYear().fromdt,
      billno:'-',
      particulars: `OPENING BALANCE AS ON `+ moment(new Date(this._global.getCurrentFinancialYear().fromdt)).format('DD-MM-YYYY'),
      billamt: 0,
      amtreceived: 0,
      balance:this.totalopenbal
    });

    // For Bill Amounts (Debit)
    for(let i in this.allinvoices){
      this.allbillsncollection.push({
        dated: this.allinvoices[i].billdt,
        billno:this.allinvoices[i].billno,
        particulars: `${this.allinvoices[i].name}`,
        billamt: parseFloat(this.allinvoices[i].totalamount),
        amtreceived: 0,
        balance:0
      });
      this.totalbillamt += parseFloat(this.allinvoices[i].totalamount)
    }

    // For Amounts Received (Credit)
    for(let j in this.allpayments){
      this.allbillsncollection.push({
        dated: this.allpayments[j].paydate,
        billno:'-',
        particulars: (this.allpayments[j].paymode != this.allpayments[j].particulars)?`${this.allpayments[j].paymode} - ${this.allpayments[j].name}, ${this.allpayments[j].particulars}`:`${this.allpayments[j].paymode} - ${this.allpayments[j].name}`,
        billamt: 0,
        amtreceived: parseFloat(this.allpayments[j].amount),
        balance:0
      });
      this.totalamtreceived += parseFloat(this.allpayments[j].amount)
    }

    // For Cash Amounts Received From Customers(Credit)
    for(let k in this.custmakepays){
      this.allbillsncollection.push({
        dated: this.custmakepays[k].paydate,
        billno:'-',
        particulars: `${this.custmakepays[k].particulars} - ${this.custmakepays[k].name}`,
        billamt: 0,
        amtreceived: parseFloat(this.custmakepays[k].amountpaid)*-1,
        balance:0
      });
      this.totalamtreceived += parseFloat(this.custmakepays[k].amountpaid)
    }

    this.allbillsncollection.sort(this._global.sortArr("dated"));

    // balance calculation
    let tmpbalance = parseFloat(this.totalopenbal);
    for (let k in this.allbillsncollection) {
      this.allbillsncollection[k].balance = tmpbalance + this.allbillsncollection[k].billamt - this.allbillsncollection[k].amtreceived;
      tmpbalance = parseFloat(this.allbillsncollection[k].balance);
    }
  }
}
