import { Component, OnInit } from "@angular/core";
import { GlobalService } from "src/app/global.service";
import { RESTService } from "src/app/rest.service";
import { IntervalService } from "src/app/interval.service";
import * as moment from "moment";
import { CONSTANTS } from "src/app/app.constants";

@Component({
  selector: "app-personalaccadjustments",
  templateUrl: "./personalaccadjustments.component.html",
  styleUrls: ["./personalaccadjustments.component.css"],
})
export class PersonalaccadjustmentsComponent implements OnInit {
  allpersonalaccs: any = null;
  successmsg: boolean = false;
  debtcred: string = null;
  particulars: string = null;
  adjustdt: string = null;
  amount: string = null;
  personalacc: string = null;
  debittext: string = CONSTANTS.DEBIT;
  credittext: string = CONSTANTS.CREDIT;

  constructor(
    private _global: GlobalService,
    private _rest: RESTService,
    private _interval: IntervalService
  ) {}

  ngOnInit(): void {
    this.getAllPersonalAccounts();
  }

  autoFillArivDt() {
    this.adjustdt = this._global.getAutofillFormattedDt(this.adjustdt);
  }

  addPersonalAccAdjustment() {
    this.successmsg = false;
    const personalaccount = this.personalacc
      ? this.allpersonalaccs.filter((res) => {
          return res.personalaccnm === this.personalacc;
        })
      : null;
    if (personalaccount.length > 0) {
      let myDate = moment(this.adjustdt, "DD-MM-YYYY").format("MM-DD-YYYY");
      const adjustobj = {
        adjustdt: new Date(myDate).getTime(),
        personalacc: parseInt(personalaccount[0].personalaccid),
        creditdebit: this.debtcred,
        amount: this.amount,
        particulars: this.particulars,
      };
      this._rest
        .postData("accounts.php", "addPersonalAccAdjustment", adjustobj)
        .subscribe((Response) => {
          this.successmsg = true;
          this._interval.settimer().then((Res) => {
            this.successmsg = false;
            this.resetForm();
          });
        });
    } else {
      alert("Invalid Personal Account, Kindly select again");
    }
  }

  getAllPersonalAccounts() {
    this.allpersonalaccs = null;
    this._rest
      .getData("accounts.php", "getAllPersonalAccounts")
      .subscribe((Response) => {
        this.allpersonalaccs =
          Response && Response["data"] ? Response["data"] : null;
        console.log(this.allpersonalaccs);
      });
  }

  resetForm() {
    this.personalacc = null;
    this.debtcred = null;
    this.amount = null;
    this.particulars = null;
  }
}
