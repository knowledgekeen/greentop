import { Component, OnInit } from "@angular/core";
import { GlobalService } from "src/app/global.service";
import { RESTService } from "src/app/rest.service";

@Component({
  selector: "app-accheadledger",
  templateUrl: "./accheadledger.component.html",
  styleUrls: ["./accheadledger.component.css"],
})
export class AccheadledgerComponent implements OnInit {
  accheadnm: string = null;
  allaccheads: any = null;
  finanyr: any = null;
  totalFinanyrs: any = null;
  accheaddata: any = null;
  totalamount: number = 0;
  showLedger: boolean = false;

  constructor(private _rest: RESTService, private _global: GlobalService) {}

  ngOnInit(): void {
    this.finanyr = this._global.getCurrentFinancialYear();
    this.getAllFinancialYears();
    this.getAllAccountHeads();
  }

  getAllFinancialYears() {
    this._rest.getData("sales_payments.php", "getAllFinancialYears").subscribe(
      (Response: any) => {
        // console.log(Response.data);
        this.totalFinanyrs = Response ? Response.data : null;
        for (let index in this.totalFinanyrs) {
          this.totalFinanyrs[index].finanyr =
            this._global.getSpecificFinancialYear(
              parseInt(this.totalFinanyrs[index].finanyr)
            );
        }
        // console.log(this.totalFinanyrs);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  changeFinancialyrs(finanyrs) {
    // console.log("change finanyrs", finanyrs);
    this.finanyr = this._global.getSpecificFinancialYear(
      parseInt(finanyrs.fromdt)
    );
    this.showLedger = false;
    this.getAccountHeadDetails();
  }

  getAllAccountHeads() {
    this.allaccheads = null;
    this._rest
      .getData("expenditure.php", "getAllAccountHeads")
      .subscribe((Response) => {
        if (Response) {
          this.allaccheads = Response["data"];
        }
      });
  }

  getAccountHeadDetails() {
    this.accheaddata = null;
    let accheadid = this.allaccheads.filter(
      (x) => x.accheadnm === this.accheadnm
    );
    accheadid =
      accheadid && accheadid.length > 0 ? accheadid[0].accheadid : null;
    this.totalamount = 0;
    if (!accheadid) return;

    const urldata =
      "fromdt=" +
      this.finanyr.fromdt +
      "&todt=" +
      this.finanyr.todt +
      "&accheadid=" +
      accheadid;
    this._rest
      .getData("expenditure.php", "fetchExpenditureAccHeadDetails", urldata)
      .subscribe(
        (Response: any) => {
          console.log(Response);
          this.showLedger = true;
          this.accheaddata = Response && Response.data ? Response.data : null;
          this.accheaddata.map((acc) => {
            this.totalamount += parseFloat(acc.amount);
          });
        },
        (err) => {
          this.showLedger = true;
          alert(
            "Cannot fetch Account head details right now, please try again later."
          );
          console.log(err);
        }
      );
  }
}
