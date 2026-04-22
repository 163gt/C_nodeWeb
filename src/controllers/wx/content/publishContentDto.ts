import { IsString, IsNotEmpty } from 'class-validator';

export class PublishContentDto {
  @IsString({ message: '徽章ID必须是字符串' })
  @IsNotEmpty({ message: '徽章ID不能为空' })
  badgeId: string;

  @IsString({ message: '内容必须是字符串' })
  @IsNotEmpty({ message: '内容不能为空' })
  content: string;
}
