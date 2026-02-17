import { BaseMapper } from "./base.mapper";

class TestMapper extends BaseMapper<string, number> {
  toDomain(ormEntity: number): string {
    return `domain-${ormEntity}`;
  }

  toOrm(domainEntity: string): number {
    return parseInt(domainEntity.replace("domain-", ""), 10);
  }
}

describe("BaseMapper", () => {
  let mapper: TestMapper;

  beforeEach(() => {
    mapper = new TestMapper();
  });

  it("deve converter array de orm para domain", () => {
    const ormEntities = [1, 2, 3];

    const result = mapper.toDomainArray(ormEntities);

    expect(result).toEqual(["domain-1", "domain-2", "domain-3"]);
  });

  it("deve converter array de domain para orm", () => {
    const domainEntities = ["domain-1", "domain-2", "domain-3"];

    const result = mapper.toOrmArray(domainEntities);

    expect(result).toEqual([1, 2, 3]);
  });

  it("deve retornar array vazio ao converter orm vazio", () => {
    const result = mapper.toDomainArray([]);

    expect(result).toEqual([]);
  });

  it("deve retornar array vazio ao converter domain vazio", () => {
    const result = mapper.toOrmArray([]);

    expect(result).toEqual([]);
  });
});
