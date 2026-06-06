import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PincodeService } from '../../core/services/pincode.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
<nav class="navbar" role="navigation" aria-label="Main navigation">
  <div class="navbar-inner">
    <div class="nav-left">
      <a href="/" class="logo-link">
        <span class="logo-icon">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="6" fill="#FC8019"/>
            <path d="M14 7c-3 0-5.5 2-5.5 5.5S11 18 14 18s5.5-2 5.5-5.5S17 7 14 7zm0 9.5c-2.2 0-4-1.8-4-4S11.8 8.5 14 8.5s4 1.8 4 4-1.8 4-4 4z" fill="#fff"/>
            <path d="M14 10c-.6 0-1 .4-1 1v1.5h-1.5c-.6 0-1 .4-1 1s.4 1 1 1H13V16c0 .6.4 1 1 1s1-.4 1-1v-1.5h1.5c.6 0 1-.4 1-1s-.4-1-1-1H15V11c0-.6-.4-1-1-1z" fill="#FC8019"/>
          </svg>
        </span>
        <span class="logo-text">basket<span class="logo-accent">compare</span></span>
      </a>
      <div class="location-badge">
        <i class="ti ti-map-pin location-icon" aria-hidden="true"></i>
        <span class="location-city">{{ city$ | async }}</span>
        <span class="location-sep">|</span>
        <span class="location-pin">{{ pincode$ | async }}</span>
        <i class="ti ti-chevron-down location-chevron" aria-hidden="true"></i>
      </div>
    </div>

    <div class="nav-right">
      <span class="nav-tag">Price Comparison</span>
    </div>
  </div>
</nav>
  `,
  styles: [`
    .navbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: var(--color-background-primary);
      box-shadow: var(--shadow-sm);
      border-bottom: 1px solid var(--color-border-tertiary);
    }
    .navbar-inner {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 24px;
    }
    .nav-left {
      display: flex;
      align-items: center;
      gap: 24px;
    }
    .logo-link {
      display: flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
    }
    .logo-icon {
      display: flex;
      align-items: center;
    }
    .logo-text {
      font-size: 20px;
      font-weight: 700;
      color: var(--color-text-primary);
      letter-spacing: -0.5px;
    }
    .logo-accent {
      color: var(--color-primary);
    }
    .location-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: var(--border-radius-sm);
      background: var(--color-background-secondary);
      border: 1px solid var(--color-border-tertiary);
      font-size: 13px;
      cursor: pointer;
      transition: all var(--transition-fast);
    }
    .location-badge:hover {
      border-color: var(--color-border-primary);
      background: var(--color-background-tertiary);
    }
    .location-icon {
      color: var(--color-primary);
      font-size: 16px;
    }
    .location-city {
      font-weight: 600;
      color: var(--color-text-primary);
    }
    .location-sep {
      color: var(--color-text-tertiary);
    }
    .location-pin {
      color: var(--color-text-secondary);
    }
    .location-chevron {
      font-size: 14px;
      color: var(--color-text-tertiary);
    }
    .nav-right {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .nav-tag {
      font-size: 12px;
      font-weight: 500;
      padding: 6px 14px;
      background: var(--color-primary-light);
      color: var(--color-primary-dark);
      border-radius: 20px;
      letter-spacing: 0.2px;
    }
    @media (max-width: 640px) {
      .navbar-inner {
        padding: 10px 16px;
      }
      .location-badge {
        padding: 4px 8px;
        font-size: 12px;
      }
      .location-city, .location-sep {
        display: none;
      }
      .nav-tag {
        display: none;
      }
      .logo-text {
        font-size: 17px;
      }
    }
  `]
})
export class NavbarComponent {
  pincode$ = this.pincodeService.pincode$;
  city$    = this.pincodeService.city$;
  constructor(private pincodeService: PincodeService) {}
}
