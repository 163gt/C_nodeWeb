import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { SysDictionaryType } from "./SysDictionaryType";

@Index("dictionaryCode", ["dictionaryCode"], {})
@Index("unique_label_value", ["dictionaryCode", "label", "value"], {
  unique: true,
})
@Entity("sys_dictionary_item", { schema: "mydb" })
export class SysDictionaryItem {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "dictionaryCode", length: 50 })
  dictionaryCode: string;

  @Column("varchar", { name: "label", length: 100 })
  label: string;

  @Column("int", { name: "value" })
  value: number;

  @Column("tinyint", {
    name: "status",
    nullable: true,
    comment: "1为正常 2为停用",
    width: 1,
    default: () => "'1'",
  })
  status: boolean | null;

  @Column("datetime", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @Column("datetime", {
    name: "updated_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date | null;

  @ManyToOne(
    () => SysDictionaryType,
    (sysDictionaryType) => sysDictionaryType.sysDictionaryItems,
    { onDelete: "CASCADE", onUpdate: "NO ACTION" }
  )
  @JoinColumn([
    { name: "dictionaryCode", referencedColumnName: "dictionaryCode" },
  ])
  dictionaryCode2: SysDictionaryType;
}
