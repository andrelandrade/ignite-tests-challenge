import { User } from "../../../users/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { Statement } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "../getStatementOperation/GetStatementOperationUseCase";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";


let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

let createStatementUseCase: CreateStatementUseCase;
let statementsRepository: InMemoryStatementsRepository;

let getBalanceUseCase: GetBalanceUseCase;

let user_dto: ICreateUserDTO;
let user: User;
let statement: Statement;

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

    getBalanceUseCase = new GetBalanceUseCase(statementsRepository, usersRepository);

    user_dto = {
      name: "test",
      email: "test@test.com",
      password: "123"
    }

    user = await createUserUseCase.execute(user_dto);
    await createStatementUseCase.execute({
      user_id: user.id as string,
      type: "deposit" as OperationType,
      amount: 100,
      description: "description"
    });

    await createStatementUseCase.execute({
      user_id: user.id as string,
      type: "deposit" as OperationType,
      amount: 100,
      description: "description"
    });

    await createStatementUseCase.execute({
      user_id: user.id as string,
      type: "withdraw" as OperationType,
      amount: 50,
      description: "description"
    });
  });

  it("should not be execute a get balance with an invalid user", () => {
    expect(async () => {
      await getBalanceUseCase.execute({
        user_id: 'non_user'
      });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });

  it("should be execute a get statement with an valid user", async () => {
    let balance = await getBalanceUseCase.execute({
        user_id: user.id as string
    });

    expect(balance.balance).toEqual(150);
  });
});
