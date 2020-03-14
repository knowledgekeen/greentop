import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RESTService } from 'src/app/rest.service';

@Component({
  selector: 'app-searchdispatchchallan',
  templateUrl: './searchdispatchchallan.component.html',
  styleUrls: ['./searchdispatchchallan.component.css']
})
export class SearchdispatchchallanComponent implements OnInit {
  challanno: string = null;
  challanerror: boolean = false;

  constructor(private _rest: RESTService, private _router: Router) { }

  ngOnInit() { }

  searchChallan() {

  }
}
