import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "searchclient"
})
export class SearchclientPipe implements PipeTransform {
  transform(itemArray: any[], searchText?: any): any {
    if (!itemArray) {
      return [];
    }
    if (!searchText) {
      return itemArray;
    }
    if (itemArray && searchText) {
      return itemArray.filter(it => {
        return it.name.toLowerCase().includes(searchText);
      });
    }
  }
}
