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
  selectedbatch: any = null;
  selectedbatchmaterials: any = null;
  allproducts: any = null;
  constructor(private _rest: RESTService) {}

  ngOnInit() {
    this._rest
      .getData("production.php", "getAllProductionBatches", null)
      .subscribe(Response => {
        if (Response) {
          this.allbatches = Response["data"];
          this.getActiveProducts();
        }
      });
  }

  getActiveProducts() {
    this._rest
      .getData("product.php", "getActiveProducts", null)
      .subscribe(Response => {
        //console.log(Response);
        if (Response) {
          console.log(Response);
          this.allproducts = Response["data"];
        }
      });
  }

  viewBatchDetails(batch) {
    console.log(batch);
    this.selectedbatch = JSON.parse(JSON.stringify(batch));
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
        }
      });
  }

  saveBatch() {
    console.log(this.selectedbatch, this.selectedbatchmaterials);
  }
}
