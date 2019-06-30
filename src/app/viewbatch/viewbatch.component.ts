import { Component, OnInit } from "@angular/core";
import { RESTService } from "../rest.service";
import * as moment from "moment";
import { IntervalService } from "../interval.service";
import { GlobalService } from "../global.service";

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
  batchsucces: any = false;
  opendtp: boolean = false;
  selectedDate: any = new Date();
  errorMsg: any = false;
  batchdispatches: any = false;

  constructor(
    private _rest: RESTService,
    private _interval: IntervalService,
    private _global: GlobalService
  ) { }

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    let fromdt: any = new Date();
    fromdt.setDate(1);
    fromdt.setHours(0, 0, 0, 0);
    fromdt = fromdt.getTime();
    let todt = new Date().getTime();
    this.getProductionBatchesFromToDt(fromdt, todt);
  }

  getProductionBatchesFromToDt(fromdt, todt) {
    this.allbatches = null;
    let urldata = "fromdt=" + fromdt + "&todt=" + todt;
    this._rest
      .getData("production.php", "getProductionBatchesFromToDt", urldata)
      .subscribe(Response => {
        if (Response) {
          this.allbatches = Response["data"];
        }
      });
  }

  viewBatchDetails(batch) {
    //console.log(batch)
    this.batchdispatches = false;
    this.selectedbatch = JSON.parse(JSON.stringify(batch));
    this.originalbatch = JSON.parse(JSON.stringify(batch));
    let geturl = "batchmastid=" + batch.batchmastid;
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
          //console.log(this.originalbatchmaterials, this.originalbatch);
        }
      });

    //Get batch dispathes details
    this._rest
      .getData("dispatch.php", "getBatchDispatches", geturl)
      .subscribe(Response => {
        if (Response) {
          this.batchdispatches = Response['data'];
        }
        else {
          this.batchdispatches = null;
        }
      })
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
        manufacdate: this.originalbatch.manufacdate,
        newdate: new Date(balDate).getTime()
      };
      //console.log(Response, stkregobj);
      this.updateProductionMaster(batchprodobj).then(Resp => {
        this.updateStockRegQuantity(stkregobj)
          .then(Respstkreg => {
            //console.log("Success");
            this.allbatches = null;
            this.initialize();

            //Update stock master for all raw materials
            let tmpprodregarr = [];
            let vm = this;
            for (let i in vm.originalbatchmaterials) {
              (function (e) {
                let tmpprodregobj = {
                  prodregid: vm.originalbatchmaterials[e].prodregid,
                  rawmatid: vm.originalbatchmaterials[e].rawmatid,
                  rawmatqty: vm.selectedbatchmaterials[e].rawmatqty,
                  stockid: null,
                  changeqty: null,
                  stkdate: vm.originalbatch.manufacdate,
                  newdate: new Date(balDate).getTime()
                };
                tmpprodregobj.changeqty =
                  parseFloat(vm.selectedbatchmaterials[e].rawmatqty) -
                  parseFloat(vm.originalbatchmaterials[e].rawmatqty);
                let url = "rawmatid=" + vm.originalbatchmaterials[e].rawmatid;
                vm._rest
                  .getData("stock.php", "getStockidFromRawMatId", url)
                  .subscribe(resgetstock => {
                    if (resgetstock) {
                      //console.log(resgetstock);
                      tmpprodregobj.stockid = resgetstock["data"]["stockid"];
                      //tmpprodregarr.push(tmpprodregobj);

                      vm._rest
                        .postData(
                          "rawmaterial.php",
                          "updateRawMaterialsAndStocks",
                          tmpprodregobj,
                          null
                        )
                        .subscribe(RespTmpProdRegArr => {
                          //console.log("Success", RespTmpProdRegArr);
                          vm.batchsucces = true;
                          vm._interval.settimer(null).then(resp => {
                            vm.batchsucces = false;
                          });
                        });
                    }
                  });
              })(i);
            }
          })
          .catch(Respstkregerr => {
            console.log("Error", Respstkregerr);
          });
      });
    });
  }

  updateStockUsingProdid(batchstkobj) {
    let vm = this;
    return new Promise(function (resolve, reject) {
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
    return new Promise(function (resolve, reject) {
      vm._rest
        .postData("production.php", "updateProductionMaster", batchprodobj, null)
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
    return new Promise(function (resolve, reject) {
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

  toggleDTP() {
    this.opendtp = !this.opendtp;
  }

  changeDate() {
    if (this.selectedDate) {
      //console.log(this.selectedDate.getTime());
      let todaydt = new Date().getTime();
      if (this.selectedDate.getTime() > todaydt) {
        let fromdt: any = new Date();
        fromdt.setDate(1);
        fromdt.setHours(0, 0, 0, 0);
        fromdt = fromdt.getTime();
        let todt = new Date().getTime();
        //If month from future show details of current month
        this.getProductionBatchesFromToDt(fromdt, todt);
        this.errorMsg = "Month cannot be from future.";
        this.selectedDate.setTime(todaydt);
        this.opendtp = !this.opendtp;
        this._interval.settimer(null).then(Resp => {
          this.errorMsg = false;
        });
        return;
      } else {
        let dt = new Date();
        dt.setTime(this.selectedDate);
        let fromdt = this.selectedDate.getTime();
        let lastdt = new Date(dt.getFullYear(), dt.getMonth() + 1, 0).getTime();
        //console.log(fromdt, lastdt);
        this.getProductionBatchesFromToDt(fromdt, lastdt);
        this.opendtp = !this.opendtp;
        return;
      }
    }
  }
}
