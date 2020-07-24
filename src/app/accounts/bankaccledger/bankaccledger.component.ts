import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/global.service';
import { RESTService } from 'src/app/rest.service';

@Component({
  selector: 'app-bankaccledger',
  templateUrl: './bankaccledger.component.html',
  styleUrls: ['./bankaccledger.component.css']
})
export class BankaccledgerComponent implements OnInit {
  finanyr: any = null;
  bankopenbal: any = null;
  purchaseacs: any = null;
  bankexpenditures: any = null;
  bankreceipts: any = null;
  salereceipts: any = null;
  ledgerhist: any = null;
  totaldeposit: any = null;
  totalpayments: any = null;

  constructor(private _global: GlobalService, private _rest:RESTService) { }

  ngOnInit() {
    this.finanyr = this._global.getCurrentFinancialYear();
    this.getFinanYrAccOpeningBalance().then(openbal=>{
      this.getFromToPurchasesForAccounts().then(purchbal=>{
        this.getExpendituresFromTo().then(expenditure =>{
          this.getBankReceiptsFromTo().then(bankreceipts=>{
            this.getAllOrderPaymentsFromToDt().then(orderpays=>{
              this.filterData();
            }).catch(errorderpays=>{
              alert("Cannot fetch All order payments")
            });
          }).catch(errbankreceipt=>{
            alert("Cannot fetch Bank Receipts");
          })
        }).catch(errexpenditure=>{
          alert("Cannot fetch Expenditure balance");
        })
      }).catch(errpurchbal=>{
        alert("Cannot fetch purchase balance");
      })
    }).catch(erropenbal=>{
      alert("Cannot fetch opening balance for bank account");
    });
  }

  //Deposit - Getting Financial Opening Balance
  getFinanYrAccOpeningBalance(){
    const _this = this;
    const promise = new Promise((resolve, reject) => {
      const urldata = "fromdt="+_this.finanyr.fromdt+"&todt="+_this.finanyr.todt;
      _this._rest.getData("accounts.php", "getFinanYrAccOpeningBalance", urldata)
        .subscribe(Response=>{
          _this.bankopenbal= Response && Response["data"] ? Response["data"][0] : 0;
          resolve(_this.bankopenbal);
        },err=>{
          reject(err);
        });
    });
    return promise;
  }

  // Payments - Get Purchase For Accounts
  getFromToPurchasesForAccounts(){
    const _this = this;
    const promise = new Promise((resolve, reject) => {
      const urldata = "fromdt="+_this.finanyr.fromdt+"&todt="+_this.finanyr.todt;
      _this._rest.getData("reports_purchases.php", "getFromToPurchasesForAccounts", urldata)
        .subscribe(Response=>{
          _this.purchaseacs= Response && Response["data"] ? Response["data"] : 0;
          resolve(_this.purchaseacs);
        },err=>{
          reject(err);
        });
    });
    return promise;
  }

  // Payments -  Get Expenditures for Accounts
  getExpendituresFromTo(){
    const _this = this;
    const promise = new Promise((resolve, reject) => {
      const urldata = "fromdt="+_this.finanyr.fromdt+"&todt="+_this.finanyr.todt;
      _this._rest.getData("expenditure.php", "getExpendituresFromTo", urldata)
        .subscribe(Response=>{
          _this.bankexpenditures= Response && Response["data"] ? Response["data"] : null;
          _this.bankexpenditures = _this.bankexpenditures && _this.bankexpenditures.length>0 ? _this.bankexpenditures.filter(res=> res.exptype==="2"): null;
          resolve(_this.bankexpenditures);
        },err=>{
          reject(err);
        });
    });
    return promise;
  }

  // Deposit -  Get Bank Receipts
  getBankReceiptsFromTo(){
    const _this = this;
    const promise = new Promise((resolve, reject) => {
      const urldata = "fromdt="+_this.finanyr.fromdt+"&todt="+_this.finanyr.todt;
      _this._rest.getData("expenditure.php", "getReceiptsFromTo", urldata)
        .subscribe(Response=>{
          _this.bankreceipts= Response && Response["data"] ? Response["data"] : null;
          _this.bankreceipts = _this.bankreceipts && _this.bankreceipts.length>0 ? _this.bankreceipts.filter(res=> res.receipttype==="2"): null;
          resolve(_this.bankreceipts);
        },err=>{
          reject(err);
        });
    });
    return promise;
  }

  // Deposit - Get all order payments
  getAllOrderPaymentsFromToDt(){
    const _this = this;
    const promise = new Promise((resolve, reject) => {
      const urldata = "fromdt="+_this.finanyr.fromdt+"&todt="+_this.finanyr.todt;
      _this._rest.getData("sales_payments.php", "getAllOrderPaymentsFromToDt", urldata)
        .subscribe(Response=>{
          _this.salereceipts= Response && Response["data"] ? Response["data"] : null;
          _this.salereceipts = _this.salereceipts && _this.salereceipts.length>0 ? _this.salereceipts.filter(res=> res.paymode!=="CASH" && res.paymode!=="ADJUSTMENT"): null;
          resolve(_this.salereceipts);
        },err=>{
          reject(err);
        });
    });
    return promise;
  }

  filterData(){
    let tmparr = [];

    //Deposit - Opening Balance
    let tmpobj ={
      id: tmparr.length,
      dated: this.bankopenbal.yeardt,
      particular: `Opening balance`,
      deposit: this.bankopenbal.amount,
      payments: 0,
      balance: this.bankopenbal.amount
    }
    tmparr.push(tmpobj);

    //Deposit - Bank Receipts
    if(this.bankreceipts && this.bankreceipts.length>0){
      for(let i=0; i<this.bankreceipts.length;i++){
        let tmpobj = {
          id:tmparr.length,
          dated: this.bankreceipts[i].receiptdate,
          particular: this.bankreceipts[i].particulars,
          deposit: this.bankreceipts[i].amount,
          payments: 0,
          balance: 0
        }
        tmparr.push(tmpobj);
      }
    }

    // Deposit - Sale Receipts
    if(this.salereceipts && this.salereceipts.length>0){
      for(let i=0;i<this.salereceipts.length;i++){
        let tmpobj = {
          id:tmparr.length,
          dated: this.salereceipts[i].paydate,
          particular: `${this.salereceipts[i].particulars} - ${this.salereceipts[i].name}`,
          deposit: this.salereceipts[i].amount,
          payments: 0,
          balance: 0 
        };
        tmparr.push(tmpobj);
      }
    }

    //Payments - Purchase Payments
    if(this.purchaseacs && this.purchaseacs.length>0){
      for(let i=0;i<this.purchaseacs.length;i++){
        let tmpobj = {
          id:tmparr.length,
          dated: this.purchaseacs[i].paydate,
          particular: `${this.purchaseacs[i].particulars} - ${this.purchaseacs[i].name}`,
          deposit: 0,
          payments: this.purchaseacs[i].amount,
          balance: 0 
        };
        tmparr.push(tmpobj);
      }
    }

    //Payments - Expenditure Payments
    if(this.bankexpenditures && this.bankexpenditures.length>0){
      for(let i=0;i<this.bankexpenditures.length;i++){
        let tmpobj = {
          id:tmparr.length,
          dated: this.bankexpenditures[i].expdate,
          particular: this.bankexpenditures[i].particulars,
          deposit: 0,
          payments: this.bankexpenditures[i].amount,
          balance: 0 
        };
        tmparr.push(tmpobj);
      }
    }

    tmparr.sort(this._global.sortArr("dated"));
    this.ledgerhist = tmparr;

    let tmpbalance = parseFloat(this.ledgerhist[0].deposit);
    for (let k=1;k<this.ledgerhist.length;k++) {
      this.ledgerhist[k].balance = tmpbalance + parseFloat(this.ledgerhist[k].deposit) - parseFloat(this.ledgerhist[k].payments);
      tmpbalance = parseFloat(this.ledgerhist[k].balance);
    }

    for (const j in this.ledgerhist) {
      this.totaldeposit += parseFloat(this.ledgerhist[j].deposit);
      this.totalpayments += parseFloat(this.ledgerhist[j].payments);
    }
    console.log(this.ledgerhist)
  }

}
