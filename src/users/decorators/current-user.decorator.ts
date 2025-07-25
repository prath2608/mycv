import { createParamDecorator,ExecutionContext } from "@nestjs/common";

export const CurrentUser = createParamDecorator(
    (data: any, contex: ExecutionContext) => {
        const request = contex.switchToHttp().getRequest();
        console.log( request.session.userId);
        return request.CurrentUser || request.session.userId;
    },
);

