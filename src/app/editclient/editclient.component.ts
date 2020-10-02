import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { RESTService } from "../rest.service";
import { IntervalService } from "../interval.service";
import { GlobalService } from "../global.service";
import * as moment from "moment";

@Component({
  selector: "app-editclient",
  templateUrl: "./editclient.component.html",
  styleUrls: ["./editclient.component.css"],
})
export class EditclientComponent implements OnInit {
  clienttype: string = null;
  clientid: string = null;
  fname: string = null;
  cno: string = null;
  gstno: string = null;
  email: string = null;
  cperson1: string = null;
  cno1: string = null;
  cperson2: string = null;
  cno2: string = null;
  city: string = null;
  district: string = null;
  state: string = null;
  address: string = null;
  successMsg: any = false;
  allcities: any = null;
  alldistricts: any = null;
  allstates: any = null;
  clientdata: any = null;
  licenseno: string = null;
  licenseissuedt: string = null;
  licenseexpirydt: string = null;
  licenseauthority: string = null;

  constructor(
    private _route: ActivatedRoute,
    private _rest: RESTService,
    private _interval: IntervalService,
    private _global: GlobalService
  ) {}

  ngOnInit() {
    this._route.params.subscribe((Resp) => {
      //console.log(Resp);
      this.clienttype = Resp.clienttype;
      this.clientid = Resp.clientid;
      this.getClientDetails();
    });
    this.getClientCities();
    this.getClientDistricts();
    this.getClientStates();
  }

  getClientCities() {
    this.allcities = null;
    this._rest
      .getData("client.php", "getClientCities", null)
      .subscribe((Response) => {
        if (Response) {
          this.allcities = Response["data"];
        }
      });
  }

  getClientDistricts() {
    this.alldistricts = null;
    this._rest
      .getData("client.php", "getClientDistricts", null)
      .subscribe((Response) => {
        if (Response) {
          this.alldistricts = Response["data"];
        }
      });
  }

  getClientStates() {
    this.allstates = null;
    this._rest
      .getData("client.php", "getClientStates", null)
      .subscribe((Response) => {
        if (Response) {
          this.allstates = Response["data"];
        }
      });
  }

  getClientDetails() {
    let clientdata =
      "clienttype=" + this.clienttype + "&clientid=" + this.clientid;
    this._rest
      .getData("client.php", "getClientDetails", clientdata)
      .subscribe((Response) => {
        if (Response) {
          //console.log(Response["data"]);
          this.clientdata = Response["data"];
          this.setClientDetails();
        }
      });
  }

  setClientDetails() {
    this.fname = this.clientdata.name;
    this.cno = this.clientdata.contactno;
    this.gstno = this.clientdata.gstno;
    this.email = this.clientdata.email;
    this.cperson1 = this.clientdata.contactperson1;
    this.cno1 = this.clientdata.contactno1;
    this.cperson2 = this.clientdata.contactperson2;
    this.cno2 = this.clientdata.contactno2;
    this.city = this.clientdata.city;
    this.district = this.clientdata.district;
    this.state = this.clientdata.state;
    this.address = this.clientdata.address;
  }

  updateClient() {
    let address = null;
    if (!this.address) {
      address = this.city + ", " + this.state;
    } else {
      address = this.address;
    }
    const issueDt = moment(this.licenseissuedt, "DD-MM-YYYY").format(
      "MM-DD-YYYY"
    );
    const expDt = moment(this.licenseexpirydt, "DD-MM-YYYY").format(
      "MM-DD-YYYY"
    );
    let clientObj = {
      clientid: this.clientid,
      fname: this.fname,
      cno: this.cno,
      gstno: this.gstno,
      email: this.email,
      cperson1: this.cperson1,
      cno1: this.cno1,
      cperson2: this.cperson2,
      cno2: this.cno2,
      city: this.city,
      district: this.district,
      state: this.state,
      address: address,
      ctype: this.clienttype,
      licenseno: this.licenseno,
      licenseissuedt: new Date(issueDt).getTime(),
      licenseexpirydt: new Date(expDt).getTime(),
      licenseauthority: this.licenseauthority,
    };

    this._rest
      .postData("client.php", "updateClient", clientObj, null)
      .subscribe((Response) => {
        //console.log(Response);
        if (Response) {
          this.successMsg = true;
          window.scrollTo(0, 0);
          this.getClientCities();
          this.getClientStates();
          if (this.clienttype == "1") {
            this.successMsg = "Supplier updated successfully";
          } else {
            this.successMsg = "Customer updated successfully";
          }
          this._interval.settimer(null).then((RespInt) => {
            this.successMsg = false;
          });
        }
      });
  }

  autoFillDt() {
    this.licenseissuedt = this.licenseissuedt
      ? this._global.getAutofillFormattedDt(this.licenseissuedt)
      : this.licenseissuedt;

    this.licenseexpirydt = this.licenseexpirydt
      ? this._global.getAutofillFormattedDt(this.licenseexpirydt)
      : this.licenseexpirydt;
  }
}
