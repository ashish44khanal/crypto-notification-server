import { Column, Entity } from "typeorm";
import { CommonEntity } from "../commons/common-entity";

@Entity()
export class Watchlist extends CommonEntity {
  @Column()
  coin_id: string;

  @Column()
  user_id: string;

  @Column()
  coin_details_link: string;

  @Column({
    default: 0,
  })
  max_price: string;

  @Column({
    default: 0,
  })
  min_price: string;
}
