import { JWTInfo, JWTTData } from './auth-model';

export interface IAuthQueryService {

    validateUser(email: string, password: string): Promise<JWTInfo>

}
