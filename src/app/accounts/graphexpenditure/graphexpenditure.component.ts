import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/global.service';
import { RESTService } from 'src/app/rest.service';
import * as Highcharts from "highcharts";
import * as moment from "moment";
import Drilldown from 'highcharts/modules/drilldown';
Drilldown(Highcharts);

@Component({
  selector: 'app-graphexpenditure',
  templateUrl: './graphexpenditure.component.html',
  styleUrls: ['./graphexpenditure.component.css']
})
export class GraphexpenditureComponent implements OnInit {
  allexpenditures:any = null;

  constructor(private _global: GlobalService, private _rest: RESTService) { }

  ngOnInit() {
    this.getExpendituresFromTo();
  }

  getExpendituresFromTo() {
    let currfinanyr = this._global.getCurrentFinancialYear();
    let getobj = "fromdt=" + currfinanyr.fromdt + "&todt=" + currfinanyr.todt;
    this._rest.getData("expenditure.php", "getExpendituresFromTo", getobj)
      .subscribe(Response => {
        if (Response) {
          this.allexpenditures = Response["data"];
          console.log(this.allexpenditures);
          this.filterDataForGraph();
        }
        else {
          this.allexpenditures = false;
        }
      });
  }

  filterDataForGraph(){
    const copyexp = JSON.parse(JSON.stringify(this.allexpenditures)); //Just a copy to keep original safe

    const mastseries = [];
    const drilldownseries = [];
    for(let i=0; i<copyexp.length; i++){
      let total = parseFloat(copyexp[i].amount);
      let dt = new Date(parseFloat(copyexp[i].expdate));
      let tmpobj={
        name:copyexp[i].accheadnm,
        id:copyexp[i].accheadnm,
        type: "column",
        data:[[moment(dt).format("DD-MM-YYYY"), parseFloat(copyexp[i].amount)]]
      };
      for(let j=i+1; j<copyexp.length; j++){
        if(copyexp[i].accheadnm === copyexp[j].accheadnm){
          dt = new Date(parseFloat(copyexp[j].expdate));
          total += parseFloat(copyexp[j].amount);
          tmpobj.data.push([moment(dt).format("DD-MM-YYYY"),parseFloat(copyexp[j].amount)]);
          copyexp.splice(j,1);
          j--;
        }
      }
      let mastobj = {
        name: copyexp[i].accheadnm,
        y: total,
        type: "column",
        drilldown: copyexp[i].accheadnm
      }
      mastseries.push(mastobj)
      drilldownseries.push(tmpobj);
    }
    this.plotExpenditureGraph(mastseries, drilldownseries);
  }

  plotExpenditureGraph(mastseries, drilldownseries){
    // Create the chart
    
    Highcharts.chart("container", {
      chart: {
        type: "column"
      },
      title: {
          text: "EXPENDITURES CURRENT FINANCIAL YEAR"
      },
      xAxis: {
        title:{
          text:"Account Head's"
        },
          type: "category"
      },
      yAxis: {
          title: {
              text: "Amount In Rupees (INR)"
          }

      },
      credits: {
        enabled: false
      },
      legend: {
          enabled: false
      },
      plotOptions: {
          series: {
              borderWidth: 0,
              dataLabels: {
                  enabled: true,
                  format: "{point.y}"
              }
          }
      },

      tooltip: {
          headerFormat: "<span style='font-size:11px'>{series.name}</span><br>",
          pointFormat: "<span style='color:{point.color}'>{point.name}</span>: <b>{point.y:.2f}</b> INR<br/>"
      },

      series: [ {
        name: "Expenditures",
        colorByPoint: true,
        type: "column",
        turboThreshold: 0,
        cropThreshold: 500,
        data: mastseries
      }],
      drilldown: {
          series: drilldownseries
      }
    });
  }
}