import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("roleCode", ["roleCode"], { unique: true })
@Index("IDX_a5c291366b4706c62dcd5239c8", ["roleCode"], { unique: true })
@Index("UQ_roleName", ["roleName"], { unique: true })
@Index("IDX_b806c4ab49ff08434c25d2f967", ["roleName"], { unique: true })
@Entity("sys_role", { schema: "mydb" })
export class SysRole {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", {
    name: "roleName",
    unique: true,
    comment: "角色名称",
    length: 255,
  })
  roleName: string;

  @Column("varchar", {
    name: "roleCode",
    unique: true,
    comment: "角色编码",
    length: 255,
  })
  roleCode: string;

  @Column("json", { name: "rolePath", nullable: true, comment: "存储路由id" })
  rolePath: object | null;

  @Column("tinyint", {
    name: "status",
    comment: "1为正常 2为停用",
    default: () => "'1'",
  })
  status: number;

  @Column("varchar", {
    name: "description",
    nullable: true,
    comment: "描述",
    length: 255,
  })
  description: string | null;

  @Column("timestamp", {
    name: "createTime",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createTime: Date | null;
}
