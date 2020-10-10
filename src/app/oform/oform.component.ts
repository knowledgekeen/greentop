import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { GlobalService } from "../global.service";
import { RESTService } from "../rest.service";
import { SessionService } from "../session.service";

@Component({
  selector: "app-oform",
  templateUrl: "./oform.component.html",
  styleUrls: ["./oform.component.css"],
})
export class OformComponent implements OnInit {
  oformno: string = null;
  oformdate: string = null;
  companyaddress: string = null;
  custdetails: any = null;
  wholesale_dealer: boolean = false;
  retail_dealer: boolean = false;
  industrial_dealer: boolean = false;
  wholesale_dealer_text: string = "Wholesale dealer";
  retail_dealer_text: string = "Retail dealer";
  industrial_dealer_text: string = "Industrial dealer";
  fresh_cert: boolean = false;
  renew_cert: boolean = false;
  prodlist: any = null;
  status: any = [];

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
      },
      (err) => {
        this.prodlist = emptyprods;
      }
    );
  }

  getLastOFormId() {
    this.oformno = null;
    this._rest.getData("oform.php", "getLastOFormId", null).subscribe(
      (Response) => {
        console.log("Response", Response);
        this.oformno =
          Response && Response["data"] && Response["data"].length > 0
            ? Response["data"].oformno
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
    console.log("test", this.status.join(","));
  }

  updateWholesaleDealerStatus() {
    this.status.indexOf(this.wholesale_dealer_text) < 0
      ? this.status.push(this.wholesale_dealer_text)
      : this.status.splice(this.status.indexOf(this.wholesale_dealer_text), 1);

    console.log(this.status);
  }

  updateRetailDealerStatus() {
    this.status.indexOf(this.retail_dealer_text) < 0
      ? this.status.push(this.retail_dealer_text)
      : this.status.splice(this.status.indexOf(this.retail_dealer_text), 1);
    console.log(this.status);
  }

  updateIndustrialDealerStatus() {
    this.status.indexOf(this.industrial_dealer_text) < 0
      ? this.status.push(this.industrial_dealer_text)
      : this.status.splice(this.status.indexOf(this.industrial_dealer_text), 1);
    console.log(this.status);
  }
}
