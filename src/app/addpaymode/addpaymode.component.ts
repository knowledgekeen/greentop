import { Component, OnInit } from "@angular/core";
import { RESTService } from "../rest.service";
import { IntervalService } from "../interval.service";

@Component({
  selector: "app-addpaymode",
  templateUrl: "./addpaymode.component.html",
  styleUrls: ["./addpaymode.component.css"]
})
export class AddpaymodeComponent implements OnInit {
  paymode: string = null;
  selectedmode: any = null;
  allpaymodes: any = null;
  successmsg: any = false;
  constructor(private _rest: RESTService, private _interval: IntervalService) {}

  ngOnInit() {
    this.getAllPayModes();
  }

  getAllPayModes() {
    this.allpaymodes = null;
    this._rest
      .getData("payments_common.php", "getAllPayModes")
      .subscribe(Response => {
        if (Response) {
          this.allpaymodes = Response["data"];
        }
      });
  }

  addPayMode() {
    let postobj = { paymode: this.paymode };
    this._rest
      .postData("payments_common.php", "addPayMode", postobj)
      .subscribe(Response => {
        if (Response) {
          this.successmsg = "New payment mode added";
          this.paymode = null;
          this.getAllPayModes();
          this._interval.settimer().then(Response => {
            this.successmsg = null;
          });
        }
      });
  }

  updatePayMode() {
    let postobj = {
      paymodeid: this.selectedmode.paymodeid,
      paymode: this.paymode
    };
    //console.log(postobj);
    this._rest
      .postData("payments_common.php", "updatePayMode", postobj)
      .subscribe(Response => {
        if (Response) {
          this.successmsg = "Payment mode updated";
          this.paymode = null;
          this.selectedmode = null;
          this.getAllPayModes();
          this._interval.settimer().then(Response => {
            this.successmsg = null;
          });
        }
      });
  }

  editPaymentMode(mode) {
    this.selectedmode = mode;
    this.paymode = mode.paymode;
  }

  cancel() {
    this.selectedmode = null;
    this.paymode = null;
  }
}
