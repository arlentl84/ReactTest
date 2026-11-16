import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import * as api from "./services/api";

vi.mock("./services/api");

const mockUsers = [
  { id: 1, name: "Leanne Graham", username: "Bret", email: "leanne@test.com" },
  {
    id: 2,
    name: "Ervin Howell",
    username: "Antonette",
    email: "ervin@test.com",
  },
];

const mockPosts = [
  { id: 10, userId: 1, title: "Primer post", body: "Contenido inicial" },
];

describe("Aplicación de Usuarios y Publicaciones", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("1. Muestra la lista de usuarios y permite filtrar por nombre", async () => {
    vi.mocked(api.getUsers).mockResolvedValue(mockUsers);
    render(<App />);

    expect(screen.getByText(/cargando usuarios/i)).toBeInTheDocument();

    expect(await screen.findByText("Leanne Graham")).toBeInTheDocument();
    expect(screen.getByText("Ervin Howell")).toBeInTheDocument();

    const searchInput = screen.getByLabelText(/buscar usuario/i);
    await userEvent.type(searchInput, "Ervin");

    expect(screen.queryByText("Leanne Graham")).not.toBeInTheDocument();
    expect(screen.getByText("Ervin Howell")).toBeInTheDocument();
  });

  it("2. Muestra un mensaje de error si falla la carga de usuarios", async () => {
    vi.mocked(api.getUsers).mockRejectedValue(new Error("Fallo de red"));
    render(<App />);

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/no se pudieron cargar los usuarios/i);
  });

  it("3. Valida que el título y texto sean obligatorios al crear un post", async () => {
    vi.mocked(api.getUsers).mockResolvedValue(mockUsers);
    vi.mocked(api.getPostsByUser).mockResolvedValue(mockPosts);
    render(<App />);

    const userButton = await screen.findByText("Leanne Graham");
    await userEvent.click(userButton);

    await screen.findByText("Primer post");

    const submitButton = screen.getByRole("button", { name: /publicar/i });
    await userEvent.click(submitButton);

    const titleInput = screen.getByLabelText(/título/i);
    const bodyInput = screen.getByLabelText(/texto/i);

    expect(titleInput).toHaveAttribute("aria-invalid", "true");
    expect(bodyInput).toHaveAttribute("aria-invalid", "true");

    expect(titleInput).toHaveFocus();

    expect(await screen.findByText(/título.*obligatorio/i)).toBeInTheDocument();
    expect(screen.getByText(/texto.*obligatorio/i)).toBeInTheDocument();

    expect(api.createPost).not.toHaveBeenCalled();
  });

  it("4. Permite seleccionar un usuario, ver sus posts y agregar uno nuevo a la lista", async () => {
    vi.mocked(api.getUsers).mockResolvedValue(mockUsers);
    vi.mocked(api.getPostsByUser).mockResolvedValue(mockPosts);
    vi.mocked(api.createPost).mockResolvedValue({
      id: 101,
      userId: 1,
      title: "Nuevo Título",
      body: "Nuevo Contenido",
    });

    render(<App />);

    await userEvent.click(await screen.findByText("Leanne Graham"));
    expect(await screen.findByText("Primer post")).toBeInTheDocument();

    await userEvent.type(screen.getByLabelText(/título/i), "Nuevo Título");
    await userEvent.type(screen.getByLabelText(/texto/i), "Nuevo Contenido");
    await userEvent.click(screen.getByRole("button", { name: /publicar/i }));

    await waitFor(() => {
      expect(screen.getByText("Nuevo Título")).toBeInTheDocument();
      expect(screen.getByText("Nuevo Contenido")).toBeInTheDocument();
    });
  });
});
