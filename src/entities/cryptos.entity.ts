import { Column, Entity } from "typeorm";
import { CommonEntity } from "../commons/common-entity";

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
}
