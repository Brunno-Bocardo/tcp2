import { UserValidator } from "../patterns/chainOfResponsibility/UserValidator";
import { UserRepository } from "../repository/userRepository";

// Mock da instância do repositório
jest.mock("../repository/userRepository", () => {
    return {
    UserRepository: {
      getInstance: jest.fn().mockReturnValue({
        filtraUsuarioById: jest.fn(), // será sobrescrito nos testes
      }),
    },
  };
});

describe("UserValidator", () => {
    let userValidator: UserValidator;
    let mockFiltraUsuarioById: jest.Mock;
    
    beforeEach(() => {
        userValidator = new UserValidator();
        const repoInstance = UserRepository.getInstance();
        mockFiltraUsuarioById = repoInstance.filtraUsuarioById as jest.Mock;
    });

    it("deve lançar erro se o userId for inválido", async () => {
        await expect(userValidator.validate({user_id: "abc"})).rejects.toThrow("O ID informado não é válido");
    });

    it("deve lançar erro se o usuário não for encontrado", async () => {
        mockFiltraUsuarioById.mockResolvedValueOnce(null); // retorna null do banco;
        await expect(userValidator.validate({user_id: "123"})).rejects.toThrow("Usuário com ID 123 não encontrado");
    })

    it("deve passar na validação se o usuário existir", async () => {
        mockFiltraUsuarioById.mockResolvedValueOnce({id: 123, nome: "Teste"});

        await expect(userValidator.validate({user_id: "123"})).resolves.toBeUndefined(); // passa sem erro
    })
})