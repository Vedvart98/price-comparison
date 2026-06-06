import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PincodeService } from '../../core/services/pincode.service';
import { CompareRequest } from '../../core/models/comparison.models';

const SUGGESTIONS = [
  'milk, bread, eggs',
  'coconut oil, atta, sugar',
  'shampoo, soap, toothpaste',
  'phone charger, earphones',
  'chips, biscuits, cold drink',
  'rice, dal, ghee',
];

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<section class="hero">
  <div class="hero-bg">
    <div class="hero-bg-shape hero-bg-shape--1"></div>
    <div class="hero-bg-shape hero-bg-shape--2"></div>
    <div class="hero-bg-shape hero-bg-shape--3"></div>
  </div>

  <div class="hero-content">
    <div class="hero-badge animate-slide-down">
      <i class="ti ti-rosette-discount" aria-hidden="true"></i>
      Save up to 40% on your grocery bill
    </div>

    <h1 class="hero-title animate-fade-in-up">
      Find the <span class="text-gradient">best prices</span><br />
      across all platforms
    </h1>

    <p class="hero-sub animate-fade-in-up">
      Type your shopping list — we'll scan Zepto, Blinkit, Swiggy Instamart & more
    </p>

    <div class="search-card animate-scale-in">
      <div class="search-main-row">
        <div class="input-wrap input-wrap--grow">
          <i class="ti ti-search input-icon" aria-hidden="true"></i>
          <input
            class="search-input"
            type="text"
            placeholder="Search for items — e.g. milk, eggs, bread..."
            [(ngModel)]="userInput"
            (keydown.enter)="submit()"
            aria-label="Items to compare"
          />
        </div>
        <div class="input-wrap input-wrap--pin">
          <i class="ti ti-map-pin input-icon" aria-hidden="true"></i>
          <input
            class="search-input pin-input"
            type="text"
            placeholder="Pincode"
            [(ngModel)]="pincode"
            maxlength="6"
            (blur)="onPincodeBlur()"
            aria-label="Delivery pincode"
          />
        </div>
        <button class="btn-search" (click)="submit()" [disabled]="!canSubmit()">
          <span>Compare</span>
          <i class="ti ti-arrow-right btn-arrow" aria-hidden="true"></i>
        </button>
      </div>

      <div class="search-tags" *ngIf="parsedItems.length">
        <div class="tags-label">Your items:</div>
        <span class="tag" *ngFor="let item of parsedItems">
          {{ item }}
          <i class="ti ti-x tag-close" aria-hidden="true"></i>
        </span>
      </div>
    </div>

    <div class="suggestions-row animate-fade-in">
      <span class="suggestions-label">
        <i class="ti ti-sparkles" aria-hidden="true"></i> Try:
      </span>
      <button
        class="suggestion-chip"
        *ngFor="let s of suggestions"
        (click)="useSuggestion(s)"
      >
        {{ s }}
      </button>
    </div>
  </div>
</section>
  `,
  styles: [`
    .hero {
      position: relative;
      background: linear-gradient(135deg, #FFFAF5 0%, #FFF5EB 50%, #FFF0E0 100%);
      overflow: hidden;
      padding: 0;
    }
    .hero-bg {
      position: absolute;
      inset: 0;
      pointer-events: none;
      overflow: hidden;
    }
    .hero-bg-shape {
      position: absolute;
      border-radius: 50%;
      opacity: 0.15;
    }
    .hero-bg-shape--1 {
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, #FC8019 0%, transparent 70%);
      top: -100px;
      right: -100px;
      animation: float 6s ease-in-out infinite;
    }
    .hero-bg-shape--2 {
      width: 250px;
      height: 250px;
      background: radial-gradient(circle, #FC8019 0%, transparent 70%);
      bottom: -60px;
      left: -60px;
      animation: float 8s ease-in-out infinite;
    }
    .hero-bg-shape--3 {
      width: 150px;
      height: 150px;
      background: radial-gradient(circle, #FC8019 0%, transparent 70%);
      top: 50%;
      left: 60%;
      animation: float 10s ease-in-out infinite;
    }
    .hero-content {
      position: relative;
      max-width: 800px;
      margin: 0 auto;
      padding: 48px 24px 40px;
      text-align: center;
    }
    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 16px;
      background: var(--color-background-primary);
      border: 1px solid var(--color-border-secondary);
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
      color: var(--color-primary-dark);
      margin-bottom: 20px;
      box-shadow: var(--shadow-sm);
    }
    .hero-badge .ti {
      font-size: 14px;
    }
    .hero-title {
      font-size: 42px;
      font-weight: 800;
      line-height: 1.15;
      margin-bottom: 12px;
      letter-spacing: -1px;
      color: var(--color-text-primary);
    }
    .text-gradient {
      background: linear-gradient(135deg, #FC8019, #FF5200);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .hero-sub {
      font-size: 16px;
      color: var(--color-text-secondary);
      margin-bottom: 28px;
      line-height: 1.6;
      max-width: 500px;
      margin-left: auto;
      margin-right: auto;
    }
    .search-card {
      background: var(--color-background-primary);
      border-radius: var(--border-radius-lg);
      padding: 16px;
      box-shadow: var(--shadow-lg);
      border: 1px solid var(--color-border-secondary);
      text-align: left;
    }
    .search-main-row {
      display: flex;
      gap: 10px;
      align-items: stretch;
    }
    .input-wrap {
      position: relative;
    }
    .input-wrap--grow {
      flex: 1;
    }
    .input-wrap--pin {
      width: 140px;
      flex-shrink: 0;
    }
    .input-icon {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--color-text-tertiary);
      font-size: 18px;
      pointer-events: none;
      transition: color var(--transition-fast);
    }
    .input-wrap:focus-within .input-icon {
      color: var(--color-primary);
    }
    .search-input {
      width: 100%;
      padding: 14px 16px 14px 44px;
      border: 2px solid var(--color-border-secondary);
      border-radius: var(--border-radius-md);
      background: var(--color-background-secondary);
      color: var(--color-text-primary);
      font-size: 15px;
      height: 52px;
      transition: all var(--transition-fast);
      outline: none;
    }
    .search-input:focus {
      border-color: var(--color-primary);
      background: var(--color-background-primary);
      box-shadow: 0 0 0 3px rgba(252, 128, 25, 0.1);
    }
    .search-input::placeholder {
      color: var(--color-text-tertiary);
    }
    .pin-input {
      text-align: center;
      letter-spacing: 2px;
      font-weight: 600;
      padding: 14px 12px 14px 36px;
    }
    .btn-search {
      padding: 0 28px;
      height: 52px;
      background: linear-gradient(135deg, #FC8019, #FF5200);
      color: #fff;
      border: none;
      border-radius: var(--border-radius-md);
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      white-space: nowrap;
      transition: all var(--transition-fast);
      box-shadow: 0 4px 12px rgba(252, 128, 25, 0.3);
      flex-shrink: 0;
    }
    .btn-search:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(252, 128, 25, 0.4);
    }
    .btn-search:active:not(:disabled) {
      transform: translateY(0);
    }
    .btn-search:disabled {
      opacity: 0.45;
      cursor: not-allowed;
      box-shadow: none;
    }
    .btn-arrow {
      transition: transform var(--transition-fast);
    }
    .btn-search:hover:not(:disabled) .btn-arrow {
      transform: translateX(3px);
    }
    .search-tags {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
      margin-top: 14px;
      padding-top: 14px;
      border-top: 1px solid var(--color-border-tertiary);
    }
    .tags-label {
      font-size: 12px;
      font-weight: 500;
      color: var(--color-text-secondary);
    }
    .tag {
      font-size: 12px;
      padding: 5px 12px;
      background: var(--color-primary-light);
      color: var(--color-primary-dark);
      border: 1px solid rgba(252, 128, 25, 0.2);
      border-radius: 20px;
      font-weight: 500;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      animation: scaleIn 0.2s ease;
    }
    .tag-close {
      font-size: 12px;
      cursor: pointer;
      opacity: 0.6;
    }
    .tag-close:hover {
      opacity: 1;
    }
    .suggestions-row {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
      justify-content: center;
      margin-top: 20px;
    }
    .suggestions-label {
      font-size: 13px;
      color: var(--color-text-secondary);
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .suggestions-label .ti {
      color: var(--color-primary);
      font-size: 16px;
    }
    .suggestion-chip {
      font-size: 12px;
      padding: 6px 14px;
      background: var(--color-background-primary);
      border: 1px solid var(--color-border-secondary);
      border-radius: 20px;
      color: var(--color-text-secondary);
      cursor: pointer;
      transition: all var(--transition-fast);
      white-space: nowrap;
    }
    .suggestion-chip:hover {
      border-color: var(--color-primary);
      color: var(--color-primary-dark);
      background: var(--color-primary-light);
      transform: translateY(-1px);
    }
    @media (max-width: 640px) {
      .hero-title {
        font-size: 28px;
      }
      .hero-content {
        padding: 32px 16px 28px;
      }
      .search-main-row {
        flex-direction: column;
      }
      .input-wrap--pin {
        width: 100%;
      }
      .btn-search {
        justify-content: center;
        height: 48px;
      }
      .hero-badge {
        font-size: 11px;
      }
      .hero-sub {
        font-size: 14px;
      }
    }
  `]
})
export class SearchComponent implements OnInit {
  @Output() search = new EventEmitter<CompareRequest>();

  userInput = '';
  pincode   = '';
  suggestions = SUGGESTIONS;

  constructor(private pincodeService: PincodeService) {}

  ngOnInit() {
    this.pincode = this.pincodeService.pincode;
  }

  get parsedItems(): string[] {
    return this.userInput.split(',').map(s => s.trim()).filter(s => s.length > 1);
  }

  canSubmit(): boolean {
    return this.parsedItems.length > 0 && this.pincode.length === 6;
  }

  onPincodeBlur() {
    if (this.pincode.length === 6) {
      this.pincodeService.set(this.pincode, this.pincodeService.cityFor(this.pincode));
    }
  }

  useSuggestion(s: string) {
    this.userInput = s;
  }

  submit() {
    if (!this.canSubmit()) return;
    this.search.emit({ userInput: this.userInput, pincode: this.pincode });
  }
}
