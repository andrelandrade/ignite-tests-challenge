import { User } from "../../../users/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { Statement } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";


let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

let createStatementUseCase: CreateStatementUseCase;
let statementsRepository: InMemoryStatementsRepository;

let getStatementOperationUseCase: GetStatementOperationUseCase;

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

    getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepository, statementsRepository)

    createUserUseCase = new CreateUserUseCase(usersRepository);
    createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository);

    user_dto = {
      name: "test",
      email: "test@test.com",
      password: "123"
    }

    user = await createUserUseCase.execute(user_dto);
    statement = await createStatementUseCase.execute({
      user_id: user.id as string,
      type: "deposit" as OperationType,
      amount: 100,
      description: "description"
    });
  });

  it("should not be execute a get statement with an invalid user", () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: 'non_user',
        statement_id: statement.id as string
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("should not be execute a get statement with an invalid statement", () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: statement.user_id,
        statement_id: 'invalid statement id' as string
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });

  it("should be execute a get statement", async() => {
    const statement_operation = await getStatementOperationUseCase.execute({
        user_id: statement.user_id,
        statement_id: statement.id as string
    });

    expect(statement_operation.id).toEqual(statement.id);
  });

});
