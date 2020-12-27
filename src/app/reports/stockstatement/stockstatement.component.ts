import { Component, OnInit } from "@angular/core";
import { RESTService } from "src/app/rest.service";
import { CONSTANTS } from "src/app/app.constants";
import { GlobalService } from "src/app/global.service";
import { IntervalService } from "src/app/interval.service";
import * as moment from "moment";

@Component({
  selector: "app-stockstatement",
  templateUrl: "./stockstatement.component.html",
  styleUrls: ["./stockstatement.component.css"],
})
export class StockstatementComponent implements OnInit {
  allstock: any = null;
  bags: any = CONSTANTS.HDPE_BAGS;
  histarr = new Array();
  selectedmat: any = null;
  editStockReg: any = null;
  successStkDetsMsg: any = null;
  todaydt: any = null;
  filtereddt: any = null;
  filterfromdt: any = null;
  filtertodt: any = null;
  invaliddt: boolean = false;
  masterselectedstockdata: any = null;
  prevrecfromfilter: any = null;
  isLoading: boolean = false;

  constructor(
    private _rest: RESTService,
    private _global: GlobalService,
    private _interval: IntervalService
  ) {}

  ngOnInit(): void {
    this.getAllStocks();
    this.todaydt = new Date();
    this.filtereddt = this._global.getCurrentFinancialYear();
  }

  getAllStocks() {
    this.allstock = [];
    this._rest
      .getData("reports_stock.php", "getAllStocks", null)
      .subscribe((Response) => {
        let removedbags = null;
        if (Response) {
          let stock = Response["data"] ? Response["data"] : null;
          for (let i in stock) {
            if (stock[i].name === CONSTANTS.HDPE_BAGS) {
              removedbags = stock.splice(i, 1);
              break;
            }
          }
          stock.push(removedbags[0]);
          for (const j in stock) {
            let tmpobj = {
              stockid: stock[j].stockid,
              quantity: parseFloat(stock[j].quantity),
              name: stock[j].name ? stock[j].name : stock[j].prodname,
              isFinishedProd: stock[j].prodname ? true : false,
            };
            this.allstock.push(tmpobj);
          }
        }
      });
  }

  selectRawMaterialOrProduct(stock, status = false) {
    this.isLoading = true;
    this.histarr = [];
    this.prevrecfromfilter = null;
    this.selectedmat = stock;
    this.filterfromdt = null;
    this.filtertodt = null;
    let finanyear = this._global.getCurrentFinancialYear();
    this.filtereddt = finanyear;
    //console.log(finanyear);
    let geturl =
      "stockid=" +
      stock.stockid +
      "&fromdt=" +
      finanyear.fromdt +
      "&todt=" +
      finanyear.todt;
    this._rest
      .getData("stock.php", "getStockHistory", geturl)
      .subscribe((Response) => {
        if (Response) {
          const data = Response["data"] ? Response["data"] : null;
          this.filterData(data).then((filtereddata) => {
            if (status) {
              // this.updateDataToStockHistory(stock);
            } else {
              this.isLoading = false;
            }
          });
          //console.log(this.histarr);
        } //Response
        else {
          this.isLoading = false;
        }
      });
  }

  filterData(data) {
    const _this = this;
    _this.histarr = [];
    const promise = new Promise((resolve, reject) => {
      for (let i = 0; i < data.length; i++) {
        let tmpObj = {
          stockregid: data[i].stockregid,
          date: data[i].date,
          openingstock: null,
          inout: data[i].INorOUT,
          quantity: data[i].quantity,
          closingstock: null,
          remarks: data[i].remarks,
        };

        if (i == 0) {
          if (
            !this.prevrecfromfilter ||
            (this.prevrecfromfilter && this.prevrecfromfilter.length <= 0)
          ) {
            // console.log("If", data[0]);
            tmpObj.openingstock = data[i].closingstock
              ? data[i].closingstock
              : parseFloat(data[i].quantity);
            tmpObj.quantity = 0;
            tmpObj.closingstock = data[i].closingstock
              ? data[i].closingstock
              : parseFloat(data[i].quantity);
          } else {
            // console.log("Else");
            tmpObj.openingstock = parseFloat(
              this.prevrecfromfilter.closingstock
            );
            tmpObj.closingstock =
              tmpObj.inout === CONSTANTS.IN
                ? parseFloat(tmpObj.openingstock) + parseFloat(tmpObj.quantity)
                : parseFloat(tmpObj.openingstock) - parseFloat(tmpObj.quantity);
          }
        } else {
          tmpObj.openingstock = _this.histarr[i - 1].closingstock;

          if (data[i].INorOUT == "IN") {
            tmpObj.closingstock =
              parseFloat(tmpObj.openingstock) + parseFloat(data[i].quantity);
          } else {
            tmpObj.closingstock =
              parseFloat(tmpObj.openingstock) - parseFloat(data[i].quantity);
          }
        }
        _this.histarr.push(tmpObj); //if you don't want to show the first row of opening balance in the history just move this line in else {}
      } //Loop over
      resolve(_this.histarr);
    });
    this.prevrecfromfilter = null;
    return promise;
  }

  /* updateDataToStockHistory(stock){
    // console.log(this.histarr);
    const finanyear = this._global.getCurrentFinancialYear();
    const postobj={
      stockid: stock.stockid,
      fromdt: finanyear.fromdt,
      todt: finanyear.todt,
      stockhist: this.histarr
    };
    console.log(postobj)
    this._rest.postData("stock.php", "updateDataToStockHistory", postobj).subscribe(Response=>{
      // console.log(Response);
      if(Response && Response["data"]){
        this.selectRawMaterialOrProduct(stock, false);
      }
    });
  } */

  editStockDetails(hist) {
    // this.selectedmat = false;
    this.editStockReg = hist;
  }

  saveStockRegDetails(stkDets) {
    this._rest
      .postData("stock.php", "updateStockDetails", this.editStockReg)
      .subscribe((Response) => {
        this.successStkDetsMsg = "Updated Stock Details";
        this._interval.settimer().then((Resp) => {
          this.successStkDetsMsg = null;
        });
      });
  }

  autoFillDt() {
    if (this.filterfromdt)
      this.filterfromdt = this._global.getAutofillFormattedDt(
        this.filterfromdt
      );

    if (this.filtertodt)
      this.filtertodt = this._global.getAutofillFormattedDt(this.filtertodt);
  }

  filterStockStatementFromToDate() {
    this.filtereddt.fromdt = new Date(
      moment(this.filterfromdt, "DD-MM-YYYY").format("MM-DD-YYYY")
    ).getTime();
    this.filtereddt.todt = new Date(
      moment(this.filtertodt, "DD-MM-YYYY").format("MM-DD-YYYY")
    ).getTime();
    if (isNaN(this.filtereddt.fromdt) || isNaN(this.filtereddt.todt)) {
      this.invaliddt = true;
      this._interval.settimer().then((msg) => {
        this.invaliddt = false;
      });
      return;
    }
    this.getFromToStockHistory(
      this.selectedmat,
      this.filtereddt.fromdt,
      this.filtereddt.todt
    );
  }

  getFromToStockHistory(stock, fromdt, todt) {
    this.isLoading = true;
    // Step 1. Get all the data and filterit considering fromdt's financial year beginning date and todate
    // Step 2. Get all the data from the mentioned filter date (Both these calls should be in sequence)
    // Step 3. Get the first row's id from step 2 and search it from the data of Step 1.
    // Step 4. Once the data is matched you'll get the closing balance just on the above row of matched result.
    // Step 5. Now this closing balance record should be your opening stock of the new filtered data.

    // Step 1
    const fromdtfinanyr = this._global.getSpecificFinancialYear(fromdt);
    const geturl = `stockid=${stock.stockid}&fromdt=${fromdtfinanyr.fromdt}&todt=${fromdtfinanyr.todt}`;
    this._rest
      .getData("stock.php", "getStockHistory", geturl)
      .subscribe((Response) => {
        const data = Response && Response["data"] ? Response["data"] : null;
        this.filterData(data).then((Response) => {
          const annualdata: any = Response;
          // console.log(annualdata);
          let geturl = `stockid=${stock.stockid}&fromdt=${fromdt}&todt=${todt}`;
          this._rest
            .getData("stock.php", "getStockHistory", geturl)
            .subscribe((ResponseFilter) => {
              const data =
                ResponseFilter && ResponseFilter["data"]
                  ? ResponseFilter["data"]
                  : null;

              let prevdata = null;
              for (let i = 0; i < annualdata.length; i++) {
                if (annualdata[i].stockregid === data[0].stockregid) {
                  prevdata = annualdata[i - 1];
                  break;
                }
              }
              this.prevrecfromfilter = prevdata ? prevdata : null;
              this.filterData(data).then((Response) => {
                this.isLoading = false;
              });
            });
        });
      });
  }
}
