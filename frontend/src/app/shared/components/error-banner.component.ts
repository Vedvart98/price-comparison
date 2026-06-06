import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
<div class="error-banner" role="alert" *ngIf="message">
  <div class="error-inner">
    <div class="error-icon-wrap">
      <i class="ti ti-alert-circle" aria-hidden="true"></i>
    </div>
    <div class="error-content">
      <span class="error-title">Something went wrong</span>
      <span class="error-msg">{{ message }}</span>
    </div>
    <button class="error-dismiss" (click)="dismissed.emit()" aria-label="Dismiss error">
      <i class="ti ti-x" aria-hidden="true"></i>
    </button>
  </div>
</div>
  `,
  styles: [`
    .error-banner {
      background: #FEF2F2;
      border-bottom: 1px solid #FECACA;
    }
    .error-inner {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 24px;
    }
    .error-icon-wrap {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #FEE2E2;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #DC2626;
      font-size: 16px;
      flex-shrink: 0;
    }
    .error-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 1px;
    }
    .error-title {
      font-size: 13px;
      font-weight: 600;
      color: #991B1B;
    }
    .error-msg {
      font-size: 12px;
      color: #B91C1C;
    }
    .error-dismiss {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: none;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #991B1B;
      cursor: pointer;
      transition: background var(--transition-fast);
      flex-shrink: 0;
    }
    .error-dismiss:hover {
      background: #FEE2E2;
    }
    @media (max-width: 640px) {
      .error-inner {
        padding: 10px 16px;
      }
    }
  `]
})
export class ErrorBannerComponent {
  @Input() message: string | null = null;
  @Output() dismissed = new EventEmitter<void>();
}
