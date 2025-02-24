import { JWTInfo, JWTTData } from './auth-model';

export interface IAuthService {

    generateToken(email: string, password: string): Promise<JWTInfo>

}
