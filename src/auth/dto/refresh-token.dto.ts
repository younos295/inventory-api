import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({
    example: 'refresh-token-sample.signature',
    description: 'The refresh token previously issued by the login or refresh endpoint',
  })
  @IsString()
  refreshToken: string;
}
