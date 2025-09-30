import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("user_id", ["userId"], { unique: true })
@Index("IDX_758b8ce7c18b9d347461b30228", ["userId"], { unique: true })
@Index("openid", ["openid"], { unique: true })
@Index("IDX_0fda9260b0aaff9a5b8f38ac16", ["openid"], { unique: true })
@Entity("user", { schema: "mydb" })
export class User {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("char", {
    name: "user_id",
    unique: true,
    length: 36,
    default: () => "'uuid()'",
  })
  userId: string;

  @Column("varchar", { name: "username", comment: "用户名", length: 50 })
  username: string;

  @Column("timestamp", {
    name: "created_at",
    nullable: true,
    comment: "创建时间",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @Column("varchar", { name: "password", comment: "用户密码", length: 100 })
  password: string;

  @Column("varchar", {
    name: "openid",
    nullable: true,
    unique: true,
    length: 64,
  })
  openid: string | null;

  @Column("varchar", {
    name: "avatarUrl",
    nullable: true,
    comment: "用户头像URL（微信获取，允许为空）",
    length: 255,
  })
  avatarUrl: string | null;

  @Column("varchar", {
    name: "phone",
    nullable: true,
    comment: "手机号",
    length: 20,
  })
  phone: string | null;
}
