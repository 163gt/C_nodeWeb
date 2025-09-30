import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("sys_route", { schema: "mydb" })
export class SysRoute {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "title", comment: "菜单名称", length: 255 })
  title: string;

  @Column("varchar", { name: "path", comment: "菜单路径", length: 255 })
  path: string;

  @Column("tinyint", {
    name: "hidden",
    comment: "是否显示",
    width: 1,
    default: () => "'0'",
  })
  hidden: boolean;

  @Column("varchar", { name: "component", comment: "组件路径", length: 255 })
  component: string;

  @Column("varchar", {
    name: "name",
    nullable: true,
    comment: "菜单name",
    length: 255,
  })
  name: string | null;

  @Column("int", { name: "sorting", comment: "排序", default: () => "'0'" })
  sorting: number;

  @Column("varchar", {
    name: "parentComponent",
    nullable: true,
    comment: "父组件路径",
    length: 255,
  })
  parentComponent: string | null;

  @Column("tinyint", {
    name: "status",
    comment: "1为正常、2为停用",
    default: () => "'1'",
  })
  status: number;
}
