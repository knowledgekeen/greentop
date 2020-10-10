import { Component, OnInit, Input } from "@angular/core";
import { RESTService } from "../rest.service";
import { IntervalService } from "../interval.service";
import * as moment from "moment";
import { GlobalService } from "../global.service";

@Component({
  selector: "app-addclient",
  templateUrl: "./addclient.component.html",
  styleUrls: ["./addclient.component.css"],
})
export class AddclientComponent implements OnInit {
  //Supplier type == 1 AND Customer type == 2
  @Input() clienttype: string;
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
  allclients: any = null;
  clientnamepresent: boolean = false;
  disablebtn: boolean = false;
  licenseno: string = null;
  licenseissuedt: string = null;
  licenseexpirydt: string = null;
  licenseauthority: string = null;

  constructor(
    private _rest: RESTService,
    private _interval: IntervalService,
    private _global: GlobalService
  ) {}

  ngOnInit() {
    this.getClientCities();
    this.getClientDistricts();
    this.getClientStates();
    this.getAllClients();
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

  getAllClients() {
    let strObj = "clienttype=" + this.clienttype;
    this._rest
      .getData("client.php", "getAllClients", strObj)
      .subscribe((Response) => {
        if (Response) {
          this.allclients = Response["data"];
        }
      });
  }

  addClient() {
    const issueDt = moment(this.licenseissuedt, "DD-MM-YYYY").format(
      "MM-DD-YYYY"
    );
    const expDt = moment(this.licenseexpirydt, "DD-MM-YYYY").format(
      "MM-DD-YYYY"
    );
    this.disablebtn = true;
    let address = null;
    if (!this.address) {
      address = this.city + ", " + this.state;
    } else {
      address = this.address;
    }
    let clientObj = {
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
      .postData("client.php", "addClient", clientObj, null)
      .subscribe((Response) => {
        if (Response) {
          this.resetForm();
          window.scrollTo(0, 0);
          this.getClientCities();
          this.getClientDistricts();
          this.getClientStates();

          this.disablebtn = false;
          if (this.clienttype == "1") {
            this.successMsg = "Supplier added successfully";
          } else {
            this.successMsg = "Customer added successfully";
          }
          this._interval.settimer(null).then((RespInt) => {
            this.successMsg = false;
          });
        }
      });
  }

  resetForm() {
    this.fname = null;
    this.cno = null;
    this.gstno = null;
    this.email = null;
    this.cperson1 = null;
    this.cno1 = null;
    this.cperson2 = null;
    this.cno2 = null;
    this.city = null;
    this.district = null;
    this.state = null;
    this.address = null;
  }

  checkClientPresent() {
    this.clientnamepresent = false;
    for (const i in this.allclients) {
      if (this.fname == this.allclients[i].name) {
        this.clientnamepresent = true;
        break;
      }
    }
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
