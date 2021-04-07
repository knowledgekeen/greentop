import { Component, OnInit } from "@angular/core";
import { GlobalService } from "src/app/global.service";
import { RESTService } from "src/app/rest.service";
import * as moment from "moment";

@Component({
  selector: "app-sundrycreditors",
  templateUrl: "./sundrycreditors.component.html",
  styleUrls: ["./sundrycreditors.component.css"],
})
export class SundrycreditorsComponent implements OnInit {
  todaydate: number = null;
  printdate: any = null;
  allcreditors: any = [];
  totalbalance: number = 0;
  filterdt: string = null;

  constructor(private _global: GlobalService, private _rest: RESTService) {}

  ngOnInit() {
    let dt = new Date();
    dt.setHours(0, 0, 0, 0);
    this.todaydate = dt.getTime();
    this.printdate = moment(dt).format("DD/MM/YYYY");
    this.getSundryDebtorsDetails();
  }

  getSundryDebtorsDetails(uptodt?: any) {
    this.allcreditors = [];
    const currfinanyr = this._global.getCurrentFinancialYear();
    let urldata;
    if (!uptodt) {
      urldata = "fromdt=1522521000000&todt=" + currfinanyr.todt + "&ctype=1";
    } else {
      const myDate = moment(uptodt, "DD-MM-YYYY").format("MM-DD-YYYY");
      const seldt = new Date(myDate).getTime();
      urldata = "fromdt=1522521000000&todt=" + seldt + "&ctype=1";
    }
    this._rest
      .getData("sundry.php", "getSundryDetails", urldata)
      .subscribe((Response) => {
        if (Response && Response["data"]) {
          this.allcreditors = Response["data"];

          // This loop will filter out all the duplicate debtors and will keep only the latest transaction details
          for (let i = 0; i < this.allcreditors.length - 1; i++) {
            if (
              this.allcreditors[i].clientid ===
              this.allcreditors[i + 1].clientid
            ) {
              this.allcreditors.splice(i, 1);
              i--;
            }
          }

          // This loop is to remove all the debtors with '0' balance
          for (let j = 0; j < this.allcreditors.length; j++) {
            console.log(
              this.allcreditors[j].clientid,
              this.allcreditors[j].name,
              this.allcreditors[j].balance
            );
            if (parseInt(this.allcreditors[j].balance) === 0) {
              this.allcreditors.splice(j, 1);
              j--;
            }
          }

          console.log(this.allcreditors);

          this.calculateTotalBalance();
        } else {
          this.allcreditors = null;
        }
      });
  }

  calculateTotalBalance() {
    this.totalbalance = 0;
    for (const i in this.allcreditors) {
      this.totalbalance += parseFloat(this.allcreditors[i].balance);
    }
  }

  filterData() {
    this.getSundryDebtorsDetails(this.filterdt);
    const myDate = moment(this.filterdt, "DD-MM-YYYY").format("MM-DD-YYYY");
    const seldt = new Date(myDate).getTime();
    this.todaydate = seldt;
  }

  autoFillDt() {
    this.filterdt = this._global.getAutofillFormattedDt(this.filterdt);
  }
}
