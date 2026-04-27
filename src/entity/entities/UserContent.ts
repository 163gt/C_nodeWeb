import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity("user_content", { schema: "mydb" })
export class UserContent {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("char", { name: "content_id", comment: "内容ID", length: 36, unique: true })
  contentId: string;

  @Column("char", { name: "user_id", comment: "用户ID", length: 36, nullable: true })
  userId: string | null;

  @Column("varchar", { name: "badge_id", comment: "关联徽章ID", length: 50 })
  badgeId: string;

  @Column("text", { name: "content", comment: "发布内容" })
  content: string;

  @Column("varchar", { name: "status", comment: "随机状态文案", length: 255, nullable: true })
  status: string | null;

  @Column("int", { name: "like_count", comment: "点赞数", default: 0 })
  likeCount: number;

  @Column("int", { name: "view_count", comment: "浏览次数", default: 0 })
  viewCount: number;

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
