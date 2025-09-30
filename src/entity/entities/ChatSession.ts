import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("sessionId", ["sessionId"], { unique: true })
@Index("IDX_ca75b6f99217818cce84f7d67b", ["sessionId"], { unique: true })
@Entity("chat_session", { schema: "mydb" })
export class ChatSession {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("char", {
    name: "sessionId",
    unique: true,
    comment: "16位随机字符串，唯一标识会话",
    length: 16,
  })
  sessionId: string;

  @Column("varchar", { name: "userId", length: 36 })
  userId: string;

  @Column("varchar", {
    name: "sessionName",
    nullable: true,
    comment: "会话名称",
    length: 255,
  })
  sessionName: string | null;

  @Column("timestamp", {
    name: "createTime",
    nullable: true,
    comment: "创建时间",
    default: () => "CURRENT_TIMESTAMP",
  })
  createTime: Date | null;

  @Column("timestamp", {
    name: "updateTime",
    nullable: true,
    comment: "最后更新时间",
    default: () => "CURRENT_TIMESTAMP",
  })
  updateTime: Date | null;

  @Column("varchar", {
    name: "model",
    nullable: true,
    comment: "模型名称",
    length: 100,
    default: () => "'default'",
  })
  model: string | null;

  @Column("tinyint", {
    name: "status",
    nullable: true,
    comment: "会话状态，1=进行中,2=已结束,3=删除",
    default: () => "'1'",
  })
  status: number | null;
}
