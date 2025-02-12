import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  
  canActivate (
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    //checks if authorization header is present 
    if (!authHeader) {
      console.log('Authorization header is missing');
      throw new UnauthorizedException('Authorization header is missing');
    }

    const token = authHeader.split(' ')[1]; //Extract the JWT TOKEN

    try { 
      //validate the token and attach the decoded payload to the request object
      const decoded = this.authService.validate(token);

      console.log('Token validation successful:', decoded);
      
      request.user = decoded; // Add the decoded user info to the request Object
      
      return true; //Allow access
    }
    catch (error){
      console.log('Token Validation failed:', error.message);
      throw new UnauthorizedException ('Invalid or expired token')
    };
  }
}
