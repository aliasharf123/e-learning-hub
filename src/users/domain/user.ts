import { Exclude, Expose } from 'class-transformer';
import { FileType } from 'src/files/domain/file';
import { RoleEntity } from 'src/roles/entities/role.entity';
import { Status } from 'src/statuses/domain/status';

export class User {
  id: number | string;

  @Expose({ groups: ['me', 'admin'] })
  email: string | null;

  @Exclude({ toPlainOnly: true })
  password?: string;

  @Exclude({ toPlainOnly: true })
  previousPassword?: string;

  @Expose({ groups: ['me', 'admin'] })
  provider: string;

  @Expose({ groups: ['me', 'admin'] })
  socialId?: string | null;
  firstName: string | null;
  lastName: string | null;
  photo?: FileType | null;
  role?: RoleEntity | null;
  status?: Status;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
