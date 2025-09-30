import { IsString, IsNotEmpty, Length } from 'class-validator';

export class NonCurrentFlowDto {
    @IsString({ message: 'Model必须是字符串' })
    @IsNotEmpty({ message: 'Model不能为空' })
    model: string;

    @IsString({ message: 'Content必须是字符串' })
    @IsNotEmpty({ message: 'Content不能为空' })
    content: string;
}