import { User } from "../../../users/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

let createStatementUseCase: CreateStatementUseCase;
let statementsRepository: InMemoryStatementsRepository;

let user_dto: ICreateUserDTO;
let user: User;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Create Statement Test", () => {
  beforeAll(async () => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();

    createUserUseCase = new CreateUserUseCase(usersRepository);
    createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository);

    user_dto = {
      name: "test",
      email: "test@test.com",
      password: "123"
    }

    user = await createUserUseCase.execute(user_dto);
  });

  it("should not be execute a statement with an insuficient funds", () => {

    expect(async () => {
      const statement = await createStatementUseCase.execute({
        user_id: user.id as string,
        type: "withdraw" as OperationType,
        amount: 100,
        description: "description"
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
  });

  it("should not be execute a statement with an invalid user", () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: "non_user",
        type: "deposit" as OperationType,
        amount: 100,
        description: "description"
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("should be execute a statement with an valid user", async () => {

    const statement = await createStatementUseCase.execute({
      user_id: user.id as string,
      type: "deposit" as OperationType,
      amount: 100,
      description: "description"
    });

    expect(statement.id).toBeTruthy();
  });

  it("should be execute a statement with an suficient funds", async () => {
    const statement = await createStatementUseCase.execute({
      user_id: user.id as string,
      type: "withdraw" as OperationType,
      amount: 100,
      description: "description"
    });

    expect(statement.id).toBeTruthy();
  });
})
