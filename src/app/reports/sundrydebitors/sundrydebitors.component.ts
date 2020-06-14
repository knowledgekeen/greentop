import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/global.service';
import { RESTService } from 'src/app/rest.service';

@Component({
  selector: 'app-sundrydebitors',
  templateUrl: './sundrydebitors.component.html',
  styleUrls: ['./sundrydebitors.component.css']
})
export class SundrydebitorsComponent implements OnInit {
  todaydate: number = null;
  alldebtors: any = [];
  totalbalance: number = 0;

  constructor(private _global:GlobalService, private _rest:RESTService) { }

  ngOnInit() {
    let dt = new Date();
    dt.setHours(0,0,0,0);
    this.todaydate = dt.getTime();
    this.getSundryDebtorsDetails();
  }

  getSundryDebtorsDetails(){
    this.alldebtors = [];
    const currfinanyr = this._global.getCurrentFinancialYear();
    let urldata = "fromdt="+currfinanyr.fromdt+"&todt="+currfinanyr.todt+"&ctype=2";
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
    console.log(this.todaydate-maxoutstanddays)
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
  }
}
