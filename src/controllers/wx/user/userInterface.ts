import { IsString, IsNotEmpty, Length } from 'class-validator';

export class WxLoginDto {
  @IsString({ message: 'code必须是字符串' })
  @IsNotEmpty({ message: 'code不能为空' })
  code: string;
}