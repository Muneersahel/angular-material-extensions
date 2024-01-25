import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { MatTabLink, MatTabNav, MatTabNavPanel } from '@angular/material/tabs';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { Subject, startWith } from 'rxjs';
import { NavigationFocus } from '../../shared/navigation-focus/navigation-focus';
import { ComponentPageTitle } from '../page-title/page-title';

@Component({
  selector: 'app-component-viewer',
  templateUrl: './component-viewer.html',
  styleUrls: ['./component-viewer.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    MatTabNav,
    NavigationFocus,
    MatTabLink,
    RouterLinkActive,
    RouterLink,
    MatTabNavPanel,
    RouterOutlet,
  ],
})
export class ComponentViewer implements OnDestroy {
  sections: Set<string> = new Set(['overview', 'api']);
  private _destroyed = new Subject<void>();

  componentId = '';

  constructor(
    _route: ActivatedRoute,
    private _router: Router,
    private _componentPageTitle: ComponentPageTitle
  ) {
    const routeAndParentParams = [_route.params];
    if (_route.parent) {
      routeAndParentParams.push(_route.parent.params);
    }

    this._router.events.pipe(startWith(this._router)).subscribe(s => {
      if (s instanceof Router || s instanceof NavigationEnd) {
        this.componentId = s.url.split('/')[2];
        this._componentPageTitle.title = this.componentId;
      }
    });
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }
}
