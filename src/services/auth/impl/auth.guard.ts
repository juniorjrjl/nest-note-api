import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from 'express';
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private readonly jwtService: JwtService,
        private readonly reflector: Reflector,
        private configService: ConfigService) { }

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()])
        if (isPublic) {
            return true
        }
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request)
        if (!token) {
            throw new UnauthorizedException("Para realizar essa operação é necessario estar logado");
        }
        try {
            const payload = await this.jwtService.verifyAsync(token, { secret: this.configService.get<string>('JWT_SECRETE_KEY') })
            request['user'] = payload
        } catch {
            throw new UnauthorizedException("Para realizar essa operação é necessario estar logado");
        }
        return true
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined
    }

}