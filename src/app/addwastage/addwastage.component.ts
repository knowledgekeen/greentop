import { Component, OnInit } from "@angular/core";
import { GlobalService } from "../global.service";
import { RESTService } from "../rest.service";
import * as moment from "moment";
import { IntervalService } from "../interval.service";

@Component({
  selector: "app-addwastage",
  templateUrl: "./addwastage.component.html",
  styleUrls: ["./addwastage.component.css"]
})
export class AddwastageComponent implements OnInit {
  rawmat: any = null;
  quantity: any = null;
  wastagedt: any = null;
  allrawmats: any = null;
  successmsg: any = null;
  allwastages: any = null;
  totalwaste: any = null;
  rawmatavailstk: any = null;

  constructor(
    private _global: GlobalService,
    private _rest: RESTService,
    private _interval: IntervalService
  ) { }

  ngOnInit() {
    this.getRawMaterials();
    this.getWastageFromTo();
  }

  getRawMaterials() {
    this.allrawmats = null;
    this._rest
      .getData("rawmaterial.php", "getRawMaterials", null)
      .subscribe(Response => {
        if (Response) {
          this.allrawmats = Response["data"];
        }
      });
  }

  autoFillDt() {
    if (!this.wastagedt) return;

    this.wastagedt = this._global.getAutofillFormattedDt(this.wastagedt);
  }

  addWastage() {
    let myDate = moment(this.wastagedt, "DD-MM-YYYY").format("MM-DD-YYYY");

    let tmpobj = {
      rawmatid: this.rawmat.split(".")[0],
      quantity: this.quantity,
      wastagedt: new Date(myDate).getTime()
    };
    this._rest
      .postData("wastage.php", "addWastage", tmpobj)
      .subscribe(Response => {
        if (Response) {
          this.successmsg = "Wastage added successfully";
          this._interval.settimer().then(Resp => {
            this.successmsg = null;
            this.rawmat = null;
            this.quantity = null;
            this.wastagedt = null;
            this.rawmatavailstk = null;
            this.totalwaste = null;
            this.getWastageFromTo();
          });
        }
      });
  }

  getWastageFromTo() {
    let finanyr = this._global.getCurrentFinancialYear();
    let urldata = "fromdt=" + finanyr.fromdt + "&todt=" + finanyr.todt;
    let totalstk = {
      rawmat: 0,
      bags: 0
    };
    this._rest
      .getData("wastage.php", "getWastageFromTo", urldata)
      .subscribe(Response => {
        if (Response) {
          //console.log(Response);
          this.allwastages = Response["data"];
          for (const i in this.allwastages) {
            if (this.allwastages[i].name.toLowerCase().indexOf("bag") > -1) {
              totalstk.bags += parseFloat(this.allwastages[i].quantity);
            } else {
              totalstk.rawmat += parseFloat(this.allwastages[i].quantity);
            }
          }
          //console.log(totalstk);
          this.totalwaste = totalstk;
        }
      });
  }

  getRawMatStock() {
    if (!this.rawmat) {
      this.rawmatavailstk = null;
      return;
    }
    let geturl = "rawmatid=" + this.rawmat.split(".")[0];
    this._rest
      .getData("stock.php", "getRawMatStock", geturl)
      .subscribe(Response => {
        console.log(Response);
        if (Response) {
          this.rawmatavailstk = Response["data"];
        }
      });
  }

  // This method is not in use as deleting a wastage will effect in stock
  deleteWastage(waste) {
    console.log(waste);
    this.successmsg = null;
    let geturl = "wastageid=" + waste.wastageid;
    this._rest.getData("wastage.php", "deleteWastage", geturl)
      .subscribe(Response => {
        if (Response) {
          this.successmsg = "Wastage deleted successfully";
          this.getWastageFromTo();
          this._interval.settimer().then(Resp => {
            this.successmsg = null;
          })
        }
      })
  }
}
