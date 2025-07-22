import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { from, lastValueFrom, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.handleAccess(request, next));
  }

  private async handleAccess(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
    const securedEndpoints = ['https://localhost:8443/api/orders'];

    if (securedEndpoints.some((url) => request.urlWithParams.includes(url))) {
      await this.auth.getAccessTokenSilently().forEach((token) => {
        console.log('Access Token: ', token);
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
      });
    }

    return await lastValueFrom(next.handle(request));
  }
}

/*
✅ If your backend is on 8080 and SSL is disabled:
Backend URL → http://localhost:8080
✅ Your frontend must also run on http:// (e.g., http://localhost:4200)
❌ If the frontend runs on https://, browser will block requests to http:// due to mixed content security policy

✅ If your backend is on 8443 and SSL is enabled: (server.ssl.enabled=true in springboot app.properties file)
Backend URL → https://localhost:8443
✅ Your frontend must also use https://
❌ If frontend is on http://, browser will again block requests due to mixed content

🔒 Browser Rule (Mixed Content):
Frontend and backend protocols must match:
http ⇔ http ✅
https ⇔ https ✅
http ⇔ https ❌
https ⇔ http ❌

🔐 Port ↔ Protocol (General Convention):
Port	Protocol	Example URL
80	HTTP	http://yourdomain.com
443	HTTPS	https://yourdomain.com
8080	HTTP	http://localhost:8080
8443	HTTPS	https://localhost:8443
*/