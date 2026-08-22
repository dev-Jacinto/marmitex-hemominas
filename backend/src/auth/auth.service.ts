import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(cpf: string, senha: string) {
    const user = await this.usersService.findByCpf(cpf);

    if (!user || !user.senhaHash) {
      throw new UnauthorizedException('CPF ou senha inválidos');
    }

    const senhaCorreta = await bcrypt.compare(senha, user.senhaHash);

    if (!senhaCorreta) {
      throw new UnauthorizedException('CPF ou senha inválidos');
    }

    const payload = { sub: user.id, cpf: user.cpf, nome: user.nome };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        nome: user.nome,
        cpf: user.cpf,
      },
    };
  }
}
