import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/global.service';
import { RESTService } from 'src/app/rest.service';
import * as moment from "moment";

@Component({
  selector: 'app-sundrydebitors',
  templateUrl: './sundrydebitors.component.html',
  styleUrls: ['./sundrydebitors.component.css']
})
export class SundrydebitorsComponent implements OnInit {
  todaydate: number = null;
  alldebtors: any = [];
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
    this.alldebtors = [];
    const currfinanyr = this._global.getCurrentFinancialYear();
    let urldata;
    if(!uptodt){
      urldata = "fromdt=1522521000000&todt="+currfinanyr.todt+"&ctype=2";
    }
    else{
      const myDate = moment(uptodt, "DD-MM-YYYY").format("MM-DD-YYYY");
      const seldt = new Date(myDate).getTime();
      urldata = "fromdt=1522521000000&todt="+seldt+"&ctype=2";
    }
    this._rest.getData("sundry.php", "getSundryDetails", urldata)
      .subscribe(Response=>{
        if(Response && Response["data"]){
          this.alldebtors = Response["data"];
          this.calculateTotalBalance();
        }
        else{
          this.alldebtors=null;
        }
      })
  }

  calculateTotalBalance(){
    //1 Day=86400000 && 90Days=7776000000
    let maxoutstanddays = 7776000000;
    this.totalbalance = 0;
    for (const i in this.alldebtors) {
      this.totalbalance += parseFloat(this.alldebtors[i].balance);
      if(parseFloat(this.alldebtors[i].balancedt) <= (this.todaydate-maxoutstanddays)){
        this.alldebtors[i].outstander = true;
      }
      else{
        this.alldebtors[i].outstander = false;
      }
    }

    // Total for noprint table
    this.totalnoprintbal = 0;
    for (const j in this.noprintarr) {
      this.totalnoprintbal += parseFloat(this.noprintarr[j].balance);
    }
  }

  pushToNoPrint(debtor, index){
    this.noprintarr.push(debtor);
    this.alldebtors.splice(index,1);
    this.calculateTotalBalance();
  }

  addBackToPrint(debtor, index){
    this.alldebtors.push(debtor);
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
