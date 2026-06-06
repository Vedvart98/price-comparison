import { Pipe, PipeTransform } from '@angular/core';

const DISPLAY: Record<string, string> = {
  zepto:            'Zepto',
  blinkit:          'Blinkit',
  swiggy_instamart: 'Swiggy Instamart',
  bigbasket:        'BigBasket',
  jiomart:          'JioMart',
};

@Pipe({ name: 'platformName', standalone: true })
export class PlatformNamePipe implements PipeTransform {
  transform(value: string): string {
    return DISPLAY[value?.toLowerCase()] ?? value;
  }
}
