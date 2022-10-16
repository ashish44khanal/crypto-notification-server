import { Column, Entity, ManyToOne } from "typeorm";
import { CommonEntity } from "../commons/common-entity";
import { Cryptos } from "./cryptos.entity";
import { User } from "./user.entity";

@Entity()
export class Watchlist extends CommonEntity {
  @Column()
  max_price: string;

  @Column()
  min_price: string;

  @ManyToOne(() => Cryptos, (cryptos) => cryptos.watchlist)
  coin_id: Cryptos;

  @ManyToOne(() => User, (user) => user.watchlist)
  user: User;
}
