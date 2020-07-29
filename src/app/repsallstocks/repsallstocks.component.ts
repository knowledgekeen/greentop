import { Component, OnInit } from "@angular/core";
import * as Highcharts from "highcharts";
import { RESTService } from "../rest.service";
import { GlobalService } from "../global.service";
import { IntervalService } from '../interval.service';
import { CONSTANTS } from '../app.constants';

@Component({
  selector: "app-repsallstocks",
  templateUrl: "./repsallstocks.component.html",
  styleUrls: ["./repsallstocks.component.css"]
})
export class RepsallstocksComponent implements OnInit {
  allstock: any = null;
  chartdata: any = null;
  selectedmat: any = null;
  histarr = new Array();
  hidegraph:boolean = false;
  editStockReg: any = null;
  successStkDetsMsg: any = null;
  constructor(private _rest: RESTService, private _global: GlobalService, private _interval: IntervalService) { }

  ngOnInit() {
    this.getAllStocks();
  }

  getAllStocks() {
    this._rest
      .getData("reports_stock.php", "getAllStocks", null)
      .subscribe(Response => {
        let removedbags = null;
        if (Response) {
          this.allstock = Response["data"]?Response["data"]:null;
          for(let i in this.allstock){
            if(this.allstock[i].name === CONSTANTS.HDPE_BAGS){
              removedbags = this.allstock.splice(i,1);
              break;
            }
          }
          this.allstock.push(removedbags[0]);
          this.filterDataForChart();
        }
      });
  }

  filterDataForChart() {
    let testdata: any = new Array();
    for (let i in this.allstock) {
      let tmpObj = null;
      if (
        this.allstock[i].rawmatid != null &&
        this.allstock[i].prodid == null
      ) {
        tmpObj = {
          name: this.allstock[i].name,
          y: parseFloat(this.allstock[i].quantity)
        };
      } else if (
        this.allstock[i].rawmatid == null &&
        this.allstock[i].prodid != null
      ) {
        tmpObj = {
          name: this.allstock[i].prodname,
          y: parseFloat(this.allstock[i].quantity)
        };
      }
      if (tmpObj) {
        testdata.push(tmpObj);
      }
    }
    this.chartdata = testdata;
    this.plot_chart();
  }

  plot_chart() {
    //console.log(this.chartdata);
    // Build the chart
    Highcharts.chart("container", {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: "pie"
      },
      exporting: { enabled: false },
      title: {
        text: null
      },
      credits: {
        enabled: false
      },
      tooltip: {
        pointFormat: "Stock Available: <b>{point.y: .3f}</b>"
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          dataLabels: {
            enabled: false
          },
          showInLegend: true
        }
      },
      series: [
        {
          type: "pie",
          data: this.chartdata
        }
      ]
    });
  }

  selectRawMaterialOrProduct(stock) {
    this.histarr = [];
    this.selectedmat = stock;
    let finanyear = this._global.getCurrentFinancialYear();
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
      .subscribe(Response => {
        if (Response) {
          let data = Response["data"];
          for (let i = 0; i < data.length; i++) {
            let tmpObj = {
              stockregid: data[i].stockregid,
              date: data[i].date,
              openingstock: null,
              inout: data[i].INorOUT,
              quantity: data[i].quantity,
              closingstock: null,
              remarks: data[i].remarks
            };

            if (i == 0) {
              tmpObj.openingstock = 0;
              tmpObj.closingstock = parseFloat(data[i].quantity);
            } else {
              tmpObj.openingstock = this.histarr[i - 1].closingstock;

              if (data[i].INorOUT == "IN") {
                tmpObj.closingstock =
                  parseFloat(tmpObj.openingstock) +
                  parseFloat(data[i].quantity);
              } else {
                tmpObj.closingstock =
                  parseFloat(tmpObj.openingstock) -
                  parseFloat(data[i].quantity);
              }
            }
            this.histarr.push(tmpObj); //if you don't want to show the first row of opening balance in the history just move this line in else {}
          } //Loop over
          //console.log(this.histarr);
        } //Response
      });
  }

  editStockDetails(hist){
    console.log("editStockReg", hist)
    // this.selectedmat = false;
    this.editStockReg = hist;
  }

  saveStockRegDetails(stkDets){
    this._rest.postData("stock.php", "updateStockDetails", this.editStockReg)
    .subscribe(Response=>{
      this.successStkDetsMsg ="Updated Stock Details";
      this._interval.settimer().then(Resp=>{
        this.successStkDetsMsg = null;
      })
    });
  }
}
