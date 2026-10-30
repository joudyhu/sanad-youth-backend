import { IsString, IsInt, Min, Max, IsOptional, IsBoolean, IsDateString, IsUrl, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
export class CreateProgramDto { @IsString() @MaxLength(150) title!: string; @IsString() @MaxLength(10000) description!: string; @Type(()=>Number) @IsInt() @Min(1) @Max(10000) capacity!: number; @IsOptional() @IsBoolean() isPublished?: boolean; }
export class UpdateProgramDto { @IsOptional() @IsString() @MaxLength(150) title?: string; @IsOptional() @IsString() @MaxLength(10000) description?: string; @IsOptional() @Type(()=>Number) @IsInt() @Min(1) @Max(10000) capacity?: number; @IsOptional() @IsBoolean() isPublished?: boolean; }
export class CreateSessionDto { @IsDateString() startsAt!: string; @IsDateString() endsAt!: string; @IsOptional() @IsString() location?: string; @IsOptional() @IsUrl({require_tld:false}) meetingUrl?: string; }
