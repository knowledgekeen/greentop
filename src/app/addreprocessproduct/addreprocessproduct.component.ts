import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../global.service';
import { RESTService } from '../rest.service';
import * as moment from "moment";
import { IntervalService } from '../interval.service';

@Component({
  selector: 'app-addreprocessproduct',
  templateUrl: './addreprocessproduct.component.html',
  styleUrls: ['./addreprocessproduct.component.css']
})
export class AddreprocessproductComponent implements OnInit {
  reprocessdate: any = null;
  fromprod: any = null;
  products: any = null;
  toprod: any = null;
  quantity: any = null;
  fromprodstock: any = null;
  toprodstock: any = null;
  disablebtn: any = false;
  successflag: any = false;
  errormsg: any = null;

  constructor(private _global: GlobalService, private _rest: RESTService, private _interval: IntervalService) { }

  ngOnInit() {
    this.reprocessdate = moment(new Date().getTime()).format("DD-MM-YYYY");
    this.getActiveProducts();
  }

  autofillDt() {
    this.reprocessdate = this._global.getAutofillFormattedDt(this.reprocessdate);
  }

  getActiveProducts() {
    this._rest
      .getData("product.php", "getActiveProducts")
      .subscribe(Response => {
        if (Response) {
          this.products = Response["data"];
        }
      })
  }

  getProductStock(prodid, index) {
    let geturl = "prodid=" + prodid;
    this._rest.getData("stock.php", "getProductStock", geturl)
      .subscribe(Response => {
        if (Response) {
          if (index == 1) {
            this.fromprodstock = Response["data"];
          }
          else {
            this.toprodstock = Response["data"];
          }
          this.checkForError();
        }
      });
  }

  reprocessProduct() {
    let mydate = moment(this.reprocessdate, "DD-MM-YYYY").format("MM-DD-YYYY");
    let fromstockdate: any = {
      stockid: this.fromprodstock.stockid,
      quantity: parseFloat(this.quantity) * -1,
      openbaldt: new Date(mydate).getTime()
    }
    let tostockdate: any = {
      stockid: this.toprodstock.stockid,
      quantity: parseFloat(this.quantity),
      openbaldt: new Date(mydate).getTime()
    }
    this._rest.postData("stock.php", "updateCurrentStock", fromstockdate)
      .subscribe(Response => {
        if (Response) {
          fromstockdate.INnOut = "OUT";
          fromstockdate.remarks = "Removed Product for Reprocessing";
          fromstockdate.quantity = fromstockdate.quantity * -1;
          this._rest.postData("stock.php", "insertStockRegister", fromstockdate).subscribe(RespInsStk => { });

          this._rest.postData("stock.php", "updateCurrentStock", tostockdate)
            .subscribe(Resp => {
              if (Resp) {
                this.successflag = true;
                this._interval.settimer().then(Res => {
                  this.successflag = false;
                });

                tostockdate.INnOut = "IN";
                tostockdate.remarks = "Reprocessed Product";
                this._rest.postData("stock.php", "insertStockRegister", tostockdate).subscribe(RespInsStk => { });
                fromstockdate = null;
                tostockdate = null;
                this.fromprodstock = null;
                this.toprodstock = null;
                this.reprocessdate = moment(new Date().getTime()).format("DD-MM-YYYY");
                this.fromprod = null;
                this.toprod = null;
                this.quantity = null;
                this.disablebtn = false;
              }
            })
        }
      })
  }

  checkForError() {
    this.errormsg = null;
    if (this.quantity && this.fromprodstock.quantity) {
      if (parseFloat(this.fromprodstock.quantity) < parseFloat(this.quantity)) {
        this.errormsg = "From product cannot be less than quantity";
      }
      if (this.quantity <= 0) {
        this.errormsg = "Quantity cannot be less than or equal to ZERO";
      }
    }
  }
}
