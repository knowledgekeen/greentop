import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchclientPipe } from '../searchclient.pipe';

// This is a Generic module for all the common components to be shared between different modules
@NgModule({
  declarations: [SearchclientPipe],
  imports: [
    CommonModule
  ],
  exports: [SearchclientPipe]
})
export class GeneralModule { }
