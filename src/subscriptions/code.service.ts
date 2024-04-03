import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CodeEntity } from './entities/code.entity';
import { Repository } from 'typeorm';
import { PlanEntity } from 'src/plan/entities/plan.entity';

@Injectable()
export class CodeService {
  constructor(
    @InjectRepository(CodeEntity)
    private readonly codeRepository: Repository<CodeEntity>,
  ) {}

  async create(plan: PlanEntity) {
    const code = new CodeEntity();
    code.code = await this.generateUniqueCode();
    code.plan = plan;
    return this.codeRepository.save(code);
  }

  async activate(code: string, planID: number) {
    const codeEntity = await this.codeRepository.findOne({
      where: { code },
      relations: {
        plan: true,
      },
    });
    if (!codeEntity) {
      throw new ConflictException('Code not found');
    }
    const plan = codeEntity.plan;

    if (plan.id !== planID) {
      throw new ConflictException("Code doesn't match the plan");
    }

    await this.codeRepository.delete({ code });

    return plan;
  }

  async deactivate(code: string) {
    const codeEntity = await this.codeRepository.delete({ code });
    if (codeEntity.affected === 0) {
      throw new ConflictException('Code not found');
    }
    return { message: 'Code deactivated' };
  }

  /** ChatGPT Link: https://chat.openai.com/share/9088ee52-7e55-489f-8c77-9cd2c8baff7a
   * Generates a unique code.
   * @param characters - The characters to use in the code.
   * @returns The generated code.
   */
  async generateUniqueCode(
    characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
  ): Promise<string> {
    let code: string;
    const characterLength = characters.length;

    do {
      code = '';
      for (let i = 0; i < 8; i++) {
        code += characters.charAt(Math.floor(Math.random() * characterLength));
      }
    } while (await this.codeExists(code)); // Replace with your logic to check for existing codes

    return code;
  }

  async codeExists(code: string): Promise<boolean> {
    const codeEntity = await this.codeRepository.findOne({ where: { code } });

    return !!codeEntity;
  }
}
