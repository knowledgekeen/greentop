import { Component, OnInit } from "@angular/core";
import { RESTService } from "../rest.service";
import * as moment from "moment";
import { IntervalService } from "../interval.service";
import { GlobalService } from "../global.service";

@Component({
  selector: "app-viewbatch",
  templateUrl: "./viewbatch.component.html",
  styleUrls: ["./viewbatch.component.css"],
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
  selectedDate: any = new Date();
  errorMsg: any = false;
  batchdispatches: any = false;
  disablesavebtn: boolean = false;
  monthlabel: string = "Full year";
  fromdt: any = null;
  todt: any = null;
  customfrom: any = null;
  customto: any = null;

  constructor(
    private _rest: RESTService,
    private _interval: IntervalService,
    private _global: GlobalService
  ) {}

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    let finanyr = this._global.getCurrentFinancialYear();
    this.getProductionBatchesFromToDt(finanyr.fromdt, finanyr.todt);
  }

  getProductionBatchesFromToDt(fromdt, todt) {
    this.allbatches = null;
    let urldata = "fromdt=" + fromdt + "&todt=" + todt;
    this._rest
      .getData("production.php", "getProductionBatchesFromToDt", urldata)
      .subscribe((Response) => {
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
      .subscribe((Response) => {
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
      .subscribe((Response) => {
        if (Response) {
          this.batchdispatches = Response["data"];
          for (let i = 0; i < this.batchdispatches.length; i++) {
            this.batchdispatches[i].invoicedetails = null;
          }
        } else {
          this.batchdispatches = null;
        }
      });
  }

  saveBatch() {
    this.disablesavebtn = true;
    let batchqtychange =
      parseFloat(this.selectedbatch.qtyproduced) -
      parseFloat(this.originalbatch.qtyproduced);
    let batchstkobj = {
      prodid: this.originalbatch.prodid,
      quantity: batchqtychange,
      qtydt: new Date().getTime(),
    };
    let balDate = moment(this.selectedbatch.manufacdate, "DD-MM-YYYY").format(
      "MM-DD-YYYY"
    );
    let batchprodobj = {
      batchid: this.selectedbatch.batchid,
      quantity: this.selectedbatch.qtyproduced,
      quantityrem: this.selectedbatch.qtyremained,
      manufacdate: new Date(balDate).getTime(),
    };
    //console.log(batchstkobj, batchprodobj);
    this.updateStockUsingProdid(batchstkobj).then((Response) => {
      //Gets Stock id in Response
      let stkregobj = {
        stockid: Response["data"],
        quantity: this.selectedbatch.qtyproduced,
        manufacdate: this.originalbatch.manufacdate,
        newdate: new Date(balDate).getTime(),
      };
      //console.log(Response, stkregobj);
      this.updateProductionMaster(batchprodobj).then((Resp) => {
        this.updateStockRegQuantity(stkregobj)
          .then((Respstkreg) => {
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
                  newdate: new Date(balDate).getTime(),
                };
                tmpprodregobj.changeqty =
                  parseFloat(vm.selectedbatchmaterials[e].rawmatqty) -
                  parseFloat(vm.originalbatchmaterials[e].rawmatqty);
                let url = "rawmatid=" + vm.originalbatchmaterials[e].rawmatid;
                vm._rest
                  .getData("stock.php", "getStockidFromRawMatId", url)
                  .subscribe((resgetstock) => {
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
                        .subscribe((RespTmpProdRegArr) => {
                          //console.log("Success", RespTmpProdRegArr);
                          vm.batchsucces = true;
                          vm.disablesavebtn = false;
                          vm._interval.settimer(null).then((resp) => {
                            vm.batchsucces = false;
                          });
                        });
                    }
                  });
              })(i);
            }
          })
          .catch((Respstkregerr) => {
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
        .subscribe((Response) => {
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
        .postData(
          "production.php",
          "updateProductionMaster",
          batchprodobj,
          null
        )
        .subscribe((Resp) => {
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
          (Respstkreg) => {
            if (Respstkreg) {
              resolve(true);
            } else {
              reject(false);
            }
          },
          (err) => {
            reject(err);
          }
        );
    });
  }

  getInvoiceDetails(disp, index) {
    this.batchdispatches[index].invoicedetails = false;
    let invoiceurl = "orderid=" + disp.orderid;
    this._rest
      .getData("taxinvoice.php", "getInvoiceDetails", invoiceurl)
      .subscribe((Response) => {
        if (Response) {
          this.batchdispatches[index].invoicedetails = Response["data"];
        } else {
          this.batchdispatches[index].invoicedetails = "nodata";
        }
      });
  }

  autofillfromdt() {
    this.fromdt = this._global.getAutofillFormattedDt(this.fromdt);
  }

  autofilltodt() {
    this.todt = this._global.getAutofillFormattedDt(this.todt);
  }

  filterData() {
    let myfromdate = moment(this.fromdt, "DD-MM-YYYY").format("MM-DD-YYYY");
    let fromtm = new Date(myfromdate).getTime();
    this.customfrom = fromtm;
    let mytodate = moment(this.todt, "DD-MM-YYYY").format("MM-DD-YYYY");
    let totm = new Date(mytodate).getTime();
    this.customto = totm;
    this.getProductionBatchesFromToDt(fromtm, totm);
  }
}
