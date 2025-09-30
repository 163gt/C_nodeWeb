import { IsString, IsNotEmpty, Length, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class webRoutersCreateDto {
    @IsString({ message: 'title必须是字符串' })
    @IsNotEmpty({ message: 'title不能为空' })
    title: string;

    @IsString({ message: 'path必须是字符串' })
    @IsNotEmpty({ message: 'path不能为空' })
    path: string;


    @IsBoolean({ message: 'hidden必须是布尔值' })
    @IsNotEmpty({ message: 'hidden不能为空' })
    hidden: boolean;

    @IsOptional()
    @IsString({ message: 'component必须是字符串' })
    component: string;

    @IsOptional()
    @IsString({ message: 'name必须是字符串' })
    name: string;

    @IsNumber({}, { message: 'sorting必须是数字' })
    @IsNotEmpty({ message: 'sorting不能为空' })
    sorting: number;

    @IsOptional()
    @IsString({ message: 'parentComponent必须是字符串' })
    parentComponent: string | null;

    @IsOptional()
    @IsNumber({}, { message: 'status必须是数字' })
    status: number;
}