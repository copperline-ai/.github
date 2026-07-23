export interface User {
  id: string;
  name: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  /** UTC offset in seconds, as returned by OpenWeatherMap */
  timezone: number;
  city?: string;
}

export type NewUser = Omit<User, "id">;
export type UserPatch = Partial<NewUser>;

export interface UserRepository {
  readonly backend: string;
  list(): Promise<User[]>;
  get(id: string): Promise<User | null>;
  create(data: NewUser): Promise<User>;
  update(id: string, patch: UserPatch): Promise<User | null>;
  delete(id: string): Promise<boolean>;
}
