import { SalaValidator } from "../patterns/chainOfResponsibility/SalaValidator";
import { SalaRepository } from "../repository/salaRepository";

//Mock da instância do repositório
jest.mock("../repository/salaRepository", () => {
    return {
        SalaRepository: {
            getInstance: jest.fn().mockReturnValue({
                filtrarSalaById: jest.fn(), // será sobrescrito nos testes
            }),
        },
    };
});

describe("SalaValidator", () => {
    let salaValidator: SalaValidator;
    let mockFiltrarSalaById: jest.Mock;

    beforeEach(() => {
        salaValidator = new SalaValidator();
        const repoInstance = SalaRepository.getInstance();
        mockFiltrarSalaById = repoInstance.filtrarSalaById as jest.Mock;
    });

    it("deve lançar erro se a salaId for inválida", async () => {
        await expect(salaValidator.validate({sala_id: "abc"})).rejects.toThrow("O ID informado não é válido");
    });

    it("deve lançar erro se a sala não for encontrada", async () => {
        mockFiltrarSalaById.mockResolvedValueOnce(null); // retorna null do banco;
        await expect(salaValidator.validate({sala_id: "123"})).rejects.toThrow("Sala com ID 123 não encontrada");
    })

    it("deve passar na validação se o usuário existir", async () => {
        mockFiltrarSalaById.mockResolvedValueOnce({id: 123, numero: 123});
        await expect(salaValidator.validate({sala_id: "123"})).resolves.toBeUndefined(); // passa sem erro
    })
})
