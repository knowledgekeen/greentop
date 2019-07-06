import { Component, OnInit } from '@angular/core';
import { RESTService } from '../rest.service';

@Component({
  selector: 'app-addexpenditure',
  templateUrl: './addexpenditure.component.html',
  styleUrls: ['./addexpenditure.component.css']
})
export class AddexpenditureComponent implements OnInit {
  allaccheads: any = null;
  expensedate: any = null;
  expensetype: any = null;
  acchead: any = null;
  particulars: any = null;
  disablebtn: any = false;

  constructor(private _rest: RESTService) { }

  ngOnInit() {
    this.getAllAccountHeads();
  }

  getAllAccountHeads() {
    this.allaccheads = null;
    this._rest.getData("expenditure.php", "getAllAccountHeads")
      .subscribe(Response => {
        console.log(Response)
        if (Response) {
          this.allaccheads = Response["data"];
        }
      });
  }
}
