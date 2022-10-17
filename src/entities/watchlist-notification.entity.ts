import { Column, Entity, ManyToOne } from "typeorm";
import { CommonEntity } from "../commons/common-entity";
import { Cryptos } from "./cryptos.entity";
import { User } from "./user.entity";

@Entity()
export class WatchlistNotification extends CommonEntity {
  @Column()
  read: boolean;

  @Column()
  message: string;

  @ManyToOne(() => User, (user) => user.notification)
  user: User;

  @ManyToOne(() => Cryptos, (coin) => coin.notification)
  coin: Cryptos;
}
