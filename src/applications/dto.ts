import { IsOptional, IsString, MaxLength } from 'class-validator';
export class ReviewApplicationDto { @IsString() status!: 'ACCEPTED'|'REJECTED'; @IsOptional() @IsString() @MaxLength(1000) reviewNote?: string; }
