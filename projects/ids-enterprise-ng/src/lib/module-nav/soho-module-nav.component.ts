// tslint:disable-next-line:no-unused-variable
import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Input, NgZone,
  OnDestroy,
  Output,
  QueryList,
  forwardRef,
} from '@angular/core';

/**
 * Angular Wrapper for the Soho Module Nav control.
 * This Component attaches to an element annotated with the `soho-module-nav` attribute,
 */
@Component({
  selector: 'soho-module-nav, [soho-module-nav]',
  styleUrls: ['./soho-module-nav.component.css'],
  templateUrl: 'soho-module-nav.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SohoModuleNavComponent implements AfterViewInit, AfterViewChecked, OnDestroy {

  /** Reference to the jQuery element. */
  private jQueryElement?: JQuery;

  /** Reference to the annotated SoHoXi control */
  private modulenav?: SohoModuleNavStatic | null;

  /** Stored settings */
  private _options: SohoModuleNavOptions = {
    displayMode: false,
    filterable: false,
    pinSections: false,
    showDetailView: false,
  };

  /** Internal use flags */
  private _updateRequired: boolean = false;

  /** Constructor. */
  constructor(
    private elementRef: ElementRef,
    private ngZone: NgZone,
  ) { }

  // -------------------------------------------
  // Inputs
  // -------------------------------------------

  @Input() set displayMode(val: SohoModuleNavDisplayMode | undefined) {
    this._options.displayMode = val;
    this.updated({ displayMode: this._options.displayMode });
  }
  public get displayMode(): SohoModuleNavDisplayMode | undefined {
    return this.modulenav?.settings.displayMode || this._options.displayMode;
  }

  @Input() set filterable(val: boolean) {
    this._options.filterable = val;
    this.updated({ filterable: this._options.filterable });
  }
  public get filterable(): boolean {
    return this.modulenav?.settings.filterable || this._options.filterable || false;
  }

  @Input() set pinSections(val: boolean) {
    this._options.pinSections = val;
    this.updated({ pinSections: this._options.pinSections });
  }
  public get pinSections(): boolean {
    return this.modulenav?.settings.pinSections || this._options.pinSections || false;
  }

  @Input() set showDetailView(val: boolean) {
    this._options.showDetailView = val;
    this.updated({ showDetailView: this._options.showDetailView });
  }
  public get showDetailView(): boolean {
    return this.modulenav?.settings.showDetailView || this._options.showDetailView || false;
  }

  // -------------------------------------------
  // Public API
  // -------------------------------------------

  public accordionAPI(): SohoAccordionStatic | undefined {
    return this.modulenav?.accordionAPI;
  }

  public containerEl(): HTMLElement | undefined {
    return this.modulenav?.containerEl;
  }

  public switcherAPI(): SohoModuleNavSwitcherStatic | undefined {
    return this.modulenav?.switcherAPI;
  }

  public searchAPI(): SohoSearchFieldStatic | undefined {
    return this.modulenav?.searchAPI;
  }

  public settingsAPI(): SohoModuleNavSettingsStatic | undefined {
    return this.modulenav?.switcherAPI;
  }

  public init() {
    this.modulenav?.init();
  }

  /** Triggers a UI Resync. */
  public updated(val?: SohoModuleNavOptions) {
    if (val) {
      this._options = jQuery.extend({}, this._options, val);
      if (this.modulenav) {
        this.ngZone.runOutsideAngular(() => {
          this.modulenav?.updated(this._options);
        });
      }
    }
  }

  public teardown() {
    this.modulenav?.teardown();
  }

  // ------------------------------------------
  // Lifecycle Events
  // ------------------------------------------

  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => {
      // Initialize/store instance
      this.jQueryElement = jQuery(this.elementRef.nativeElement);
      this.jQueryElement.modulenav(this._options);
      this.modulenav = this.jQueryElement.data('modulenav');
    });
  }

  ngAfterViewChecked() {
    if (this.modulenav && this._updateRequired) {
      this.ngZone.runOutsideAngular(() => this.modulenav?.updated());
      this._updateRequired = false;
    }
  }

  ngOnDestroy() {
    // call outside the angular zone so change detection
    // isn't triggered by the soho component.
    this.ngZone.runOutsideAngular(() => {
      if (this.jQueryElement) {
        this.jQueryElement.off();
        this.jQueryElement = undefined;
      }
      if (this.modulenav) {
        this.modulenav.destroy();
        this.modulenav = null;
      }
    });
  }
}
