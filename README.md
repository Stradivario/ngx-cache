# @ngx-cache-layer

![alt tag](http://gitlab.youvolio.com/open-source/ngx-cache-layer/badges/branch/build.svg)

#### StrongTyped, EasyAPI, Angular (v4, v5) compatible

##### More detailed documentation you can find [here](https://stradivario.github.io/ngx-cache-layer/)

##### For questions/issues you can write ticket here http://gitlab.youvolio.com/open-source/ngx-cache-layer/issues

## Installation and basic examples:

##### To install this library, run:

```bash
$ npm install ngx-cache-layer --save
```

## Consuming @ngx-cache-layer

##### In your Angular `AppModule`:

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

// Import @ngx-cache-layer library
import { CacheModule } from 'ngx-cache-layer';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    // Import CacheModule
    CacheModule.forRoot(),
    LibraryModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

##### Once you import the library you need to inject CacheService inside your component, provider etc. and create cache Layer

###### ***NOTE Every cacheLayer created by this cacheService is treathed like a LAYER from cache, so you need to specfy layer name like example above


```typescript
import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {CacheService} from "../src/ngx-cache-layer.service";
import {CacheLayerItem} from "../src/ngx-cache-layer.interfaces";
import {CacheLayer} from "../src/ngx-cache-layer.layer";

export interface Item {
    name: string;
}

export const EXAMPLE_CACHE_LAYER_NAME = 'example-layer';

@Injectable()
export class ExampleProvider {

    exampleLayer:CacheLayer<CacheLayerItem<Item>>;
    exampleLayerItems: BehaviorSubject<CacheLayerItem<Item>[]>;

    constructor(private cacheService: CacheService) {

        // here we define our cache layer name, this method returns cache layer of created cache layer;
        this.exampleLayer = this.cacheService.create<Item>({
            layer: EXAMPLE_CACHE_LAYER_NAME
        });

        // inside this.exampleCache you can find object named items returns BehaviorSubject<CacheLayerItem<Item>[]> object type
        this.exampleLayerItems = this.exampleLayer.items
        this.exampleLayerItems
            .subscribe(itemCollection => itemCollection
                .forEach(item => {
                    // Because we define interface for this items we have the following autosuggestion from the IDE
                    const itemName = item.data.name;
                })
            );

        // Put item to current cache defined above
        // When there is a new item added to collection cache automatically emits new results to this.exampleLayerItems BehaviorSubject object type
        const data = {
            key:'example-key',
            data:{
                name:'pesho'
            }
        };

        this.exampleLayer.put(data);

        // Get cached data from added item above will return {exampleData:'example-string'}
        const exampleItem = this.exampleLayer.get('example-key');

        // Remove item from current layer
        this.exampleLayer.removeItem('example-key');
    }

}

```

##### Get our new created cache from component which is somewhere else inside application
```typescript

import { Injectable } from '@angular/core';
import {CacheService, CacheLayer} from 'ngx-cache-layer';
import {EXAMPLE_CACHE_LAYER_NAME, Item} from './example.provider';

@Injectable()
export class YourClass {
    cacheLayer: CacheLayer<CacheLayerItem<Item>>;
    constructor(private:cacheService:CacheService){
      this.cacheLayer = cacheService.get<Item>(EXAMPLE_CACHE_LAYER_NAME);
      // Now work with this collection the same as example above;
    }
}
```


##### Remove cache layer we created

```typescript

import { Injectable } from '@angular/core';
import { CacheService } from 'ngx-cache-layer';
import {EXAMPLE_CACHE_LAYER_NAME} from './example.provider';

@Injectable()
export class YourClass {
    constructor(private:cacheService:CacheService){
          cacheService.remove(EXAMPLE_CACHE_LAYER_NAME);
    }
}
```


### COMPLETE  ADD TO CARD EXAMPLE:

##### Create CartProvider which will help us to reduce logic inside component

```typescript
import {Injectable} from "@angular/core";
import {CacheService, CacheLayer, CacheLayerItem} from "ngx-cache-layer";
import {Product} from "../core/config/queries/product/product.interface";
import {SnackbarProvider} from "../core/modules/material/components/snackbar/snackbar.provider";

export const CART_CACHE_LAYER_NAME = 'cart';

@Injectable()
export class CartProvider {

  cartCacheLayer: CacheLayer<CacheLayerItem<Product>>;

  constructor(private cacheService: CacheService) {
    this.cartCacheLayer = this.cacheService.put<Product>({
      layer: CART_CACHE_LAYER_NAME
    });
  }

  addToCart(product: Product) {
    this.cartCacheLayer.put({
      key:product.id,
      data: product
    });
  }

  removeFromCard(product: Product) {
    this.cartCacheLayer.removeItem(product.id);
  }

}

```

##### Now lets define our component and inject CacheService from ngx-cache-layer
```typescript
import {Component, OnInit} from '@angular/core';
import {CacheService} from 'ngx-cache-layer';
import {CacheLayerItem, CacheLayer} from 'ngx-cache-layer';
import {BehaviorSubject} from 'rxjs';
import {Product} from '../core/config/queries/product/product.interface';
import {CART_CACHE_LAYER_NAME} from './cart.provider';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  
  step = 0;
  cartItems: BehaviorSubject<CacheLayerItem<Product>[]>;
  cacheLayer: CacheLayer<CacheLayerItem<Product>>;
  constructor(
    private cache: CacheService
  ) {}

  ngOnInit() {
    this.cacheLayer = this.cache.get<Product>(CART_CACHE_LAYER_NAME);
    this.cartItems = this.cacheLayer.items;
  }

}

```

##### How to consume items insde html

```html
<div *ngFor="let item of cartItems | async">
    {{item.id}}
</div>
<button (click)="cacheLayer.removeItem('removeItemKey in my case item.id is unique so i should remove item id')">Remove item</button>
```

### How to define GlobalConfiguration

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

// Import ngx-cache-layer
import { CacheModule, CacheConfigInterface } from 'ngx-cache-layer';

// Define global configuration
// You can set localStorage to true it will cache every layers like a localStorage item
// By default localStorage is set to false
export const CACHE_DI_CONFIG = <CacheConfigInterface>{
    localStorage: true,
    maxAge: 15 * 60 * 1000, // Items added to this cache expire after 15 minutes
    cacheFlushInterval: 60 * 60 * 1000, // This cache will clear itself every hour
    deleteOnExpire: 'aggressive' // Items will be deleted from this cache when they expire
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    // Import CacheModule with CACHE_DI_CONFIG;
    CacheModule.forRoot(CACHE_DI_CONFIG),
    LibraryModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```



### Service methods

Create cache layer
```typescript
CacheService.create<any>({layer: 'layer-name'})
```

Get layer from cache
```typescript
CacheService.get<any>('layer-name');
```

Remove layer from cache
```typescript
CacheService.remove('layer-name');
```

Create Cache with parameters static public method 
```typescript
const data = {key:'testKey', params:{test1:'1', test2:'2'}};
const cache = CacheService.get<any>('layer-name');
cache.put(CacheService.createCacheParams(data), data);
let cachedDataWithParams = cache.get(cacheParams);
// This will give you cached data;
```

### Cache Layer methods

Put item to cache

```typescript
const cache = CacheService.get<any>('layer-name');
cache.put({key:'example-key', data:{exampleData:''}});
```

Get item from cache

```typescript
const cache = CacheService.get<any>('layer-name');
cache.get('example-key');
```

Remove item from cache

```typescript
const cache = CacheService.get<any>('layer-name');
cache.removeItem('example-key');
```


## License

MIT © [Kristian Tachev(Stradivario)](mailto:kristiqn.tachev@gmail.com)

