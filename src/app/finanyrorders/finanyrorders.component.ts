import { Component, OnInit } from "@angular/core";
import { GlobalService } from "../global.service";
import { RESTService } from "../rest.service";
import * as Highcharts from "highcharts";
import * as moment from "moment";

@Component({
  selector: "app-finanyrorders",
  templateUrl: "./finanyrorders.component.html",
  styleUrls: ["./finanyrorders.component.css"]
})
export class FinanyrordersComponent implements OnInit {
  allorders: any = null;
  finanyr: any = null;
  showgraph: boolean = true;
  constructor(private _global: GlobalService, private _rest: RESTService) {}

  ngOnInit() {
    this.getOrdersData();
  }

  getOrdersData() {
    this.allorders = null;
    this.finanyr = this._global.getCurrentFinancialYear();
    let geturl = "fromdt=" + this.finanyr.fromdt + "&todt=" + this.finanyr.todt;
    this._rest
      .getData("order.php", "getAllOrdersFromToDate", geturl)
      .subscribe(Response => {
        if (Response) {
          this.allorders = Response["data"];
          this.filterDataForChart();
        }
      });
  }

  filterDataForChart() {
    let allorderscopy = JSON.parse(JSON.stringify(this.allorders)); //DEEP COPY
    allorderscopy.sort(this._global.sortArr("orderdt"));

    let dataarr = new Array();
    //Data Filteration and combining to months and resp quantity
    for (const i in allorderscopy) {
      let tmpdt = new Date(parseInt(allorderscopy[i].orderdt));
      tmpdt.setDate(1);
      tmpdt.setHours(0, 0, 0, 0);
      let fromdt = tmpdt.getTime();
      let dt = new Date(fromdt);
      var lastDay = new Date(
        dt.getFullYear(),
        dt.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      );
      let todt = lastDay.getTime();

      let tmpobj = {
        mnt: null,
        qty: null
      };
      if (
        parseInt(allorderscopy[i].orderdt) >= fromdt &&
        parseInt(allorderscopy[i].orderdt) <= todt
      ) {
        let tmpdt = new Date(fromdt);
        tmpobj.mnt = moment(tmpdt).format("MMM");
        tmpobj.qty = parseInt(allorderscopy[i].quantity);
        dataarr.push(tmpobj);
      } else {
      }
    }

    console.log(dataarr);
    //Sagregating Months and total Quantities
    let data = [];
    let mnts = [];
    for (let i = 0; i < dataarr.length; i++) {
      let totalqty = dataarr[i].qty;
      for (let j = i + 1; j < dataarr.length; j++) {
        if (dataarr[i].mnt == dataarr[j].mnt) {
          totalqty += dataarr[j].qty;
          dataarr.splice(j, 1);
          j--;
        }
      }
      data.push(totalqty);
      mnts.push(dataarr[i].mnt);
    }
    this.plotChart(data, mnts);
  }

  plotChart(chartdata, mnts) {
    Highcharts.chart("orderschart", {
      title: {
        text: null
      },
      yAxis: {
        title: {
          text: "Number of Orders"
        }
      },
      xAxis: {
        categories: mnts
      },
      exporting: { enabled: false },
      legend: {
        layout: "vertical",
        align: "right",
        verticalAlign: "middle"
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        series: {
          label: {
            connectorAllowed: false
          }
        }
      },

      series: [
        {
          type: "line",
          name: "Total Orders",
          data: chartdata
        }
      ],

      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 500
            },
            chartOptions: {
              legend: {
                layout: "horizontal",
                align: "center",
                verticalAlign: "bottom"
              }
            }
          }
        ]
      }
    });
  }
}
