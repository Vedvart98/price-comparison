import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const PINCODE_KEY = 'pc_pincode';
const CITY_KEY    = 'pc_city';

@Injectable({ providedIn: 'root' })
export class PincodeService {
  private _pincode$ = new BehaviorSubject<string>(
    localStorage.getItem(PINCODE_KEY) || '110001'
  );
  private _city$ = new BehaviorSubject<string>(
    localStorage.getItem(CITY_KEY) || 'New Delhi'
  );

  pincode$ = this._pincode$.asObservable();
  city$    = this._city$.asObservable();

  get pincode() { return this._pincode$.value; }
  get city()    { return this._city$.value; }

  set(pincode: string, city?: string) {
    this._pincode$.next(pincode);
    localStorage.setItem(PINCODE_KEY, pincode);
    if (city) {
      this._city$.next(city);
      localStorage.setItem(CITY_KEY, city);
    }
  }

  static KNOWN: Record<string, string> = {
    '110001': 'New Delhi',   '400001': 'Mumbai',
    '560001': 'Bengaluru',   '600001': 'Chennai',
    '700001': 'Kolkata',     '500001': 'Hyderabad',
    '411001': 'Pune',        '380001': 'Ahmedabad',
  };

  cityFor(pin: string) { return PincodeService.KNOWN[pin] || pin; }
}
