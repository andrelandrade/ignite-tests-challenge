import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

describe("Authenticate User Test", () => {
  let user_dto: ICreateUserDTO;
  let usersRepository: InMemoryUsersRepository;
  let createUserUseCase: CreateUserUseCase;
  let authenticateUserUseCase: AuthenticateUserUseCase;

  beforeAll(async () => {
    usersRepository = new InMemoryUsersRepository();

    createUserUseCase = new CreateUserUseCase(usersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);

    user_dto = {
      name: "test",
      email: "test@test.com",
      password: "123"
    }

    await createUserUseCase.execute(user_dto);
  });

  it("should be not authenticate a invalid email", () => {

    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "tester@test.com",
        password: user_dto.password
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should be not authenticate a invalid password", () => {

    expect(async () => {
      await authenticateUserUseCase.execute({
        email: user_dto.email,
        password: "1232"
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should be authenticate a valid user", async () => {

    const { user, token } = await authenticateUserUseCase.execute({
      email: user_dto.email,
      password: user_dto.password
    });

    expect(user.id).toBeTruthy();
    expect(token).toBeTruthy();
  });
});
