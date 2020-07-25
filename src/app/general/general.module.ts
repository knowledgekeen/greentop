import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchclientPipe } from '../searchclient.pipe';
import { CompanyaddressComponent } from '../companyaddress/companyaddress.component';

// This is a Generic module for all the common components to be shared between different modules
@NgModule({
  declarations: [
    SearchclientPipe,
    CompanyaddressComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [SearchclientPipe, CompanyaddressComponent]
})
export class GeneralModule { }
