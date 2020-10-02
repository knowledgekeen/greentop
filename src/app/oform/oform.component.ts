import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { RESTService } from "../rest.service";
import { SessionService } from "../session.service";

@Component({
  selector: "app-oform",
  templateUrl: "./oform.component.html",
  styleUrls: ["./oform.component.css"],
})
export class OformComponent implements OnInit {
  companyaddress: string = null;
  custdetails: any = null;
  wholesale_dealer: boolean = false;
  retail_dealer: boolean = false;
  industrial_dealer: boolean = false;
  fresh_cert: boolean = false;
  renew_cert: boolean = false;

  constructor(
    private _session: SessionService,
    private _rest: RESTService,
    private _route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this._session.getData("userkey").then((Response) => {
      this.companyaddress = Response[0].address;
    });

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
        console.log(this.custdetails);
      });
  }
}
