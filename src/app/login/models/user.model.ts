export interface User {
  uid?: string;
  correo: string;
  clave?: string;
  perfil: perfil;
  sexo: sexo;
}

export type perfil = 'admin' | 'invitado' | 'usuario' | 'tester';
export type sexo = 'masculino' | 'femenino' | 'no binario' | 'no especificado';
