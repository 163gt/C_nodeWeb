import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { SysDictionaryItem } from "./SysDictionaryItem";

@Index("unique_dictionaryCode", ["dictionaryCode"], { unique: true })
@Index("IDX_c3dd3305bccdc9e111a4afd570", ["dictionaryCode"], { unique: true })
@Entity("sys_dictionary_type", { schema: "mydb" })
export class SysDictionaryType {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "dictionaryCode", unique: true, length: 50 })
  dictionaryCode: string;

  @Column("varchar", { name: "dictionaryName", length: 100 })
  dictionaryName: string;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("tinyint", {
    name: "status",
    nullable: true,
    comment: "1为正常 2为停用",
    width: 1,
    default: () => "'1'",
  })
  status: boolean | null;

  @OneToMany(
    () => SysDictionaryItem,
    (sysDictionaryItem) => sysDictionaryItem.dictionaryCode2
  )
  sysDictionaryItems: SysDictionaryItem[];
}
