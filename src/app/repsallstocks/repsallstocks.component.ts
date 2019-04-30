import { Component, OnInit } from "@angular/core";
import * as Highcharts from "highcharts";
import { RESTService } from "../rest.service";
import { GlobalService } from "../global.service";

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
  hidegraph = false;
  constructor(private _rest: RESTService, private _global: GlobalService) {}

  ngOnInit() {
    this.getAllStocks();
    //this.plot_chart();
  }

  getAllStocks() {
    this._rest
      .getData("reports_stock.php", "getAllStocks", null)
      .subscribe(Response => {
        if (Response) {
          this.allstock = Response["data"];
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
          /*[
            {
              name: "Chrome",
              y: 61.41
            },
            {
              name: "Internet Explorer",
              y: 11.84
            },
            {
              name: "Firefox",
              y: 10.85
            },
            {
              name: "Edge",
              y: 4.67
            },
            {
              name: "Safari",
              y: 4.18
            },
            {
              name: "Other",
              y: 7.05
            }
          ]*/
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
}
