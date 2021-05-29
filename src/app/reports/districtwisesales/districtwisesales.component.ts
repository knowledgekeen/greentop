import { Component, OnInit } from "@angular/core";
import { RESTService } from "src/app/rest.service";
import * as Highcharts from "highcharts";
import * as moment from "moment";
import { GlobalService } from "src/app/global.service";

@Component({
  selector: "app-districtwisesales",
  templateUrl: "./districtwisesales.component.html",
  styleUrls: ["./districtwisesales.component.css"],
})
export class DistrictwisesalesComponent implements OnInit {
  allsales: any = null;
  currfinanyr: any = null;
  totalFinanyrs: any = null;
  totalsalesqty: number = 0;

  constructor(private _rest: RESTService, private _global: GlobalService) {}

  ngOnInit() {
    this.currfinanyr = this._global.getCurrentFinancialYear();
    this.getAllFinancialYears();
    this.getDistrictWiseSales();
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
    this.currfinanyr = this._global.getSpecificFinancialYear(
      parseInt(finanyrs.fromdt)
    );
    // console.log(this.finanyr);
    this.getDistrictWiseSales();
  }

  getDistrictWiseSales() {
    this.totalsalesqty = 0;
    let geturl =
      "&fromdt=" + this.currfinanyr.fromdt + "&todt=" + this.currfinanyr.todt;

    this._rest
      .getData("reports_stock.php", "getDistrictWiseSales", geturl)
      .subscribe((Response) => {
        if (Response && Response["data"]) {
          this.allsales = Response["data"];
          this.allsales.map((item) => {
            this.totalsalesqty += parseFloat(item.totalquantity);
          });
          // console.log(this.allsales);
          this.plot_bar_chart();
        }
      });
  }

  plot_bar_chart() {
    console.log();
    const display_year = `${moment(new Date(this.currfinanyr.fromdt)).format(
      "YYYY"
    )}-${moment(new Date(this.currfinanyr.todt)).format("YYYY")}`;
    const totalquantity = this.allsales.map((item) =>
      parseFloat(item.totalquantity)
    );
    const district = this.allsales.map((item) => item.district);
    Highcharts.chart("container", {
      chart: {
        type: "column",
      },
      title: {
        text: `District Wise Sales for year: ${display_year}`,
      },
      credits: {
        enabled: false,
      },
      exporting: { enabled: false },
      xAxis: {
        categories: district,
        crosshair: true,
      },
      yAxis: {
        min: 0,
        title: {
          text: "Quantity (tons)",
        },
      },
      tooltip: {
        pointFormat:
          '<table><tr><td style="color:{series.color};padding:0">{point.key}: </td>' +
          '<td style="padding:0"><b>{point.y:.3f} tons</b></td></tr>',
        footerFormat: "</table>",
        shared: true,
        useHTML: true,
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
        },
      },
      series: [
        {
          name: "District",
          type: "column",
          data: totalquantity,
        },
      ],
    });
  }
}
