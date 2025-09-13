import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JWTInfo } from "../auth-model";
import { IAuthService } from "../iauth.service";
import { AUTH_SERVICE_TOKENS } from "../tokens/auth.token";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {

    constructor(
        @Inject(AUTH_SERVICE_TOKENS.SERVICE) private readonly authService: IAuthService,
        configService: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<string>('JWT_SECRET_KEY'),
            passReqToCallback: true
        })
    }

    public async validate(email: string, password: string): Promise<JWTInfo> {
        return await this.authService.generateToken(email, password)
    }

}