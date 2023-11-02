export class FeaturePresenter<T> {
  constructor(private readonly feature: T) {}
  getInstance(): T {
    return this.feature;
  }
}
