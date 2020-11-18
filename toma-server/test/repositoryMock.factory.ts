import { Repository } from "typeorm";
import { MockType } from "./mock.type";
//@ts-ignore
export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
  () => ({
    findOne: jest.fn(entity => entity),
    findAndCount: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    // ...
  }),
);
