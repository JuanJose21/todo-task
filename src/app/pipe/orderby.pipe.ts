import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy',
})
export class OrderBy implements PipeTransform {
  transform(
    array: Array<any>,
    orderField: string,
    orderType: boolean
  ): Array<any> {
    array.sort((a: any, b: any) => {
      const first = a[orderField];
      const second = b[orderField];
      if (first === undefined && second === undefined) {
        return 0;
      }
      if (first === undefined && second !== undefined) {
        return orderType ? 1 : -1;
      }
      if (first !== undefined && second === undefined) {
        return orderType ? -1 : 1;
      }
      if (first === second) {
        return 0;
      }
      return orderType
        ? first.toString().toLowerCase() > second.toString().toLowerCase()
          ? -1
          : 1
        : second.toString().toLowerCase() > first.toString().toLowerCase()
        ? -1
        : 1;
    });
    return array;
  }
}
