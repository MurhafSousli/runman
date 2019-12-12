// import { EMPTY, Subject } from 'rxjs';
// import { Tile, Player } from '../game/models/game.models';
// import { GameMode, GameSettings, PlayerDirections } from '../game/models/game.constants';
//
// export function addPlayer(grid: Tile[][], width: number, height: number, player: Player) {
//
//   game.grid[player.index.ts.x][player.index.ts.y].walkable = false;
//   game.players.push(player);
//   player.routingIndex = game.players$.push(new Subject<Tile[]>()) - 1;
//
//   game.pauser$.switchMap(paused => paused ? EMPTY : game.moveStream(player))
//     .takeUntil(game.gameOver$).subscribe();
//
//   if (player.bot) {
//     game.pauser$.switchMap(paused => paused ? EMPTY : game.pilotStream(player))
//       .takeUntil(game.gameOver$).subscribe();
//   }
// }
//
// export function removePlayer(grid: Tile[][], width: number, height: number, player: Player) {
//   /** Remove & Unsubscribe automatically */
//
//   game.audio.remove.play();
//   game.players$.remove(game.players$[player.routingIndex]);
//   game.grid[player.index.ts.x][player.index.ts.y].walkable = true;
//   game.players.remove(player);
//
//   if (player === game.hero) {
//     game.gameState(GameMode.LOST);
//   }
// }
//
// /** Get player direction towards the target */
// export function setPlayerDirection(player: Player, target: Tile) {
//   return player.direction(target.index.ts.x === player.index.ts.x) ?
//     (target.index.ts.y > player.index.ts.y) ? PlayerDirections.BOTTOM : PlayerDirections.TOP
//     : (target.index.ts.x > player.index.ts.x) ? PlayerDirections.RIGHT : PlayerDirections.LEFT;
// }
//
// /** Player Attack Effect */
// export function attackEffect(grid: Tile[][], width: number, height: number, attacker: Player, victim: Player) {
//
//   victim.blood = false;
//   setPlayerDirection(attacker, victim);
//   let transform;
//   switch (attacker.direction) {
//     case PlayerDirections.TOP:
//       transform = `translate(0, -${GameSettings.TILE_SIZE / 2}px)`;
//       break;
//     case PlayerDirections.BOTTOM:
//       transform = `translate(0, ${GameSettings.TILE_SIZE / 2}px)`;
//       break;
//     case PlayerDirections.LEFT:
//       transform = `translate(-${GameSettings.TILE_SIZE / 2}px, 0)`;
//       break;
//     case PlayerDirections.RIGHT:
//       transform = `translate(${GameSettings.TILE_SIZE / 2}px, 0)`;
//       break;
//     default:
//       transform = 'translate(0, 0)';
//   }
//   attacker.styles = Object.assign({}, attacker.styles, { transform });
//   game.audio.attack.play();
// }
