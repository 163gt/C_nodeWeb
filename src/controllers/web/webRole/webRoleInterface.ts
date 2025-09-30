import { IsString, IsNotEmpty, Length, IsNumber, IsBoolean, IsOptional, IsObject, IsArray } from 'class-validator';


export class webRoleDto {
    @IsString({ message: 'roleName必须是字符串' })
    @IsNotEmpty({ message: 'roleName不能为空' })
    roleName: string;

    @IsString({ message: 'roleCode必须是字符串' })
    @IsNotEmpty({ message: 'roleCode不能为空' })
    roleCode: string;

    @IsArray({ message: 'rolePath必须是数组' })
    @IsNumber({}, { each: true, message: 'rolePath数组的每个元素必须是数字' })
    rolePath: Array<Number>;

    @IsNumber({}, { message: 'status必须是数字' })
    @IsNotEmpty({ message: 'status不能为空' })
    status: number;

    @IsOptional()
    @IsString({ message: 'description必须是字符串' })
    description: string | null;
}