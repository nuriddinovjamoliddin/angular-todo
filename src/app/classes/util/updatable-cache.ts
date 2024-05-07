import { BehaviorSubject, exhaustMap, filter, tap } from "rxjs";
import { Observable } from "rxjs/internal/Observable";

export const EMPTY_SYMBOL = Symbol("UPDATABLE_CACHE_EMPTY_STATE"); // this symbol is needed, coz state can be null | undefined

export class UpdatableCache<T> {
  private readonly _state$: BehaviorSubject<T | typeof EMPTY_SYMBOL> =
    new BehaviorSubject<T | typeof EMPTY_SYMBOL>(EMPTY_SYMBOL);

  private _updateProceeding = false;

  public constructor(updateObservable: Observable<T>);
  public constructor(updateFunction: (...args: unknown[]) => T | Observable<T>);
  public constructor(
    private readonly updateRecourse$:
      | Observable<T>
      | ((...args: unknown[]) => T | Observable<T>)
  ) {}

  public getState(): Observable<T> {
    return this._state$.pipe(
      exhaustMap((value: T | typeof EMPTY_SYMBOL): Observable<T> => {
        if (this._updateProceeding || value !== EMPTY_SYMBOL) {
          return this._state$.pipe(
            filter((value: T | typeof EMPTY_SYMBOL) => value !== EMPTY_SYMBOL),
          ) as Observable<T>;
        } else {
          return this.update();
        }
      })
    );
  }

  /**
   *
   * @note: not recommended to use this method.
   * @param newState
   * @description Use this method to update state manually.
   */
  public manualUpdateState(newState: T): void {
    this._state$.next(newState);
  }

  public resetState(): void {
    this._state$.next(EMPTY_SYMBOL);
  }

  public update(): Observable<T> {
    if (this.updateRecourse$ instanceof Observable) {
      this._updateProceeding = true;
      return this.requestUpdateFromObservable(this.updateRecourse$);
    } else {
      this._updateProceeding = true;
      const result = this.updateRecourse$();

      if (result instanceof Observable) {
        return this.requestUpdateFromObservable(result);
      }

      this._state$.next(result);

      return this._state$.pipe(
        filter((value: T | typeof EMPTY_SYMBOL) => value !== EMPTY_SYMBOL)
      ) as Observable<T>;
    }
  }

  private requestUpdateFromObservable(
    updateRecourse: Observable<T>
  ): Observable<T> {
    return updateRecourse.pipe(
      tap({
        error: () => this._updateProceeding = false,
      }),
      exhaustMap((value) => {
        this._state$.next(value);
        this._updateProceeding = false;

        return this._state$.pipe(
          filter((value: T | typeof EMPTY_SYMBOL) => value !== EMPTY_SYMBOL)
        ) as Observable<T>;
      })
    );
  }
}
