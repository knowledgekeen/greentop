import { Component, OnInit } from "@angular/core";
import * as moment from "moment";
import { RESTService } from "../rest.service";
import { IntervalService } from "../interval.service";
import { GlobalService } from "../global.service";

@Component({
  selector: "app-addbatch",
  templateUrl: "./addbatch.component.html",
  styleUrls: ["./addbatch.component.css"]
})
export class AddbatchComponent implements OnInit {
  batchid: any = null;
  proddate: string = null;
  quantity: any = 0;
  allprods: any = null;
  prodid: any = null;
  allrawmats: any = null;
  qty: any = [];
  successMsg: any = false;
  prodstk: any;

  constructor(
    private _rest: RESTService,
    private _interval: IntervalService,
    private _global: GlobalService
  ) {}

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this.quantity = 0;
    this.prodstk = null;
    this.allrawmats = null;
    this.allprods = null;
    this.prodid = null;
    this.proddate = null;
    this.qty = [];
    let now = moment().format("DDMMYYYY");
    //let proddt = moment().format("DD-MM-YYYY");
    //this.proddate = proddt;
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

  getAllProdRawmats() {
    let urldata = "prodid=" + this.prodid;
    this.allrawmats = null;
    this.prodstk = null;
    this._rest
      .getData("production.php", "getAllProdRawmats", urldata)
      .subscribe(Response => {
        if (Response) {
          //console.log(Response);
          this.allrawmats = Response["data"];
          this.prodstk = Response["stock"];

          for (let i in this.allrawmats) {
            this.qty[i] = this.allrawmats[i].defquantity;
          }
        }
      });
  }

  addBatch() {
    //debugger;
    let dt = this.proddate.split("-");
    let proddt = moment().set({
      y: parseInt(dt[2]),
      M: parseInt(dt[1]) - 1,
      D: parseInt(dt[0]),
      h: 0,
      m: 0,
      s: 0,
      ms: 0
    });
    let prodtime = proddt.unix() * 1000;
    if (this.qty.length < this.allrawmats.length) {
      alert("Please fill all the raw material quantities");
    } else {
      let errorFlag = false;
      //console.log(this.prodid);
      for (let j in this.allrawmats) {
        //console.log(cond, isNaN(parseFloat(this.qty[j])));
        if (isNaN(parseFloat(this.qty[j]))) {
          errorFlag = true;
          break;
        }
      }

      if (errorFlag == false) {
        let tmpObj = new Array();

        for (let i in this.allrawmats) {
          let obj = {
            rawmatid: this.allrawmats[i].rawmatid,
            stockid: this.allrawmats[i].stockid,
            qty: parseFloat(this.qty[i]),
            qtyremained:
              parseFloat(this.allrawmats[i].quantity) - parseFloat(this.qty[i])
          };
          tmpObj.push(obj);
        }
        //console.log(tmpObj);
        //batchObj => Master Object of Batch
        let finalstk =
          parseFloat(this.prodstk.quantity) + parseFloat(this.quantity);
        let batchObj = {
          batchid: this.batchid,
          prodid: this.prodid,
          todaytm: new Date().getTime(),
          prodtime: prodtime,
          qtyproduced: this.quantity,
          allrawmat: tmpObj,
          finalstk: finalstk,
          stockid: this.prodstk.stockid
        };
        //console.log(batchObj);

        this._rest
          .postData("production.php", "addProductionBatch", batchObj, null)
          .subscribe(Response => {
            if (Response) {
              this.successMsg = "Batch created successfully.";
              this.initialize();
              this._interval.settimer(null).then(Resp => {
                this.successMsg = false;
              });
            }
          });
      } else {
        alert("Quantity should be a number");
      }
    }
  }

  autoFillDate() {
    if (!this.proddate) return;

    this.proddate = this._global.getAutofillFormattedDt(this.proddate);
  }
}
