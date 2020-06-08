import { Component, OnInit, Input } from '@angular/core';
import { PrintService } from '../print.service';

@Component({
  selector: 'printdoc',
  templateUrl: './printdoc.component.html',
  styleUrls: ['./printdoc.component.css']
})
export class PrintdocComponent implements OnInit {
  @Input() printcomponentid;
  constructor(private _printService: PrintService) { }

  ngOnInit() {
  }


  printDocument() {
    this._printService.printDocument(this.printcomponentid);
  }
}
