import { IsString, IsUrl } from 'class-validator';

export class CreateReferenceDto {
  @IsString({ message: 'Must be a string!' })
  @IsUrl(undefined, { message: 'Please enter a valid URL' })
  url: string;
}
