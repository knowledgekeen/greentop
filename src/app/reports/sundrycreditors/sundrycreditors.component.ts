import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/global.service';
import { RESTService } from 'src/app/rest.service';
import * as moment from "moment";

@Component({
  selector: 'app-sundrycreditors',
  templateUrl: './sundrycreditors.component.html',
  styleUrls: ['./sundrycreditors.component.css']
})
export class SundrycreditorsComponent implements OnInit {
  todaydate: number = null;
  allcreditors: any = [];
  totalbalance: number = 0;
  totalnoprintbal: number = 0;
  filterdt: string = null;
  noprintarr: any = [];

  constructor(private _global:GlobalService, private _rest:RESTService) { }

  ngOnInit() {
    let dt = new Date();
    dt.setHours(0,0,0,0);
    this.todaydate = dt.getTime();
    this.getSundryDebtorsDetails();
  }

  getSundryDebtorsDetails(uptodt?:any){
    this.allcreditors = [];
    const currfinanyr = this._global.getCurrentFinancialYear();
    let urldata;
    if(!uptodt){
      urldata = "fromdt=1522521000000&todt="+currfinanyr.todt+"&ctype=1";
    }
    else{
      const myDate = moment(uptodt, "DD-MM-YYYY").format("MM-DD-YYYY");
      const seldt = new Date(myDate).getTime();
      urldata = "fromdt=1522521000000&todt="+seldt+"&ctype=1";
    }
    this._rest.getData("sundry.php", "getSundryDetails", urldata)
      .subscribe(Response=>{
        if(Response && Response["data"]){
          this.allcreditors = Response["data"];
          this.calculateTotalBalance();
        }
        else{
          this.allcreditors=null;
        }
      })
  }

  calculateTotalBalance(){
    this.totalbalance = 0;
    for (const i in this.allcreditors) {
      this.totalbalance += parseFloat(this.allcreditors[i].balance);
    }

    // Total for noprint table
    this.totalnoprintbal = 0;
    for (const j in this.noprintarr) {
      this.totalnoprintbal += parseFloat(this.noprintarr[j].balance);
    }
  }

  pushToNoPrint(debtor, index){
    this.noprintarr.push(debtor);
    this.allcreditors.splice(index,1);
    this.calculateTotalBalance();
  }

  addBackToPrint(debtor, index){
    this.allcreditors.push(debtor);
    this.noprintarr.splice(index,1);
    this.calculateTotalBalance();
  }

  filterData(){
    this.getSundryDebtorsDetails(this.filterdt);
    const myDate = moment(this.filterdt, "DD-MM-YYYY").format("MM-DD-YYYY");
    const seldt = new Date(myDate).getTime();
    this.todaydate = seldt;
  }

  autoFillDt(){
    this.filterdt = this._global.getAutofillFormattedDt(this.filterdt);
  }

}
