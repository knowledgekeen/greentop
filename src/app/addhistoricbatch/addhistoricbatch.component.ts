import { Component, OnInit } from "@angular/core";
import { RESTService } from "../rest.service";
import { IntervalService } from "../interval.service";
import { GlobalService } from "../global.service";
import * as moment from "moment";

@Component({
  selector: "app-addhistoricbatch",
  templateUrl: "./addhistoricbatch.component.html",
  styleUrls: ["./addhistoricbatch.component.css"]
})
export class AddhistoricbatchComponent implements OnInit {
  batchid: any = null;
  proddate: any = null;
  quantity: any = null;
  prodid: any = null;
  allprods: any = false;
  successMsg: any = false;
  disableaddbtn: any = false;

  constructor(
    private _rest: RESTService,
    private _interval: IntervalService,
    private _global: GlobalService
  ) { }

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this.quantity = 0;
    this.allprods = null;
    this.prodid = null;
    this.proddate = null;
    let now = moment().format("DDMMYYYY");
    this.getTodaysProductionBatch(now);
    this.getActiveProducts();
  }

  getTodaysProductionBatch(dt) {
    //let urldata = "batchid=" + dt;
    this._rest
      .getData("production.php", "getTodaysProductionBatch", null)
      .subscribe(Response => {
        if (Response) {
          this.batchid = parseInt(Response["data"]) + 1;
        } else {
          this.batchid = "1";
        }
      });
  }

  getActiveProducts() {
    this._rest
      .getData("product.php", "getActiveProducts", null)
      .subscribe(Response => {
        if (Response) {
          this.allprods = Response["data"];
        }
      });
  }

  autoFillDate() {
    if (!this.proddate) return;

    this.proddate = this._global.getAutofillFormattedDt(this.proddate);
  }

  addHistoricBatch() {
    this.disableaddbtn = true;
    let myDate = moment(this.proddate, "DD-MM-YYYY").format("MM-DD-YYYY");
    let tmpobj = {
      batchid: this.batchid,
      proddate: new Date(myDate).getTime(),
      quantity: this.quantity,
      prodid: this.prodid
    };
    this._rest
      .postData("production.php", "addHistoricBatch", tmpobj)
      .subscribe(Response => {
        if (Response) {
          this.successMsg = "Batch added successfully";
          this._interval.settimer().then(Resp => {
            this.successMsg = null;
            this.initialize();
            this.disableaddbtn = false;
          });
        }
      });
  }
}
