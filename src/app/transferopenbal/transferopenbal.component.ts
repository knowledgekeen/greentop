import { Component, OnInit } from "@angular/core";
import { TRANSFER_ACCS } from "../app.constants";
import { GlobalService } from "../global.service";
import { RESTService } from "../rest.service";
import { SessionService } from "../session.service";

@Component({
  selector: "app-transferopenbal",
  templateUrl: "./transferopenbal.component.html",
  styleUrls: ["./transferopenbal.component.css"],
})
export class TransferopenbalComponent implements OnInit {
  transferaccs: any = null;
  intervalgap: number = 20;
  sessionData: any = null;

  constructor(
    private _rest: RESTService,
    private _global: GlobalService,
    private _session: SessionService
  ) {}

  ngOnInit(): void {
    this._session.getData("userkey").then((res) => {
      console.log(res[0]);
      this.sessionData = res;
    });
    this.transferaccs = TRANSFER_ACCS;
    this.initiateAccountTransfers();
  }

  initiateAccountTransfers() {
    const _this = this;
    console.log(this.transferaccs);
    for (let accs of this.transferaccs) {
      (function (accs) {
        // console.log(accs);
      })(accs);
    }
  }

  transferAccBalance(acc, index) {
    console.log(acc);
    const globaldt = this._global.getCurrentFinancialYear();
    let dt = new Date();
    dt.setFullYear(dt.getFullYear() - 1);

    const prevyr = this._global.getSpecificFinancialYear(dt.getTime());
    const dataobj = {
      fromdt: globaldt.fromdt,
      todt: globaldt.todt,
      prevfromdt: prevyr.fromdt,
      prevtodt: prevyr.todt,
    };

    // console.log(globaldt, prevyr, dataobj);
    // return;
    this._rest.postData(acc.filenm, acc.api, dataobj).subscribe((Response) => {
      this.transferaccs[index].status = "completed";
      console.log(this.transferaccs);
      for (let i in this.sessionData[0].transferAcc) {
        for (let tranacc of this.transferaccs) {
          console.log(
            this.sessionData[0].transferAcc[i].transferaccs,
            tranacc.columnNm,
            this.sessionData[0].transferAcc[i].transferaccs === tranacc.columnNm
          );
          if (
            this.sessionData[0].transferAcc[i].transferaccs === tranacc.columnNm
          ) {
            this.sessionData[0].transferAcc[i].status = tranacc.status;
            break;
          }
        }
      }
      console.log("this.sessionData", this.sessionData);
      this._session.setData("userkey", this.sessionData);
    });
  }
}
