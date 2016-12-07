import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';
import {GridComponent} from './grid/grid.component';
import {TileComponent} from './tile/tile.component';

import {GridService} from './services/grid.service';
import {GameComponent} from './game/game.component'
import {StoreModule} from "@ngrx/store";

import {gameReducer} from "./store/game.reducer";
import {PlayerComponent} from './player/player.component';

@NgModule({
  declarations: [
    AppComponent,
    GridComponent,
    TileComponent,
    GameComponent,
    PlayerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    StoreModule.provideStore({gameState: gameReducer})
  ],
  providers: [GridService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
