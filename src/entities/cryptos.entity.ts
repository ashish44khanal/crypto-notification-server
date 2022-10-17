import { Column, Entity, OneToMany } from "typeorm";
import { CommonEntity } from "../commons/common-entity";
import { WatchlistNotification } from "./watchlist-notification.entity";
import { Watchlist } from "./watchlist.entity";

@Entity()
export class Cryptos extends CommonEntity {
  @Column()
  rank: number;

  @Column()
  name: string;

  @Column()
  code: string;

  @Column({ nullable: true })
  image: string;

  @Column()
  price: string;

  @Column()
  market_cap: string;

  @Column()
  changeIn24: string;

  @Column({ nullable: true })
  crypto_details_link: string;

  @OneToMany(() => Watchlist, (watchlist) => watchlist.coin_id)
  watchlist: Watchlist;

  @OneToMany(() => WatchlistNotification, (notification) => notification.coin)
  notification: Watchlist;
}
