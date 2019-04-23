import { Component, OnInit } from "@angular/core";
import { RESTService } from "../rest.service";
import { IntervalService } from "../interval.service";
import { GlobalService } from "../global.service";
import * as moment from "moment";

@Component({
  selector: "app-viewproduct",
  templateUrl: "./viewproduct.component.html",
  styleUrls: ["./viewproduct.component.css"]
})
export class ViewproductComponent implements OnInit {
  allproducts: any = null;
  selectedprod: any = null;
  all_deactive_products: any = null;
  successMsg: any = false;
  activetab: number = 1;
  editstockbal: any = null;
  tmpeditstockbal: any = null;
  openbalfound: boolean = false;
  disable_editbal: boolean = false;

  constructor(
    private _rest: RESTService,
    private _interval: IntervalService,
    private _global: GlobalService
  ) {}

  ngOnInit() {
    this.getActiveProducts();
    this.getDeactiveProducts();
    this._global.active_prods.subscribe(message => {
      this.allproducts = message;
      //console.log(message);
    });
  }

  getActiveProducts() {
    //this.allproducts = null;
    this._rest
      .getData("product.php", "getActiveProducts", null)
      .subscribe(Response => {
        //console.log(Response);
        if (Response) {
          this._global.updateData(Response["data"]);
        }
      });
  }

  getDeactiveProducts() {
    this.all_deactive_products = null;
    this._rest
      .getData("product.php", "getDeactiveProducts", null)
      .subscribe(Response => {
        //console.log(Response);
        if (Response) {
          this.all_deactive_products = Response["data"];
        }
      });
  }

  updateProduct(prods, status) {
    let prodObj = {
      prodid: prods.prodid,
      prodname: prods.prodname,
      hsncode: prods.hsncode,
      status: status
    };
    let toupdatestkqty =
      this.editstockbal.quantity - this.tmpeditstockbal.quantity;

    this._rest
      .postData("product.php", "updateProduct", prodObj, null)
      .subscribe(Response => {
        if (Response) {
          let balDate = moment(this.editstockbal.date, "DD-MM-YYYY").format(
            "MM-DD-YYYY"
          );
          let uptstk = {
            stockid: this.editstockbal.stockid,
            quantity: this.editstockbal.quantity,
            stkdt: new Date().getTime(),
            openbaldt: new Date(balDate).getTime()
          };
          console.log(uptstk);
          this._rest
            .postData("stock.php", "updateOpeningStock", uptstk, null)
            .subscribe(Resp => {
              this.successMsg = "Product Updated Successfully";
              this.disable_editbal = false;
              this.getActiveProducts();
              this.getDeactiveProducts();
              this._interval.settimer(null).then(a => {
                this.successMsg = false;
              });
            });

          if (this.openbalfound == true) {
            //Here stock master will be updated as per opening stock
            let balDate = moment(this.editstockbal.date, "DD-MM-YYYY").format(
              "MM-DD-YYYY"
            );
            let uptstkmast = {
              stockid: this.editstockbal.stockid,
              quantity: toupdatestkqty,
              openbaldt: new Date(balDate).getTime()
            };
            this._rest
              .postData("stock.php", "updateCurrentStock", uptstkmast, null)
              .subscribe(Resp => {
                console.log("Stock master updated successfully");
              });
          }
        }
      });
  }

  selectProduct(prod) {
    //console.log(prod);
    this.selectedprod = prod;
    let finanyr = this._global.getCurrentFinancialYear();
    let produrl =
      "prodid=" +
      this.selectedprod.prodid +
      "&fromdt=" +
      finanyr.fromdt +
      "&todt=" +
      finanyr.todt;
    this.editstockbal = null;
    this._rest
      .getData("stock.php", "getProdOpeningStock", produrl)
      .subscribe(Response => {
        //console.log(Response);
        if (Response) {
          //console.log(Response["data"]);
          if (Response["data"].quantity) {
            this.editstockbal = Response["data"];
          } else {
            this.editstockbal = { quantity: "0" };
          }
          this.openbalfound = true;
        } else {
          this.editstockbal = { quantity: "0" };
          this.openbalfound = false;
        }
        let dt = new Date();
        if (!this.openbalfound) {
          this.disable_editbal = true;
          let geturl = "prodid=" + this.selectedprod.prodid;
          this._rest
            .getData("stock.php", "getProductStock", geturl)
            .subscribe(Respstk => {
              if (Respstk) {
                this.editstockbal.stockid = Respstk["data"].stockid;
                this.editstockbal.quantity = Respstk["data"].quantity;
              }
            });
          this.editstockbal.date = dt.getTime();
        }
        dt.setTime(parseInt(this.editstockbal.date));
        this.editstockbal.date = moment(
          parseInt(this.editstockbal.date)
        ).format("DD-MM-YYYY");
        this.tmpeditstockbal = JSON.parse(JSON.stringify(this.editstockbal));
      });
  }

  autoFillDt() {
    if (!this.editstockbal.date) {
      return;
    }
    this.editstockbal.date = this._global.getAutofillFormattedDt(
      this.editstockbal.date
    );
  }
}
