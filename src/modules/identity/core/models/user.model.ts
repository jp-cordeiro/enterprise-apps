type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export class UserModel {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  private constructor(data: UserModel) {
    Object.assign(this, data);
  }

  static create(
    data: WithOptional<
      UserModel,
      'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
    >,
  ): UserModel {
    const user = new UserModel({
      ...data,
      id: data.id || crypto.randomUUID(),
      createdAt: data.createdAt || new Date(),
      updatedAt: data.updatedAt || new Date(),
      deletedAt: data.deletedAt || null,
    });
    return user;
  }

  static createFrom(data: UserModel): UserModel {
    return new UserModel(data);
  }
}
