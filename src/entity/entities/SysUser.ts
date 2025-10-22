import { Column, Entity, Index } from "typeorm";

@Index("IDX_f6a2048fab3882df93b31edfa2", ["userName"], { unique: true })
@Index("idx_phone", ["phoneNumber"], {})
@Index("idx_username", ["userName"], {})
@Index("userName", ["userName"], { unique: true })
@Entity("sys_user", { schema: "mydb" })
export class SysUser {
  @Column("char", {
    primary: true,
    name: "userId",
    length: 36,
    default: () => "'uuid()'",
  })
  userId: string;

  @Column("varchar", { name: "userName", unique: true, length: 10 })
  userName: string;

  @Column("varchar", { name: "passWord", length: 255 })
  passWord: string;

  @Column("varchar", { name: "avatar", nullable: true, length: 255 })
  avatar: string | null;

  @Column("timestamp", {
    name: "createTime",
    nullable: true,
    comment: "创建时间",
    default: () => "CURRENT_TIMESTAMP",
  })
  createTime: Date | null;

  @Column("varchar", { name: "phoneNumber", nullable: true, length: 15 })
  phoneNumber: string | null;

  @Column("json", {
    name: "roleCode",
    nullable: true,
    comment: "角色code编码合集",
  })
  roleCode: object | null;
}
