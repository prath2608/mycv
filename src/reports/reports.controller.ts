import { Body, Controller, Post,UseGuards,Get,Patch,Param,Query } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../guards/auth.gurads';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { ReportDto } from '../users/dtos/report.dto';
import {Serialize} from '../interceptor/serialize.interceptor';
import { ApproveReportDto } from './dtos/ApproveReportDto.dto';
import { AdminGuard } from '../guards/admin.guard';
import { GetEstimateDto } from './dtos/get-estimateDto.dto';



@Controller('reports')
export class ReportsController {
    constructor(private reportsService: ReportsService

    ) {}

    @Post()
    @UseGuards(AuthGuard)
    @Serialize(ReportDto) // Serialize the response using ReportDto
    createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
        // Logic to create a report

        return this.reportsService.create(body, user);
    }


    @Patch('/:id')
    @UseGuards(AdminGuard)
    approveReport(@Param('id') id: string,@Body() body: ApproveReportDto) {
        // Logic to approve a report
        // Assuming body contains the necessary data for approval
        return this.reportsService.changeApproval(id, body.approved);
    }


      @Get()
    getEstimate(
        @Query() query: GetEstimateDto){
            return this.reportsService.createEstimate(query);
            
        }

    

    // @Get()

    // @UseGuards(AuthGuard)
    // getReports() {
    //     return this.reportsService.findAll();
    // }
}

