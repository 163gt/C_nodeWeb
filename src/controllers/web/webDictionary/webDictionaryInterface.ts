import { IsString, IsNotEmpty, Length, IsNumber, IsBoolean, IsOptional, IsObject, IsArray } from 'class-validator';

export class createDictTypeDto {
    @IsString({ message: 'dictionaryCode必须是字符串' })
    @IsNotEmpty({ message: 'dictionaryCode不能为空' })
    @Length(1, 50)
    dictionaryCode: string;

    @IsString({ message: 'dictionaryName必须是字符串' })
    @IsNotEmpty({ message: 'dictionaryName不能为空' })
    @Length(1, 100)
    dictionaryName: string;

    @IsOptional()
    @IsString({ message: 'description必须是字符串' })
    @Length(1, 100)
    description: string;
}

export class updateDictTypeDto {
    @IsNotEmpty({ message: 'id不能为空' })
    @IsNumber({}, { message: 'id必须是数字' })
    id: number;

    @IsString({ message: 'dictionaryCode必须是字符串' })
    @IsNotEmpty({ message: 'dictionaryCode不能为空' })
    @Length(1, 50)
    dictionaryCode: string;

    @IsString({ message: 'dictionaryName必须是字符串' })
    @IsNotEmpty({ message: 'dictionaryName不能为空' })
    dictionaryName: string;

    @IsOptional()
    @IsString({ message: 'description必须是字符串' })
    @Length(1, 100)
    description: string;

    @IsOptional()
    @IsNumber({},{ message: 'status必须是数字' })
    status: number;
}

export class updateDictItemDto {
    @IsNotEmpty({ message: 'id不能为空' })
    @IsNumber({}, { message: 'id必须是数字' })
    id: number;

    @IsString({ message: 'label必须是字符串' })
    @IsNotEmpty({ message: 'label不能为空' })
    @Length(1, 100)
    label: string;

    @IsNumber({}, { message: 'value必须是数字' })
    @IsNotEmpty({ message: 'value不能为空' })
    value: number;

    @IsOptional()
    @IsNumber({}, { message: 'status必须是数字' })
    status: number;
}
export class createDictItemDto {
    @IsNotEmpty({ message: 'dictionaryCode不能为空' })
    @IsString({ message: 'dictionaryCode必须是字符串' })
    @Length(1, 50)
    dictionaryCode: string;

    @IsString({ message: 'label必须是字符串' })
    @IsNotEmpty({ message: 'label不能为空' })
    @Length(1, 100)
    label: string;

    @IsNumber({}, { message: 'value必须是数字' })
    @IsNotEmpty({ message: 'value不能为空' })
    value: number;

    @IsOptional()
    @IsNumber({}, { message: 'status必须是数字' })
    status: number;
}