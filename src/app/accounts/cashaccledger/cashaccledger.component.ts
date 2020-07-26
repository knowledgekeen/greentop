import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/global.service';
import { RESTService } from 'src/app/rest.service';

@Component({
  selector: 'app-cashaccledger',
  templateUrl: './cashaccledger.component.html',
  styleUrls: ['./cashaccledger.component.css']
})
export class CashaccledgerComponent implements OnInit {
  finanyr: any = null;
  ledgerhist: any = null;
  cashopenbal: any = null;
  cashexpenditures: any = null;
  cashacctrans: any = null;
  totaldeposit: number = 0;
  totalpayments: number = 0;

  constructor(private _global: GlobalService, private _rest: RESTService) { }

  ngOnInit() {
    this.finanyr = this._global.getCurrentFinancialYear();
    this.getFinanYrAccOpeningBalance().then(cashaccbal=>{
      this.getExpendituresFromTo().then(cashexp=>{
        console.log(cashexp)
        this.getCashAccountExpenditure().then(cashacc=>{
          this.filterData();
        }).catch(error=>{
          alert("Cannot get Cash Account Transactions, please try again later.")
        })
      }).catch(err=>{
        alert("Cannot find cash expenditures, kindly try again.");
      });
    }).catch(err=>{
      alert("Cannot fetch cash account balance, kindly try again.");
    });
  }

  // Deposit - Cash Account Opening balance
  getFinanYrAccOpeningBalance(){
    const _this = this;
    const promise = new Promise((resolve, reject) => {
      const urldata = "fromdt="+_this.finanyr.fromdt+"&todt="+_this.finanyr.todt;
      _this._rest.getData("accounts.php", "getFinanYrAccOpeningBalance", urldata)
        .subscribe(Response=>{
          _this.cashopenbal= Response && Response["data"] ? Response["data"][1] : 0;
          resolve(_this.cashopenbal);
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
          _this.cashexpenditures= Response && Response["data"] ? Response["data"] : null;
          _this.cashexpenditures = _this.cashexpenditures && _this.cashexpenditures.length>0 ? _this.cashexpenditures.filter(res=> res.exptype==="1"): null;
          resolve(_this.cashexpenditures);
        },err=>{
          reject(err);
        });
    });
    return promise;
  }

  // Deposit - Get Cash Accounts expenses made from bank expense type
  getCashAccountExpenditure(){
    const _this = this;
    const promise = new Promise((resolve, reject) => {
      const urldata = "fromdt="+_this.finanyr.fromdt+"&todt="+_this.finanyr.todt;
      _this._rest.getData("accounts.php", "getCashAccountExpenditure", urldata)
        .subscribe(Response=>{
          _this.cashacctrans= Response && Response["data"] ? Response["data"] : null;
          resolve(_this.cashacctrans);
        },err=>{
          reject(err);
        });
    });
    return promise
  }

  filterData(){
    let tmparr = [];
    //Deposit - Opening Balance
    let tmpobj ={
      id: tmparr.length,
      dated: this.cashopenbal.yeardt,
      particular: `Opening balance`,
      deposit: this.cashopenbal.amount,
      payments: 0,
      balance: this.cashopenbal.amount
    }
    tmparr.push(tmpobj);

    //Deposit - Cash Account Deposits
    if(this.cashacctrans && this.cashacctrans.length>0){
      for(let i=0;i<this.cashacctrans.length;i++){
        let tmpobj = {
          id:tmparr.length,
          dated: this.cashacctrans[i].expdate,
          particular: this.cashacctrans[i].particulars,
          deposit: this.cashacctrans[i].amount,
          payments: 0,
          balance: 0 
        };
        tmparr.push(tmpobj);
      }
    }

    //Payments - Expenditure Payments
    if(this.cashexpenditures && this.cashexpenditures.length>0){
      for(let i=0;i<this.cashexpenditures.length;i++){
        const tmpparticular = this.cashexpenditures[i].personalaccnm != "NA"? `${this.cashexpenditures[i].particulars} - ${this.cashexpenditures[i].personalaccnm}`:`${this.cashexpenditures[i].particulars}`;
        let tmpobj = {
          id:tmparr.length,
          dated: this.cashexpenditures[i].expdate,
          particular: tmpparticular,
          deposit: 0,
          payments: this.cashexpenditures[i].amount,
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
    // console.log(this.ledgerhist)
  }

}
