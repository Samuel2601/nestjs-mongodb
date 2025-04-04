import { Injectable } from '@nestjs/common';
import { PersonRepository } from 'src/domain/repositories/general/person-repository';
import { PersonMapper } from 'src/application/mappers/general/person-mapper';
import { PersonResponseDto } from 'src/application/dtos/general/person/person-response-dto';

@Injectable()
export class FindPersonByNameUseCase {
  constructor(
    private readonly personRepository: PersonRepository,
    private readonly personMapper: PersonMapper,
  ) {}

  /**
   * Ejecuta el caso de uso para buscar personas por nombre y apellido
   * @param firstName Nombre
   * @param lastName Apellido
   * @returns Lista de personas encontradas
   */
  async execute(firstName: string, lastName: string): Promise<PersonResponseDto[]> {
    // Buscar personas por nombre y apellido
    const persons = await this.personRepository.findByName(firstName, lastName);

    // Convertir las entidades a DTOs de respuesta
    return this.personMapper.toResponseDtos(persons);
  }
}