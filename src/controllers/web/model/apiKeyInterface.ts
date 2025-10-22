import { IsString, IsNotEmpty, Length, isNumber, IsNumber, IsOptional } from 'class-validator';

export class addApiKeyDto {
    @IsString({ message: 'modelKeyName必须是字符串' })
    @IsNotEmpty({ message: 'modelKeyName不能为空' })
    modelKeyName: string;

    @IsString({ message: 'apiKeyValue必须是字符串' })
    @IsNotEmpty({ message: 'apiKeyValue不能为空' })
    apiKeyValue: string;

    @IsString({ message: 'baseUrl必须是字符串' })
    @IsNotEmpty({ message: 'baseUrl不能为空' })
    baseUrl: string;

    @IsOptional()
    @IsString({ message: 'apiKeyDesc必须是字符串' })
    apiKeyDesc: string;

    @IsNumber({}, { message: 'status必须是数字' })
    @IsNotEmpty({ message: 'status不能为空' })
    status: number;
}