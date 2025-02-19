interface AuthorInfoProps {
  name?: string;
  dob?: string;
  bio?: string;
  nationality?: string;
}

export class AuthorInfo {
  constructor(private props: AuthorInfoProps = {}) {}

  get name() {
    return this.props.name ?? "";
  }
  get dob() {
    return this.props.dob ?? "";
  }
  get bio() {
    return this.props.bio ?? "";
  }
  get nationality() {
    return this.props.nationality ?? "";
  }

  toJson(): AuthorInfoProps {
    return { ...this.props };
  }

  public static mapFromRaw(data: Partial<AuthorInfoProps> = {}): AuthorInfo {
    if (!data || typeof data !== "object") {
      console.warn("Invalid author info data, using default values.");
      return new AuthorInfo();
    }
    return new AuthorInfo(data);
  }
}
