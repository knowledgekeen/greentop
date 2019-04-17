import { Component, OnInit } from "@angular/core";
import { RESTService } from "../rest.service";
import { IntervalService } from "../interval.service";
import { GlobalService } from "../global.service";

@Component({
  selector: "app-addtransport",
  templateUrl: "./addtransport.component.html",
  styleUrls: ["./addtransport.component.css"]
})
export class AddtransportComponent implements OnInit {
  successMsg: any = false;
  edittransport: boolean = false;
  transportnm: any = null;
  contactno: any = null;
  address: any = null;

  constructor(
    private _rest: RESTService,
    private _interval: IntervalService,
    private _global: GlobalService
  ) {}

  ngOnInit() {}

  addTransport() {
    let transportObj = {
      transportnm: this.transportnm,
      contactno: this.contactno,
      address: this.address
    };

    this._rest
      .postData("transport.php", "addTransport", transportObj, null)
      .subscribe(Response => {
        console.log(Response);
        if (Response) {
          this.successMsg = "Transport Added Successfully.";
          this.transportnm = null;
          this.contactno = null;
          this.address = null;
          this.getActiveTransport();
          this._interval
            .settimer(null)
            .then(Interv => (this.successMsg = false));
        }
      });
  }

  getActiveTransport() {
    this._rest
      .getData("transport.php", "getActiveTransport", null)
      .subscribe(Response => {
        if (Response) {
          this._global.updateTransportData(Response["data"]);
        }
      });
  }

  editFromChildComp(event) {
    console.log(event);
    this.edittransport = event.tmid;
    this.transportnm = event.transportname;
    this.contactno = event.contactno;
    this.address = event.address;
  }

  cancelUpdate() {
    this.edittransport = false;
    this.transportnm = null;
    this.contactno = null;
    this.address = null;
  }

  updateTransport() {
    let transportObj = {
      transid: this.edittransport,
      transportnm: this.transportnm,
      contactno: this.contactno,
      address: this.address
    };

    this._rest
      .postData("transport.php", "updateTransport", transportObj, null)
      .subscribe(Response => {
        console.log(Response);
        if (Response) {
          this.successMsg = "Transport Updated Successfully.";
          this.cancelUpdate();
          this.getActiveTransport();
          this._interval
            .settimer(null)
            .then(Interv => (this.successMsg = false));
        }
      });
  }
}
