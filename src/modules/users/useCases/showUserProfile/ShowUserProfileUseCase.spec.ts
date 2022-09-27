import { User } from "../../entities/User";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

describe("Show User Profile Test", () => {
  let user_dto: ICreateUserDTO;
  let usersRepository: InMemoryUsersRepository;
  let createUserUseCase: CreateUserUseCase;
  let showUserProfileUseCase: ShowUserProfileUseCase;

  let user: User;

  beforeAll(async () => {
    usersRepository = new InMemoryUsersRepository();

    createUserUseCase = new CreateUserUseCase(usersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);

    user_dto = {
      name: "test",
      email: "test@test.com",
      password: "123"
    }

    user = await createUserUseCase.execute(user_dto);
  });

  it("should not show a profile for invalid user", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute('an_id')
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });

  it("should show a profile for valid user", async () => {
    const profile = await showUserProfileUseCase.execute(user.id as string)

    expect(profile.id).toBeTruthy();
  });
});
