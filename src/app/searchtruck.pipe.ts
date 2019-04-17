import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "searchtruck"
})
export class SearchtruckPipe implements PipeTransform {
  transform(itemArray: any[], searchText?: any): any {
    if (!itemArray) {
      return [];
    }
    if (!searchText) {
      return itemArray;
    }
    if (itemArray && searchText) {
      return itemArray.filter(it => {
        return it.lorryno.toLowerCase().includes(searchText);
      });
    }
  }
}
