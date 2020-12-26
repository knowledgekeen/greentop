import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CONSTANTS } from "../app.constants";
import { GlobalService } from "../global.service";
import { RESTService } from "../rest.service";
import { SessionService } from "../session.service";
import * as moment from "moment";

@Component({
  selector: "app-oform",
  templateUrl: "./oform.component.html",
  styleUrls: ["./oform.component.css"],
})
export class OformComponent implements OnInit {
  oformno: any = null;
  oformdate: string = null;
  companyaddress: string = null;
  custdetails: any = null;
  wholesale_dealer: boolean = false;
  retail_dealer: boolean = false;
  industrial_dealer: boolean = false;
  wholesale_dealer_text: string = CONSTANTS.WHOLESALE_DEALER;
  retail_dealer_text: string = CONSTANTS.RETAIL_DEALER;
  industrial_dealer_text: string = CONSTANTS.INDUSTRIAL_DEALER;
  fresh_cert: boolean = false;
  renew_cert: boolean = false;
  prodlist: any = null;
  masterprodlist: any = null;
  status: any = [];
  cust_oforms: any = null;
  isviewoform: boolean = false;

  constructor(
    private _session: SessionService,
    private _rest: RESTService,
    private _route: ActivatedRoute,
    private _global: GlobalService
  ) {}

  ngOnInit(): void {
    this._session.getData("userkey").then((Response) => {
      this.companyaddress = Response[0].address;
    });

    this.getActiveProducts();
    this.getLastOFormId();
    this._route.params.subscribe((Response) => {
      const custid = Response && Response.clientid ? Response.clientid : null;

      if (custid) {
        this.getClientDetails(custid);
        this.getClientOForms(custid);
      } else {
        alert(
          "Customer cannot be found, please try going back to view customers and click on O-FORM"
        );
      }
    });
  }

  getClientDetails(custid) {
    const geturl = `clientid=${custid}&clienttype=2`;
    this._rest
      .getData("client.php", "getClientDetails", geturl)
      .subscribe((Response) => {
        this.custdetails =
          Response && Response["data"] ? Response["data"] : null;
      });
  }

  getActiveProducts() {
    this.prodlist = null;
    const emptyprods = [{ prodname: "" }, { prodname: "" }, { prodname: "" }];
    this._rest.getData("product.php", "getActiveProducts", null).subscribe(
      (Response) => {
        this.prodlist =
          Response && Response["data"] ? Response["data"] : emptyprods;
        this.masterprodlist =
          Response && Response["data"] ? Response["data"] : null;
      },
      (err) => {
        this.prodlist = emptyprods;
      }
    );
  }

  getClientOForms(custid) {
    this.oformno = null;
    this.cust_oforms = null;
    const urldata = "clientid=" + custid;
    this._rest.getData("oform.php", "getClientOForms", urldata).subscribe(
      (Response) => {
        this.cust_oforms =
          Response && Response["data"] ? Response["data"] : null;
      },
      (err) => {
        console.log("err", err);
      }
    );
  }

  getLastOFormId() {
    this.oformno = null;
    this._rest.getData("oform.php", "getLastOFormId").subscribe(
      (Response) => {
        this.oformno =
          Response && Response["data"] && Response["data"].length > 0
            ? parseInt(Response["data"][0].oformno) + 1
            : "1";

        this.oformno =
          parseInt(this.oformno) < 10 ? "0" + this.oformno : this.oformno;
      },
      (err) => {
        console.log("err", err);
        this.oformno = "01";
      }
    );
  }

  removeProductFromList(index) {
    this.prodlist.splice(index, 1);
  }

  autoFillDt() {
    this.oformdate = this.oformdate
      ? this._global.getAutofillFormattedDt(this.oformdate)
      : this.oformdate;
  }

  issueOFormConfirmation() {
    let myDate = moment(this.oformdate, "DD-MM-YYYY").format("MM-DD-YYYY");
    let prods = this.prodlist.map((x) => x.prodid);
    const oformobj = {
      oformno: this.oformno,
      formdt: new Date(myDate).getTime(),
      custid: parseInt(this.custdetails.clientid),
      status: this.status.join(",").toLowerCase(),
      purpose: this.fresh_cert ? "fresh" : this.renew_cert ? "renewal" : "null",
      products: prods.join(","),
    };
    console.log(oformobj);
    this._rest.postData("oform.php", "issueOForm", oformobj).subscribe(
      (Resp) => {
        console.log("Response", Resp);
        alert("OForm issued successfully and entered in database");
        this.reloadbrowser();
      },
      (err) => {
        console.log("Error", err);
        alert(
          "Oform cannot be stored to database, kindly try again later, For now you can still take a printout"
        );
      }
    );
  }

  updateWholesaleDealerStatus() {
    this.status.indexOf(this.wholesale_dealer_text) < 0
      ? this.status.push(this.wholesale_dealer_text)
      : this.status.splice(this.status.indexOf(this.wholesale_dealer_text), 1);
  }

  updateRetailDealerStatus() {
    this.status.indexOf(this.retail_dealer_text) < 0
      ? this.status.push(this.retail_dealer_text)
      : this.status.splice(this.status.indexOf(this.retail_dealer_text), 1);
  }

  updateIndustrialDealerStatus() {
    this.status.indexOf(this.industrial_dealer_text) < 0
      ? this.status.push(this.industrial_dealer_text)
      : this.status.splice(this.status.indexOf(this.industrial_dealer_text), 1);
  }

  getOformDetails(oform) {
    this.isviewoform = false;
    const urldata = `oformid=${oform.oformid}`;
    this._rest
      .getData("oform.php", "getOformDetails", urldata)
      .subscribe((Response: any) => {
        this.isviewoform = true;
        Response = Response && Response["data"] ? Response["data"][0] : null;
        console.log("Response", Response);
        this.oformno = Response.oformno;
        this.oformdate = moment(parseInt(Response.oformdt)).format(
          "DD-MM-YYYY"
        );
        const oformstatus = Response.oformstatus.split(",");
        for (let i in oformstatus) {
          if (oformstatus[i] === CONSTANTS.WHOLESALE_DEALER.toLowerCase()) {
            this.wholesale_dealer = true;
          }
          if (oformstatus[i] === CONSTANTS.RETAIL_DEALER.toLowerCase()) {
            this.retail_dealer = true;
          }
          if (oformstatus[i] === CONSTANTS.INDUSTRIAL_DEALER.toLowerCase()) {
            this.industrial_dealer = true;
          }
        }
        if (Response.oformpurpose === "fresh") {
          this.fresh_cert = true;
          this.renew_cert = false;
        } else {
          this.fresh_cert = false;
          this.renew_cert = true;
        }

        const prods = Response.productsselected.split(",");
        this.prodlist = JSON.parse(JSON.stringify(this.masterprodlist));
        let tmpprodlist = [];
        for (let j = 0; j < prods.length; j++) {
          for (let k = 0; k < this.prodlist.length; k++) {
            if (prods[j] === this.prodlist[k].prodid) {
              tmpprodlist.push(this.prodlist[k]);
              break;
            }
          }
        }
        this.prodlist = tmpprodlist;
        tmpprodlist = null;
      });
  }

  reloadbrowser() {
    window.location.reload();
  }
}
