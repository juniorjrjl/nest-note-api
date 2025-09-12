import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JWTInfo, JWTTData } from '../auth-model';
import { JwtService } from '@nestjs/jwt';
import { IUsersQueryService } from '../../users/iusers-query.service';
import { USERS_SERVICE_TOKENS } from '../../users/token/users.token';
import { IAuthService } from '../iauth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService implements IAuthService {

    constructor(
        @Inject(USERS_SERVICE_TOKENS.QUERY_SERVICE) private readonly queryService: IUsersQueryService,
        private readonly jwtService: JwtService,
        private configService: ConfigService
    ) { }

    public async generateToken(email: string, password: string): Promise<JWTInfo> {
        const exception = new UnauthorizedException('Usuário e/ou senha invalidos')
        try {
            const user = await this.queryService.findByEmail(email)
            if (!(await this.queryService.passwordIsMatch(password, user.password))) {
                throw exception;
            }
            return this.generateAccessToken({ id: user.id, email })
        } catch (ex) {
            if (ex instanceof NotFoundException) {
                throw exception
            }
            throw ex
        }
    }

    private async generateAccessToken(jwtData: JWTTData): Promise<JWTInfo> {
        const expiresInMs = 120 * 1000
        const accessTokenExpiresIn = Date.now() + expiresInMs
        const accessToken = await this.jwtService.signAsync({ ...jwtData }, { secret: this.configService.get<string>('JWT_SECRETE_KEY'), expiresIn: '120s' })
        return {
            accessToken,
            accessTokenExpiresIn
        }
    }

}
