import { Column, Entity, OneToMany } from "typeorm";
import { CommonEntity } from "../commons/common-entity";
import { Watchlist } from "./watchlist.entity";

@Entity()
export class User extends CommonEntity {
  @Column()
  full_name: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Watchlist, (watchlist) => watchlist.user)
  watchlist: Watchlist;
}
