import { Request, Response, NextFunction } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { ClassConstructor } from 'class-transformer/types/interfaces';
/**
 * Body请求校验
 * @param dtoClass 
 * @returns 
 */
export function validateBody<T extends object>(dtoClass: ClassConstructor<T>) {
    return async (req: Request, res: Response, next: NextFunction) => {
        // 将请求体转换为 DTO 实例
        const dto = plainToInstance(dtoClass, req.body);

        // 执行校验
        const errors = await validate(dto, {
            skipMissingProperties: false, // 是否跳过缺失属性的校验
            whitelist: false,              // 自动剔除 DTO 中未定义的属性
            forbidNonWhitelisted: false,   // 禁止非白名单属性（即不允许多余的字段）
        });

        if (errors.length > 0) {
            // 格式化错误信息
            const errorMessages = errors.flatMap((error: ValidationError) => {
                return Object.values(error.constraints || {}).map((message) => ({
                    key: error.property,
                    message,
                }));
            });

            // 返回 400 错误
            return res.status(400).json({
                message: '参数校验失败',
                errors: errorMessages,
            });
        }

        // 校验通过，将清洗后的数据存回请求对象
        req.body = dto;
        next();
    };
}