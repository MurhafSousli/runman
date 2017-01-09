import {BrowserModule} from '@angular/platform-browser'
import {NgModule} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {HttpModule} from '@angular/http'

import {AppComponent} from './app.component'
import {GameComponent} from './components/game/game.component'
import {GameContainerComponent} from './components/game-container/game-container.component'
import {GridComponent} from './components/grid/grid.component'
import {TileComponent} from './components/tile/tile.component'
import {PlayerComponent} from './components/player/player.component'
import {StateInfoComponent} from './components/state-info/state-info.component'
import {ModalComponent} from './components/modal/modal.component'
import {StateMessageComponent} from './components/state-message/state-message.component'
import {PointComponent} from './components/point/point.component'

import {GameService} from './service/game.service'
import {StoreModule} from "@ngrx/store"
import {gameReducer} from "./store/game.reducer"
import {AudioService} from "./audio/audio.service";
import { AboutComponent } from './components/about/about.component';
import { ResultComponent } from './components/result/result.component';

@NgModule({
  declarations: [
    AppComponent,
    GridComponent,
    TileComponent,
    GameComponent,
    PlayerComponent,
    StateInfoComponent,
    ModalComponent,
    StateMessageComponent,
    PointComponent,
    GameContainerComponent,
    AboutComponent,
    ResultComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    StoreModule.provideStore({gameState: gameReducer})
  ],
  providers: [GameService, AudioService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
