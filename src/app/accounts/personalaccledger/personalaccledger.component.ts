import { Component, OnInit } from "@angular/core";
import { GlobalService } from "src/app/global.service";
import { RESTService } from "src/app/rest.service";

@Component({
  selector: "app-personalaccledger",
  templateUrl: "./personalaccledger.component.html",
  styleUrls: ["./personalaccledger.component.css"],
})
export class PersonalaccledgerComponent implements OnInit {
  personalaccs: any = null;
  filtercust: string = null;
  finanyr: any = null;
  allexpenditures: any = null;
  allreceipts: any = null;
  ledgerhist: any = null;
  totaldebit: number = null;
  totalcredit: number = null;
  selectedacc: string = null;

  constructor(private _global: GlobalService, private _rest: RESTService) {}

  ngOnInit() {
    this.finanyr = this._global.getCurrentFinancialYear();
    // console.log(this.finanyr);
    this.getDistinctPersonalAccs();
  }

  getDistinctPersonalAccs() {
    const urldata =
      "fromdt=" + this.finanyr.fromdt + "&todt=" + this.finanyr.todt;
    this._rest
      .getData("accounts.php", "getDistinctPersonalAccs", urldata)
      .subscribe(
        (Response) => {
          this.personalaccs =
            Response && Response["data"] ? Response["data"] : null;
          for (let i = 0; i < this.personalaccs.length; i++) {
            for (let j = i + 1; j < this.personalaccs.length; j++) {
              if (
                this.personalaccs[i].personalaccid ===
                this.personalaccs[j].personalaccid
              ) {
                this.personalaccs.splice(j, 1);
                j--;
              }
            }
          }
          this.personalaccs = this.personalaccs.sort(
            this._global.sortArr("name")
          );
        },
        (error) => {
          this.personalaccs = [];
        }
      );
  }

  fetchPersonalAccountDetails(acc) {
    this.ledgerhist = null;
    // console.log(acc)
    this.selectedacc = acc.name;
    this.getExpendituresOfPersonalAcc(acc.personalaccid)
      .then((expenditures) => {
        // console.log(expenditures);
        this.getReceiptsOfPersonalAcc(acc.personalaccid)
          .then((receipts) => {
            // console.log(receipts);
            this.filterData();
          })
          .catch((errrec) => {
            alert(
              "Error fetching cash receipts, kindly refresh or try again later"
            );
          });
      })
      .catch((errexp) => {
        alert("Error fetching expenditures, kindly refresh or try again later");
      });
  }

  // Debit - Expenditures
  getExpendituresOfPersonalAcc(personalaccid) {
    this.allexpenditures = null;
    const _this = this;
    const promise = new Promise((resolve, reject) => {
      const urldata = `fromdt=${_this.finanyr.fromdt}&todt=${_this.finanyr.todt}&personalaccid=${personalaccid}`;
      _this._rest
        .getData("accounts.php", "getExpendituresOfPersonalAcc", urldata)
        .subscribe(
          (Response) => {
            _this.allexpenditures =
              Response && Response["data"] ? Response["data"] : null;
            resolve(_this.allexpenditures);
          },
          (err) => {
            reject(err);
          }
        );
    });
    return promise;
  }

  // Credit - Expenditures
  getReceiptsOfPersonalAcc(personalaccid) {
    this.allreceipts = null;
    const _this = this;
    const promise = new Promise((resolve, reject) => {
      const urldata = `fromdt=${_this.finanyr.fromdt}&todt=${_this.finanyr.todt}&personalaccid=${personalaccid}`;
      _this._rest
        .getData("accounts.php", "getReceiptsOfPersonalAcc", urldata)
        .subscribe(
          (Response) => {
            _this.allreceipts =
              Response && Response["data"] ? Response["data"] : null;
            resolve(_this.allreceipts);
          },
          (err) => {
            reject(err);
          }
        );
    });
    return promise;
  }

  filterData() {
    this.ledgerhist = null;
    this.totalcredit = 0;
    this.totaldebit = 0;
    let tmparr = [];

    //Debit - Expenditure Payments
    if (this.allexpenditures && this.allexpenditures.length > 0) {
      for (let i = 0; i < this.allexpenditures.length; i++) {
        let tmpobj = {
          id: tmparr.length,
          dated: this.allexpenditures[i].expdate,
          particular: this.allexpenditures[i].particulars,
          debit: this.allexpenditures[i].amount,
          credit: 0,
          balance: 0,
        };
        tmparr.push(tmpobj);
      }
    }

    //Credit - Receipts cash or bank
    if (this.allreceipts && this.allreceipts.length > 0) {
      for (let i = 0; i < this.allreceipts.length; i++) {
        let tmpobj = {
          id: tmparr.length,
          dated: this.allreceipts[i].receiptdate,
          particular: this.allreceipts[i].particulars,
          debit: 0,
          credit: this.allreceipts[i].amount,
          balance: 0,
        };
        tmparr.push(tmpobj);
      }
    }

    tmparr.sort(this._global.sortArr("dated"));
    this.ledgerhist = tmparr;

    let tmpbalance =
      parseFloat(this.ledgerhist[0].debit) > 0
        ? parseFloat(this.ledgerhist[0].debit)
        : parseFloat(this.ledgerhist[0].credit);
    this.ledgerhist[0].balance = tmpbalance;
    for (let k = 1; k < this.ledgerhist.length; k++) {
      this.ledgerhist[k].balance =
        tmpbalance +
        parseFloat(this.ledgerhist[k].debit) -
        parseFloat(this.ledgerhist[k].credit);
      tmpbalance = parseFloat(this.ledgerhist[k].balance);
    }

    for (const j in this.ledgerhist) {
      this.totaldebit += parseFloat(this.ledgerhist[j].debit);
      this.totalcredit += parseFloat(this.ledgerhist[j].credit);
    }
  }
}
