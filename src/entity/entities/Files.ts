import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("idx_uploadedBy", ["uploadedBy"], {})
@Index("idx_createdAt", ["createdAt"], {})
@Index("idx_filename", ["filename"], {})
@Entity("files", { schema: "mydb" })
export class Files {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", {
    name: "originalName",
    comment: "原始文件名",
    length: 255,
  })
  originalName: string;

  @Column("varchar", { name: "filename", comment: "存储的文件名", length: 255 })
  filename: string;

  @Column("varchar", { name: "mimetype", comment: "文件类型", length: 100 })
  mimetype: string;

  @Column("int", { name: "size", comment: "文件大小(字节)" })
  size: number;

  @Column("varchar", { name: "path", comment: "服务器存储路径", length: 500 })
  path: string;

  @Column("varchar", { name: "url", comment: "访问URL", length: 500 })
  url: string;

  @Column("datetime", {
    name: "createdAt",
    comment: "创建时间",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("varchar", { name: "uploadedBy", nullable: true, length: 36 })
  uploadedBy: string | null;

  @Column("tinyint", {
    name: "isActive",
    nullable: true,
    comment: "是否有效(1:有效,0:无效)",
    width: 1,
    default: () => "'1'",
  })
  isActive: boolean | null;
}
