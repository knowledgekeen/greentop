import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/global.service';
import { RESTService } from 'src/app/rest.service';

@Component({
  selector: 'app-sundrycreditors',
  templateUrl: './sundrycreditors.component.html',
  styleUrls: ['./sundrycreditors.component.css']
})
export class SundrycreditorsComponent implements OnInit {
  todaydate: number = null;
  allcreditors: any = [];
  totalbalance: number = 0;

  constructor(private _global:GlobalService, private _rest:RESTService) { }

  ngOnInit() {
    let dt = new Date();
    dt.setHours(0,0,0,0);
    this.todaydate = dt.getTime();
    this.getSundryDebtorsDetails();
  }

  getSundryDebtorsDetails(){
    this.allcreditors = [];
    const currfinanyr = this._global.getCurrentFinancialYear();
    let urldata = "fromdt="+currfinanyr.fromdt+"&todt="+currfinanyr.todt+"&ctype=1";
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
  }

}
