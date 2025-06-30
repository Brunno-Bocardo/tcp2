import { LoginRequestDto } from "../dto/LoginRequestDto";
import { User } from "./IUser";

export interface ILogin {
    login(userData: LoginRequestDto): Promise<User>;
}
