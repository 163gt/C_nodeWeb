import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity("badge", { schema: "mydb" })
export class Badge {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "badge_id", comment: "徽章ID", length: 50, unique: true })
  badgeId: string;

  @Column("varchar", { name: "name", comment: "徽章名称", length: 50 })
  name: string;

  @Column("varchar", { name: "icon", comment: "图标", length: 20 })
  icon: string;

  @Column("varchar", { name: "color", comment: "主题色", length: 20 })
  color: string;

  @Column("json", { name: "gradient", comment: "渐变颜色数组" })
  gradient: string[];

  @Column("varchar", { name: "meaning", comment: "含义", length: 100 })
  meaning: string;

  @Column("varchar", { name: "description", comment: "描述", length: 100 })
  description: string;

  @Column("int", { name: "count", comment: "选择人数", default: 0 })
  count: number;

  @Column("decimal", { name: "percentage", comment: "百分比", precision: 5, scale: 2 })
  percentage: number;

  @Column("timestamp", {
    name: "created_at",
    nullable: true,
    comment: "创建时间",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @Column("timestamp", {
    name: "updated_at",
    nullable: true,
    comment: "更新时间",
    default: () => "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
  })
  updatedAt: Date | null;
}
