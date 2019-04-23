import { Component, OnInit } from "@angular/core";
import { RESTService } from "../rest.service";
import * as moment from "moment";

@Component({
  selector: "app-viewbatch",
  templateUrl: "./viewbatch.component.html",
  styleUrls: ["./viewbatch.component.css"]
})
export class ViewbatchComponent implements OnInit {
  allbatches: any = null;
  originalbatch: any = null;
  selectedbatch: any = null;
  selectedbatchmaterials: any = null;
  originalbatchmaterials: any = null;
  allproducts: any = null;
  isbatchused: any = false;
  constructor(private _rest: RESTService) {}

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this.allbatches = null;
    this._rest
      .getData("production.php", "getAllProductionBatches", null)
      .subscribe(Response => {
        if (Response) {
          this.allbatches = Response["data"];
        }
      });
  }

  viewBatchDetails(batch) {
    //console.log(batch);
    this.selectedbatch = JSON.parse(JSON.stringify(batch));
    this.originalbatch = JSON.parse(JSON.stringify(batch));
    let geturl = "batchid=" + batch.batchid;
    this.selectedbatch.manufacdate = moment(
      parseInt(this.selectedbatch.manufacdate)
    ).format("DD-MM-YYYY");
    this.selectedbatch.prodname =
      this.selectedbatch.prodid + "." + this.selectedbatch.prodname;
    this._rest
      .getData("production.php", "getProductionBatchDetails", geturl)
      .subscribe(Response => {
        if (Response) {
          this.selectedbatchmaterials = Response["data"];
          this.originalbatchmaterials = JSON.parse(
            JSON.stringify(Response["data"])
          );
          console.log(this.originalbatch);
        }
      });
  }

  saveBatch() {
    //console.log(this.selectedbatch, this.selectedbatchmaterials);
    //console.log(this.originalbatch, this.selectedbatch);
    let batchqtychange =
      parseFloat(this.selectedbatch.qtyproduced) -
      parseFloat(this.originalbatch.qtyproduced);
    let batchstkobj = {
      prodid: this.originalbatch.prodid,
      quantity: batchqtychange,
      qtydt: new Date().getTime()
    };
    let balDate = moment(this.selectedbatch.manufacdate, "DD-MM-YYYY").format(
      "MM-DD-YYYY"
    );
    let batchprodobj = {
      batchid: this.selectedbatch.batchid,
      quantity: this.selectedbatch.qtyproduced,
      manufacdate: new Date(balDate).getTime()
    };
    //console.log(batchstkobj, batchprodobj);
    this.updateStockUsingProdid(batchstkobj).then(Response => {
      //Gets Stock id in Response
      let stkregobj = {
        stockid: Response["data"],
        quantity: this.selectedbatch.qtyproduced,
        manufacdate: this.originalbatch.manufacdate
      };
      //console.log(Response, stkregobj);
      this.updateProductionMaster(batchprodobj).then(Resp => {
        this.updateStockRegQuantity(stkregobj)
          .then(Respstkreg => {
            //console.log("Success");
            this.allbatches = null;
            this.initialize();
          })
          .catch(Respstkregerr => {
            console.log(Respstkregerr);
          });
      });
    });
  }

  updateStockUsingProdid(batchstkobj) {
    let vm = this;
    return new Promise(function(resolve, reject) {
      vm._rest
        .postData("stock.php", "updateStockUsingProdid", batchstkobj, null)
        .subscribe(Response => {
          if (Response) {
            resolve(Response);
          }
        });
    });
  }

  updateProductionMaster(batchprodobj) {
    let vm = this;
    return new Promise(function(resolve, reject) {
      vm._rest
        .postData(
          "production.php",
          "updateProductionMaster",
          batchprodobj,
          null
        )
        .subscribe(Resp => {
          if (Resp) {
            resolve(true);
          }
        });
    });
  }

  updateStockRegQuantity(stkregobj) {
    let vm = this;
    //console.log(stkregobj);
    return new Promise(function(resolve, reject) {
      vm._rest
        .postData("stock.php", "updateStockRegQuantity", stkregobj, null)
        .subscribe(
          Respstkreg => {
            if (Respstkreg) {
              resolve(true);
            } else {
              reject(false);
            }
          },
          err => {
            reject(err);
          }
        );
    });
  }
}
