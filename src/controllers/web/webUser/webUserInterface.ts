import { IsString, IsNotEmpty, Length, isNumber, IsNumber, IsOptional } from 'class-validator';

export class webLoginDto {
  @IsString({ message: 'userName必须是字符串' })
  @IsNotEmpty({ message: 'userName不能为空' })
  userName: string;
}