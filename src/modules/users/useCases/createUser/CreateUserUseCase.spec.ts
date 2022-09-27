import { User } from "../../entities/User";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase"
import { ICreateUserDTO } from "./ICreateUserDTO";

let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let user_dto: ICreateUserDTO;

describe("Create User", () => {
  beforeAll(async () => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);

    user_dto = {
      name: "test",
      email: "test@test.com",
      password: "123"
    }
  });

  it("should be create a user", async () => {
    let user = await createUserUseCase.execute(user_dto);~

    expect(user).toHaveProperty("id");
    expect(user.id).toBeTruthy();
  });

  it("should not be create a user with an email", () => {
    expect(async () => {
      await createUserUseCase.execute(user_dto);
      await createUserUseCase.execute(user_dto);
    }).rejects.toBeInstanceOf(CreateUserError);
  })
});
