import { Module } from '@nestjs/common'

import { ListReportModule } from './list-report/list-report.module'

@Module({
  imports: [ListReportModule],
})
export class AppModule {}
