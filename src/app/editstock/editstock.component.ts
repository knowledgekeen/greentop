import { Component, OnInit } from '@angular/core';
import { RESTService } from '../rest.service';
import { IntervalService } from '../interval.service';
import { CONSTANTS } from '../app.constants';

@Component({
  selector: 'app-editstock',
  templateUrl: './editstock.component.html',
  styleUrls: ['./editstock.component.css']
})
export class EditstockComponent implements OnInit {
  allstock: any = null;
  successMsg: string = null;

  constructor(private _rest: RESTService, private _interval: IntervalService) { }

  ngOnInit() {
    this.getAllStocks();
  }
  
  getAllStocks() {
    this._rest
      .getData("reports_stock.php", "getAllStocks", null)
      .subscribe(Response => {
        if (Response) {
          let removedbags = null;
          this.allstock = Response["data"];
          for(let i in this.allstock){
            if(this.allstock[i].name === CONSTANTS.HDPE_BAGS){
              removedbags = this.allstock.splice(i,1);
              break;
            }
          }
          this.allstock.push(removedbags[0]);
        }
      });
  };

  updateStock(stock){
    console.log(stock);
    this._rest.postData("reports_stock.php", "updateStock", stock)
      .subscribe(Response=>{
        if(Response){
          this.successMsg = "Updated Stocks Successfully.";
          this._interval.settimer().then(Resp=>{
            this.successMsg = null;
          })
        }
      })
  }
}
