import { Component, OnInit } from "@angular/core";
import { RESTService } from "../rest.service";
import { IntervalService } from "../interval.service";
import { GlobalService } from "../global.service";

@Component({
  selector: "app-addtruck",
  templateUrl: "./addtruck.component.html",
  styleUrls: ["./addtruck.component.css"]
})
export class AddtruckComponent implements OnInit {
  successMsg: any = null;
  alltransports: any = null;
  transportopt: any = null;
  lorryno: string = null;
  edittrucks: boolean = false;

  constructor(
    private _rest: RESTService,
    private _interval: IntervalService,
    private _global: GlobalService
  ) {}

  ngOnInit() {
    this.getActiveTransport();
  }

  getActiveTransport() {
    this._rest
      .getData("transport.php", "getActiveTransport", null)
      .subscribe(Response => {
        if (Response) {
          //console.log(Response["data"]);
          this.alltransports = Response["data"];
        }
      });
  }

  addTruck() {
    //console.log(this.transportopt, this.lorryno);
    let truckObj = {
      tmid: this.transportopt,
      lorryno: this.lorryno.toUpperCase()
    };

    this._rest
      .postData("transport.php", "addTruck", truckObj, null)
      .subscribe(Response => {
        //console.log(Response);
        if (Response) {
          window.scrollTo(0, 0);
          this.successMsg = "Truck Added Successfully.";
          this.lorryno = null;
          this.getAllTrucks();
          this._interval
            .settimer(null)
            .then(Inter => (this.successMsg = false));
        }
      });
  }

  getAllTrucks() {
    this._rest
      .getData("transport.php", "getAllTrucks", null)
      .subscribe(Response => {
        //console.log(Response);
        if (Response) {
          this._global.updateTrucksData(Response["data"]);
        }
      });
  }

  editTruckFromChildComp(evt) {
    this.lorryno = evt.lorryno;
    this.transportopt = evt.tmid;
    this.edittrucks = evt.truckid;
    //console.log(evt);
  }

  updateTruck() {
    let truckObj = {
      truckid: this.edittrucks,
      tmid: this.transportopt,
      lorryno: this.lorryno.toUpperCase()
    };

    this._rest
      .postData("transport.php", "updateTruck", truckObj, null)
      .subscribe(Response => {
        //console.log(Response);
        if (Response) {
          window.scrollTo(0, 0);
          this.successMsg = "Truck Updated Successfully.";
          this.lorryno = null;
          this.transportopt = null;
          this.edittrucks = false;
          this.getAllTrucks();
          this._interval
            .settimer(null)
            .then(Inter => (this.successMsg = false));
        }
      });
  }

  cancelEdit() {
    this.edittrucks = false;
    this.lorryno = null;
    this.transportopt = null;
  }

  // validateLorry() {
  //   var pattern = /^[a-z0-9]+$/i;
  //   if (this.lorryno) {
  //     if (!this.lorryno.match(pattern)) {
  //       this.validlorry = false;
  //     } else {
  //       this.validlorry = true;
  //     }
  //   } else {
  //     this.validlorry = null;
  //   }
  // }
}
