import { Component, OnInit } from '@angular/core';
import { RESTService } from 'src/app/rest.service';
import * as Highcharts from "highcharts";

@Component({
  selector: 'app-districtwisesales',
  templateUrl: './districtwisesales.component.html',
  styleUrls: ['./districtwisesales.component.css']
})
export class DistrictwisesalesComponent implements OnInit {
  allsales: any = null;
  totalsalesqty: number = 0;

  constructor(private _rest:RESTService) { }

  ngOnInit() {
    this.getDistrictWiseSales();
  }

  getDistrictWiseSales(){
    this.totalsalesqty= 0;
    this._rest.getData("reports_stock.php", "getDistrictWiseSales")
      .subscribe(Response=>{
        if(Response && Response["data"]){
          this.allsales = Response["data"];
          this.allsales.map(item=> {
            this.totalsalesqty +=  parseFloat(item.totalquantity);
          })
          console.log(this.allsales);
          this.plot_bar_chart();
        }
      });
  }

  plot_bar_chart(){
    const totalquantity = this.allsales.map(item=> parseFloat(item.totalquantity));
    const district = this.allsales.map(item=> item.district);
      Highcharts.chart("container", {
        chart: {
            type: 'column'
        },
        title: {
            text: 'District Wise Sales'
        },
        credits: {
          enabled: false
        },
        exporting: { enabled: false },
        xAxis: {
            categories: district,
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Quantity (tons)'
            }
        },
        tooltip: {
            pointFormat: '<table><tr><td style="color:{series.color};padding:0">{point.key}: </td>' +
                '<td style="padding:0"><b>{point.y:.3f} tons</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [ {
            name: 'District',
            type:'column',
            data: totalquantity
    
        }]
    });
  }
}
