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
  printdate: any = null;
  alldebtors: any = [];
  totalbalance: number = 0;
  filterdt: string = null;
  nocreditors: boolean = true;

  constructor(private _global:GlobalService, private _rest:RESTService) { }

  ngOnInit() {
    let dt = new Date();
    dt.setHours(0,0,0,0);
    this.todaydate = dt.getTime();
    this.printdate = moment(dt).format("DD/MM/YYYY");
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
          // console.log(this.alldebtors)
          // This loop will filter out all the duplicate debtors and will keep only the latest transaction details
          for(let i=0; i<this.alldebtors.length-1;i++){
            if(this.alldebtors[i].clientid === this.alldebtors[i+1].clientid){
              this.alldebtors.splice(i,1);
              i--;
            }
          }

          // This loop is to remove all the debtors with '0' balance
          for(let j=0; j<this.alldebtors.length;j++){
            if(parseInt(this.alldebtors[j].balance) === 0){
              this.alldebtors.splice(j,1);
              j--;
            }
          }

          this.calculateTotalBalance();
        }
        else{
          this.alldebtors=null;
        }
      });
  }

  calculateTotalBalance(){
    this.totalbalance = 0;
    for (const i in this.alldebtors) {
      this.totalbalance += parseFloat(this.alldebtors[i].balance);
        this.alldebtors[i].outstander = false;
    }
  }

  pushToOutstander(index){
    this.alldebtors[index].outstander = !this.alldebtors[index].outstander;
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
