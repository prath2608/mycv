import { IsNumber, IsString ,Max,Min,IsLongitude,IsLatitude} from "class-validator";

export class CreateReportDto{
    @IsString()
    make: string;

    @IsNumber()
    @Min(1930)
    @Max(new Date().getFullYear())
    year: number;

    @IsString()
    model: string;

    @IsNumber()
    @Min(0)
    @Max(1000000)
    price: number;

    @IsLongitude()
    @IsNumber()
    lng: number;

    @IsLatitude()
    @IsNumber()
    lat: number;

    @IsNumber()
    @Min(0)
    @Max(1000000)
    mileage: number;


}