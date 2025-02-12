import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateSubscriptionDto {
    @IsString()
    @IsNotEmpty()
    plan: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsBoolean()
    @IsOptional()
    isActive: boolean;

    @IsNumber()
    @IsNotEmpty()
    duration: number;

}