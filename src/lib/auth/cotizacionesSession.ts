import { SignJWT, jwtVerify } from 'jose';

// Sesión de la vista admin de cotizaciones (/portal/cotizaciones).
// Es una pantalla protegida por una contraseña compartida; al validarla se emite
// este token de alcance acotado en una cookie httpOnly, y el endpoint de listado
// lo exige. Así los datos personales dejan de ser accesibles sin autenticación.

export const COTIZACIONES_COOKIE = 'cotizaciones-token';

function getSecret() {
  return new TextEncoder().encode(process.env.JWT_SECRET!);
}

export async function signCotizacionesToken(): Promise<string> {
  return new SignJWT({ scope: 'cotizaciones' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('12h')
    .setIssuedAt()
    .sign(getSecret());
}

export async function verifyCotizacionesToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload.scope === 'cotizaciones';
  } catch {
    return false;
  }
}
