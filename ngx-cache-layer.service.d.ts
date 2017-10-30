import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { CacheLayer } from './ngx-cache-layer.layer';
import { CacheLayerInterface, CacheServiceConfigInterface, CacheLayerItem } from './ngx-cache-layer.interfaces';
export declare class CacheService extends Map {
    private config;
    _cachedLayers: BehaviorSubject<CacheLayer<CacheLayerItem<any>>[]>;
    readonly asObservable: BehaviorSubject<CacheLayer<CacheLayerItem<any>>[]>;
    get(name: any): any;
    constructor(config: CacheServiceConfigInterface);
    static createCacheInstance<T>(cacheLayer: any): CacheLayer<CacheLayerItem<T>>;
    static isLocalStorageUsable(): boolean;
    getLayer<T>(name: string): CacheLayer<CacheLayerItem<T>>;
    createLayer<T>(layer: CacheLayerInterface): CacheLayer<CacheLayerItem<T>>;
    private LayerHook<T>(layerInstance);
    private protectLayerFromInvaders<T>(cacheLayer);
    private OnExpire<T>(layerInstance);
    removeLayer<T>(layerInstance: CacheLayer<CacheLayerItem<T>>): void;
    static getLayersFromLS(): Array<string>;
}
