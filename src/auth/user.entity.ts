import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  // Stores a hash of the latest refresh token for token rotation and revocation
  @Column({ type: 'varchar', nullable: true })
  refreshTokenHash?: string | null;
}
