import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/global.service';
import { RESTService } from 'src/app/rest.service';
import { IntervalService } from 'src/app/interval.service';

@Component({
  selector: 'app-account-openbal',
  templateUrl: './account-openbal.component.html',
  styleUrls: ['./account-openbal.component.css']
})
export class AccountOpenbalComponent implements OnInit {
  currenty_finan_yr: any=null;
  bankopenbal:number=0;
  cashopenbal:number=0;
  successMsg: string = null;
  isbalancepresent:boolean = false;

  constructor(private _global:GlobalService, private _rest:RESTService, private _interval: IntervalService) { }

  ngOnInit() {
    this.currenty_finan_yr= this._global.getCurrentFinancialYear();
    this.getFinanYrAccOpeningBalance();
  }

  getFinanYrAccOpeningBalance(){
    const urldata = "fromdt="+ this.currenty_finan_yr.fromdt;
    this._rest.getData("accounts.php", "getFinanYrAccOpeningBalance", urldata)
      .subscribe(Response=>{
        if(Response && Response["data"]){
          const data = Response["data"];
          this.bankopenbal = data[0].amount;
          this.cashopenbal = data[1].amount;
          this.isbalancepresent = true;
        }
        else{
          this.bankopenbal = 0;
          this.cashopenbal = 0;
          this.isbalancepresent = false;
        }
      })
  }

  addAccOpeningBalance(){
    const openbal = {
      bankopenbal: this.bankopenbal,
      cashopenbal: this.cashopenbal,
      curryr: this.currenty_finan_yr.fromdt
    };

    this._rest.postData("accounts.php", "addAccOpeningBalance", openbal)
      .subscribe(Response=>{
        if(Response){
          this.successMsg = "Account balance added successfully";
          this.bankopenbal = 0;
          this.cashopenbal = 0;
          this.getFinanYrAccOpeningBalance();
          this._interval.settimer().then(resp=>{
            this.successMsg = null;
          });
        }
        else{
          alert("Cannot update balance account, kindly try again later.");
        }
      },err=>{
        alert("Cannot update balance account, kindly try again later.");
      })
  }

  updateAccOpeningBalance(){
    const openbal = {
      bankopenbal: this.bankopenbal,
      cashopenbal: this.cashopenbal,
      curryr: this.currenty_finan_yr.fromdt
    };

    this._rest.postData("accounts.php", "updateAccOpeningBalance", openbal)
      .subscribe(Response=>{
        if(Response){
          this.successMsg = "Account balance updated successfully";
          this.bankopenbal = 0;
          this.cashopenbal = 0;
          this.getFinanYrAccOpeningBalance();
          this._interval.settimer().then(resp=>{
            this.successMsg = null;
          });
        }else{
          alert("Cannot update balance account, kindly try again later.");
        }
      },err=>{
        alert("Cannot update balance account, kindly try again later.");
      })
  }
}
