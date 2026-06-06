import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-not-found-chips',
  standalone: true,
  imports: [CommonModule],
  template: `
<div class="nfc" *ngIf="items.length">
  <div class="nfc-inner">
    <div class="nfc-icon">
      <i class="ti ti-search-off" aria-hidden="true"></i>
    </div>
    <div class="nfc-content">
      <span class="nfc-title">Not found on any platform</span>
      <div class="nfc-chips">
        <span class="nfc-chip" *ngFor="let item of items">{{ item }}</span>
      </div>
    </div>
  </div>
</div>
  `,
  styles: [`
    .nfc {
      background: #FFFBEB;
      border-bottom: 1px solid #FDE68A;
    }
    .nfc-inner {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 24px;
    }
    .nfc-icon {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #FEF3C7;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #D97706;
      font-size: 14px;
      flex-shrink: 0;
    }
    .nfc-content {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }
    .nfc-title {
      font-size: 12px;
      font-weight: 600;
      color: #92400E;
    }
    .nfc-chips {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }
    .nfc-chip {
      font-size: 11px;
      padding: 3px 10px;
      background: #FEF3C7;
      border: 1px solid #FDE68A;
      border-radius: 12px;
      color: #92400E;
    }
    @media (max-width: 640px) {
      .nfc-inner {
        padding: 8px 16px;
      }
    }
  `]
})
export class NotFoundChipsComponent {
  @Input() items: string[] = [];
}
