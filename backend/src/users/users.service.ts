import { Injectable, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const cpfExistente = await this.prisma.user.findUnique({
      where: { cpf: createUserDto.cpf },
    });

    if (cpfExistente) {
      throw new ConflictException('Já existe um usuário cadastrado com esse CPF');
    }

    let senhaHash: string | undefined = undefined;
    if (createUserDto.senha) {
      senhaHash = await bcrypt.hash(createUserDto.senha, 10);
    }

    return this.prisma.user.create({
      data: {
        nome: createUserDto.nome,
        cpf: createUserDto.cpf,
        dataNascimento: new Date(createUserDto.dataNascimento),
        senhaHash,
        googleId: createUserDto.googleId,
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  findByCpf(cpf: string) {
    return this.prisma.user.findUnique({ where: { cpf } });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  remove(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
