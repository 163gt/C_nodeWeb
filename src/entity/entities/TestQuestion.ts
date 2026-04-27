import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity("test_question", { schema: "mydb" })
export class TestQuestion {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "question_id", comment: "题目编号" })
  questionId: number;

  @Column("varchar", { name: "category", comment: "题目分类: bigFive/attachment/values", length: 20 })
  category: string;

  @Column("varchar", { name: "content", comment: "题目内容", length: 500 })
  content: string;

  @Column("json", { name: "options", comment: "选项JSON数组" })
  options: QuestionOption[];

  @Column("int", { name: "weight", comment: "题目权重", default: 1 })
  weight: number;

  @Column("int", { name: "sort_order", comment: "排序顺序", default: 0 })
  sortOrder: number;

  @Column("timestamp", {
    name: "created_at",
    nullable: true,
    comment: "创建时间",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;
}

export interface QuestionOption {
  text: string;
  scores: Record<string, number>;
  key?: string;
}
