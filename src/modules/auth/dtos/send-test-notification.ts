import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendTestNotificationDto {
  @ApiProperty({
    description: 'Email to send the notification to',
    type: String,
    example: 'john@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Sample body text to show in the notification',
    type: String,
    example: 'Shalom!',
  })
  @IsNotEmpty()
  body: string;

  @ApiProperty({
    description: 'Secret key to restrict usage',
    type: String,
    example: 'secret',
  })
  @IsNotEmpty()
  secret: string;
}
