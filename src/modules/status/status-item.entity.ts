import { ApiProperty } from "@nestjs/swagger";
export class StatusItem {
  @ApiProperty({
    type: Number,
  })
  length?: number;
  @ApiProperty({
    type: String,
  })
  error?: string;
}
