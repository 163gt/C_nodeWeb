import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("model_apikey", { schema: "mydb" })
export class ModelApikey {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "modelKeyName", length: 50 })
  modelKeyName: string;

  @Column("varchar", { name: "apiKeyValue", length: 255 })
  apiKeyValue: string;

  @Column("varchar", { name: "baseUrl", length: 255 })
  baseUrl: string;

  @Column("varchar", { name: "apiKeyDesc", length: 255 })
  apiKeyDesc: string;

  @Column("tinyint", {
    name: "status",
    comment: "1启用，2禁用",
    width: 1,
    default: () => "'1'",
  })
  status: boolean;
}
