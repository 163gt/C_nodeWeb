import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("idx_session_msg", ["sessionId", "messageId"], { unique: true })
@Index("idx_sessionId", ["sessionId"], {})
@Entity("chat_message", { schema: "mydb" })
export class ChatMessage {
  @PrimaryGeneratedColumn({
    type: "bigint",
    name: "id",
    comment: "全局唯一自增id",
  })
  id: string;

  @Column("char", { name: "sessionId", comment: "关联会话id", length: 16 })
  sessionId: string;

  @Column("bigint", { name: "messageId", comment: "会话内自增id，用于排序" })
  messageId: string;

  @Column("enum", {
    name: "role",
    comment: "角色",
    enum: ["user", "assistant"],
  })
  role: "user" | "assistant";

  @Column("json", { name: "content", comment: "消息内容，JSON格式存储" })
  content: object;

  @Column("timestamp", {
    name: "createTime",
    nullable: true,
    comment: "创建时间",
    default: () => "CURRENT_TIMESTAMP",
  })
  createTime: Date | null;
}
