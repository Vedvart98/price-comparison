import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../core/services/loading.service';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
<div class="loader-overlay" *ngIf="loading$ | async" role="status" aria-live="polite">
  <div class="loader-card">
    <div class="loader-animation">
      <div class="loader-ring"></div>
      <div class="loader-ring loader-ring--inner"></div>
      <div class="loader-icon">
        <i class="ti ti-shopping-cart" aria-hidden="true"></i>
      </div>
    </div>
    <div class="loader-content">
      <p class="loader-title">Scanning platforms...</p>
      <p class="loader-sub">Fetching best prices from all stores</p>
    </div>
    <div class="loader-bars">
      <div class="loader-bar" style="animation-delay:0s"></div>
      <div class="loader-bar" style="animation-delay:0.15s"></div>
      <div class="loader-bar" style="animation-delay:0.3s"></div>
      <div class="loader-bar" style="animation-delay:0.45s"></div>
      <div class="loader-bar" style="animation-delay:0.6s"></div>
    </div>
  </div>
</div>
  `,
  styles: [`
    .loader-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      animation: fadeIn 0.2s ease;
    }
    .loader-card {
      background: var(--color-background-primary);
      border-radius: var(--border-radius-lg);
      padding: 36px 48px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      box-shadow: var(--shadow-xl);
      animation: scaleIn 0.3s ease;
      max-width: 320px;
    }
    .loader-animation {
      position: relative;
      width: 64px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .loader-ring {
      position: absolute;
      width: 100%;
      height: 100%;
      border: 3px solid var(--color-border-tertiary);
      border-top-color: var(--color-primary);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    .loader-ring--inner {
      width: 75%;
      height: 75%;
      border-top-color: #FF5200;
      animation-duration: 1s;
      animation-direction: reverse;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .loader-icon {
      position: relative;
      z-index: 1;
      color: var(--color-primary);
      font-size: 22px;
    }
    .loader-content {
      text-align: center;
    }
    .loader-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--color-text-primary);
      margin-bottom: 4px;
    }
    .loader-sub {
      font-size: 13px;
      color: var(--color-text-secondary);
    }
    .loader-bars {
      display: flex;
      gap: 4px;
      align-items: center;
      width: 100%;
      max-width: 180px;
    }
    .loader-bar {
      flex: 1;
      height: 3px;
      background: var(--color-border-tertiary);
      border-radius: 2px;
      overflow: hidden;
      position: relative;
    }
    .loader-bar::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      background: var(--color-primary);
      border-radius: 2px;
      animation: loadingBar 1.2s ease-in-out infinite;
      transform-origin: left;
    }
    @keyframes loadingBar {
      0% { transform: scaleX(0); }
      50% { transform: scaleX(1); }
      100% { transform: scaleX(0); transform-origin: right; }
    }
    @media (max-width: 640px) {
      .loader-card {
        padding: 28px 24px;
        max-width: 280px;
      }
    }
  `]
})
export class LoadingSpinnerComponent {
  loading$ = this.loadingService.loading$;
  constructor(private loadingService: LoadingService) {}
}
